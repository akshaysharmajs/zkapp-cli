import { Json, AccountUpdate, ZkappCommand } from '../../bindings/mina-transaction/gen/v1/transaction-bigint.js';
import { NetworkId } from './types.js';
export { signZkappCommand, verifyZkappCommandSignature };
export { transactionCommitments, verifyAccountUpdateSignature, accountUpdatesToCallForest, callForestHash, callForestHashGeneric, accountUpdateHash, feePayerHash, createFeePayer, accountUpdateFromFeePayer, isCallDepthValid, CallForest, };
/**
 * Signs a zkApp command JSON object with the provided private key.
 *
 * This function applies a Schnorr signature to the fee payer and any account
 * updates within the command that require signatures and are owned by the same
 * public key.
 *
 * If this method is not called as the fee payer (i.e. the private key provided
 * does not match the fee payer's public key), the fee payer authorization will
 * remain unsigned after this method returns. This behavior allows for collaborative
 * construction of zkApp commands where two different users sign the account update
 * and pay the fee.
 *
 * @param zkappCommand_ - The zkApp command in JSON format, before signatures.
 * @param privateKeyBase58 - The Base58-encoded private key used for signing.
 * @param networkId - The network identifier that determines the signature domain.
 * @returns The signed zkApp command in JSON format.
 */
declare function signZkappCommand(zkappCommand_: Json.ZkappCommand, privateKeyBase58: string, networkId: NetworkId): Json.ZkappCommand;
/**
 * Verifies the signature of a zkApp command JSON object.
 *
 * This function verifies the signatures of the fee payer and any account
 * updates within the command that require signatures and are owned by the
 * same public key.
 *
 * @param zkappCommand_ - The zkApp command in JSON format, after signatures.
 * @param publicKeyBase58 - The Base58-encoded public key used for verification.
 * @param networkId - The network identifier that determines the signature domain.
 * @param feePayerPublicKeyBase58 - Optional Base58-encoded public key of the fee
 *                            payer, required if the provided public key does not
 *                            match the fee payer's public key.
 * @returns True if the signature is valid, false otherwise.
 *
 * @warning To verify the zkApp command signature, the public key must match the
 * fee payer's public key, or the parameter `feePayerPublicKey` must be provided.
 */
declare function verifyZkappCommandSignature(zkappCommand_: Json.ZkappCommand, publicKeyBase58: string, networkId: NetworkId, feePayerPublicKeyBase58?: string): boolean;
declare function verifyAccountUpdateSignature(update: AccountUpdate, transactionCommitments: {
    commitment: bigint;
    fullCommitment: bigint;
}, networkId: NetworkId): boolean;
declare function transactionCommitments(zkappCommand: ZkappCommand, networkId: NetworkId): {
    commitment: bigint;
    fullCommitment: bigint;
};
type CallTree<AccountUpdate> = {
    accountUpdate: AccountUpdate;
    children: CallForest<AccountUpdate>;
};
type CallForest<AccountUpdate> = CallTree<AccountUpdate>[];
/**
 * Turn flat list into a hierarchical structure (forest) by letting the callDepth
 * determine parent-child relationships
 */
declare function accountUpdatesToCallForest<A extends {
    body: {
        callDepth: number;
    };
}>(updates: A[], callDepth?: number): CallForest<A>;
declare function accountUpdateHash(update: AccountUpdate, networkId: NetworkId): bigint;
declare function callForestHash(forest: CallForest<AccountUpdate>, networkId: NetworkId): bigint;
declare function callForestHashGeneric<A, F>(forest: CallForest<A>, hash: (a: A, networkId: NetworkId) => F, hashWithPrefix: (prefix: string, input: F[]) => F, emptyHash: F, networkId: NetworkId): F;
type FeePayer = ZkappCommand['feePayer'];
declare function createFeePayer(feePayer: FeePayer['body']): FeePayer;
declare function feePayerHash(feePayer: FeePayer, networkId: NetworkId): bigint;
declare function accountUpdateFromFeePayer({ body: { fee, nonce, publicKey, validUntil }, authorization: signature, }: FeePayer): AccountUpdate;
declare function isCallDepthValid(zkappCommand: ZkappCommand): boolean;
