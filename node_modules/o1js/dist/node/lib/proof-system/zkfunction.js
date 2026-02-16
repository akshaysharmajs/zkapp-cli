import { getRustConversion } from '../../bindings/crypto/bindings.js';
import { Pickles, Snarky, initializeBindings, wasm, withThreadPool } from '../../bindings.js';
import { MlFieldArray, MlFieldConstArray } from '../ml/fields.js';
import { gatesFromJson, printGates, snarkContext, summarizeGates, } from '../provable/core/provable-context.js';
import { Provable } from '../provable/provable.js';
import { provablePure } from '../provable/types/provable-derivers.js';
import { Field } from '../provable/wrapped.js';
import { prettifyStacktrace, prettifyStacktracePromise } from '../util/errors.js';
// external API
export { KimchiProof, KimchiVerificationKey, ZkFunction };
function ZkFunction(config) {
    const publicInputType = provablePure(config.publicInputType ?? undefined);
    const hasPublicInput = config.publicInputType !== undefined;
    let _keypair;
    return {
        /**
         * Generates and stores a proving key and a verification key for this circuit(ZkFunction).
         *
         * @returns The generated verification key.
         *
         * @example
         * ```ts
         * const { verificationKey } = await zkf.compile();
         * ```
         * @warning Must be called before `prove` or `analyzeMethod`.
         */
        async compile() {
            const main = mainFromCircuitData(config);
            const publicInputSize = publicInputType.sizeInFields();
            const lazyMode = config.lazyMode ?? false;
            await initializeBindings();
            _keypair = await prettifyStacktracePromise(withThreadPool(async () => {
                return Snarky.circuit.compile(main, publicInputSize, lazyMode);
            }));
            const verificationKey = new KimchiVerificationKey(Snarky.circuit.keypair.getVerificationKey(_keypair));
            return { verificationKey };
        },
        /**
         * Returns a low-level JSON representation of the constraint system (gates)
         *
         * @throws If compile() has not been called yet.
         *
         * @example
         * ```ts
         * await zkf.compile();
         * const cs = zkf.analyzeMethod();
         * console.log(cs);
         * ```
         */
        analyzeMethod() {
            if (!_keypair)
                throw new Error('Cannot find prover artifacts. Please call compile() first!');
            try {
                let { gates, publicInputSize } = gatesFromJson(Snarky.circuit.keypair.getConstraintSystemJSON(_keypair));
                return {
                    rows: gates.length,
                    gates,
                    publicInputSize,
                    print() {
                        printGates(gates);
                    },
                    summary() {
                        return summarizeGates(gates);
                    },
                };
            }
            catch (error) {
                throw prettifyStacktrace(error);
            }
        },
        /**
         * Proves a statement using the public input and private inputs of the circuit(ZkFunction).
         *
         * @param publicInput The public input to the circuit if it exists.
         * @param privateInputs The private inputs to the circuit.
         * @returns The generated proof.
         *
         * @throws If `compile` has not been called.
         *
         * @example
         * ```ts
         * const { verificationKey } = await zkf.compile();
         * const proof = await zkf.prove(publicInput, privateInput1, privateInput2);
         * ```
         */
        async prove(...args) {
            if (!_keypair)
                throw new Error('Cannot find prover artifacts. Please call compile() first!');
            const publicInput = hasPublicInput ? args[0] : undefined;
            const privateInputs = (hasPublicInput ? args.slice(1) : args);
            const publicInputSize = publicInputType.sizeInFields();
            const publicInputFields = publicInputType.toFields(publicInput);
            const main = mainFromCircuitData(config, privateInputs);
            await initializeBindings();
            return withThreadPool(async () => {
                const proof = Snarky.circuit.prove(main, publicInputSize, MlFieldConstArray.to(publicInputFields), _keypair);
                return new KimchiProof(proof, publicInputFields);
            });
        },
        /**
         * Verifies a proof using the verification key of the circuit(ZkFunction).
         *
         * @param proof The proof to verify.
         * @param verificationKey The key to verify against.
         *
         * @returns `true` if the proof is valid, otherwise `false`.
         *
         * @example
         * ```ts
         * const { verificationKey } = await zkf.compile();
         * const proof = await zkf.prove(publicInput, privateInput1, privateInput2);
         * const isValid = await zkf.verify(proof, verificationKey);
         * ```
         */
        async verify(proof, verificationKey) {
            return await proof.verify(verificationKey);
        },
    };
}
/**
 * Encapsulates a {@link ZkFunction} proof together with its public input fields.
 *
 * Generated by {@link ZkFunction.prove}, it wraps the raw `Snarky.Proof`
 * and the array of `Field` inputs used for verification.
 *
 * You can call `verify` on a `Proof` to check its validity against a
 * {@link VerificationKey}.
 */
