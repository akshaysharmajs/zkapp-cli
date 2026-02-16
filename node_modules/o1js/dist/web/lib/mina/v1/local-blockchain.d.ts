import { Types } from '../../../bindings/mina-transaction/v1/types.js';
import { NetworkId } from '../../../mina-signer/src/types.js';
import { PrivateKey, PublicKey } from '../../provable/crypto/signature.js';
import { UInt32, UInt64 } from '../../provable/int.js';
import { Field } from '../../provable/wrapped.js';
import { TupleN } from '../../util/types.js';
import { Account } from './account.js';
import { type ActionStates, type FeePayerSpec } from './mina-instance.js';
import { PendingTransactionPromise, Transaction } from './transaction.js';
export { LocalBlockchain, TestPublicKey };
type TestPublicKey = PublicKey & {
    key: PrivateKey;
};
declare function TestPublicKey(key: PrivateKey): TestPublicKey;
declare namespace TestPublicKey {
    function random<N extends number = 1>(count?: N): N extends 1 ? TestPublicKey : TupleN<TestPublicKey, N>;
    function fromBase58(base58: string): TestPublicKey;
}
export type LocalBlockchain = Awaited<ReturnType<typeof LocalBlockchain>>;
/**
 * A mock Mina blockchain running locally and useful for testing.
 */
declare function LocalBlockchain({ proofsEnabled, enforceTransactionLimits }?: {
    proofsEnabled?: boolean | undefined;
    enforceTransactionLimits?: boolean | undefined;
}): Promise<{
    getNetworkId: () => NetworkId;
    proofsEnabled: boolean;
    getNetworkConstants(): {
        genesisTimestamp: Types.UInt64;
        slotTime: Types.UInt64;
        accountCreationFee: Types.UInt64;
    };
    currentSlot(): Types.UInt32;
    hasAccount(publicKey: PublicKey, tokenId?: Field): boolean;
    getAccount(publicKey: PublicKey, tokenId?: Field): Account;
    getNetworkState(): {
        snarkedLedgerHash: import("../../provable/field.js").Field;
        blockchainLength: Types.UInt32;
        minWindowDensity: Types.UInt32;
        totalCurrency: Types.UInt64;
        globalSlotSinceGenesis: Types.UInt32;
        stakingEpochData: {
            ledger: {
                hash: import("../../provable/field.js").Field;
                totalCurrency: Types.UInt64;
            };
            seed: import("../../provable/field.js").Field;
            startCheckpoint: import("../../provable/field.js").Field;
            lockCheckpoint: import("../../provable/field.js").Field;
            epochLength: Types.UInt32;
        };
        nextEpochData: {
            ledger: {
                hash: import("../../provable/field.js").Field;
                totalCurrency: Types.UInt64;
            };
            seed: import("../../provable/field.js").Field;
            startCheckpoint: import("../../provable/field.js").Field;
            lockCheckpoint: import("../../provable/field.js").Field;
            epochLength: Types.UInt32;
        };
    };
    sendTransaction(txn: Transaction<boolean, boolean>): PendingTransactionPromise;
    transaction(sender: FeePayerSpec, f: () => Promise<void>): import("./transaction.js").TransactionPromise<false, false>;
    applyJsonTransaction(json: string): void;
    fetchEvents(publicKey: PublicKey, tokenId?: Field): Promise<any>;
    fetchActions(publicKey: PublicKey, actionStates?: ActionStates, tokenId?: Field, _from?: number, _to?: number): Promise<{
        hash: string;
        actions: string[][];
    }[]>;
    getActions(publicKey: PublicKey, actionStates?: ActionStates, tokenId?: Field): {
        hash: string;
        actions: string[][];
    }[];
    addAccount: (publicKey: PublicKey, balance: string) => void;
    /**
     * An array of 10 test accounts that have been pre-filled with
     * 30000000000 units of currency.
     */
    testAccounts: [TestPublicKey, TestPublicKey, TestPublicKey, TestPublicKey, TestPublicKey, TestPublicKey, TestPublicKey, TestPublicKey, TestPublicKey, TestPublicKey];
    setGlobalSlot(slot: UInt32 | number): void;
    incrementGlobalSlot(increment: UInt32 | number): void;
    setBlockchainLength(height: UInt32): void;
    setTotalCurrency(currency: UInt64): void;
    setProofsEnabled(newProofsEnabled: boolean): void;
    resetProofsEnabled(): void;
}>;