class KimchiProof {
    constructor(value, publicInputFields) {
        this.value = value;
        this.publicInputFields = publicInputFields;
    }
    toJSON() {
        const proofWithEvalsMl = Snarky.circuit.proofToBackendProofEvals(MlFieldConstArray.to(this.publicInputFields), this.value);
        const rustConversion = getRustConversion(wasm);
        const rustProof = rustConversion.fp.proofToRust(proofWithEvalsMl);
        return {
            proof: rustProof.serialize(),
            publicInputFields: this.publicInputFields.map((f) => f.toString()),
        };
    }
    static fromJSON(json) {
        const bytes = Uint8Array.from(Buffer.from(json.proof, 'base64'));
        const rustProof = wasm.WasmFpProverProof.deserialize(bytes);
        const rustConversion = getRustConversion(wasm);
        const proofWithEvalsMl = Snarky.circuit.proofFromBackendProofEvals(rustConversion.fp.proofFromRust(rustProof));
        const publicInputFields = json.publicInputFields.map((s) => Field(s));
        return new KimchiProof(proofWithEvalsMl, publicInputFields);
    }
    /**
     * Verifies this proof using the provided verification key.
     * @param verificationKey The key to verify against.
     * @returns A promise that resolves to `true` if valid, otherwise `false`.
     */
    async verify(verificationKey) {
        await initializeBindings();
        return prettifyStacktracePromise(withThreadPool(async () => Snarky.circuit.verify(MlFieldConstArray.to(this.publicInputFields), this.value, verificationKey.value)));
    }
}
/**
 * A verification key is used to verify a {@link Proof}.
 */
class KimchiVerificationKey {
    constructor(value) {
        this.value = value;
    }
    toString() {
        const rustConversion = getRustConversion(wasm);
        const rustVerifierIndex = rustConversion.fp.verifierIndexToRust(this.value);
        const verifierIndexBase64 = wasm.caml_pasta_fp_plonk_verifier_index_serialize(rustVerifierIndex);
        return Buffer.from(verifierIndexBase64, 'utf8').toString('base64');
    }
    static fromString(base64) {
        const srsFp = Pickles.loadSrsFp();
        const rustVerifierIndex = wasm.caml_pasta_fp_plonk_verifier_index_deserialize(srsFp, Buffer.from(base64, 'base64').toString('utf8'));
        const rustConversion = getRustConversion(wasm);
        const verifierIndexMl = rustConversion.fp.verifierIndexFromRust(rustVerifierIndex);
        return new KimchiVerificationKey(verifierIndexMl);
    }
}
function mainFromCircuitData(config, privateInputs) {
    return function main(publicInputFields) {
        let id = snarkContext.enter({ inCheckedComputation: true });
        try {
            const publicInput = provablePure(config.publicInputType ?? undefined).fromFields(MlFieldArray.from(publicInputFields));
            const privateInputs_ = config.privateInputTypes.map((typ, i) => Provable.witness(typ, () => (privateInputs ? privateInputs[i] : undefined)));
            if (config.publicInputType !== undefined) {
                config.main(publicInput, ...privateInputs_);
            }
            else {
                config.main(...privateInputs_);
            }
        }
        finally {
            snarkContext.leave(id);
        }
    };
}
//# sourceMappingURL=zkfunction.js.map