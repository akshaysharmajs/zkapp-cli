import { Types } from '../../../bindings/mina-transaction/v1/types.js';
import { NetworkId } from '../../../mina-signer/src/types.js';
import { PublicKey } from '../../provable/crypto/signature.js';
import { LocalBlockchain, TestPublicKey } from './local-blockchain.js';
import { Mina, activeInstance, currentSlot, fetchActions, fetchEvents, getAccount, getActions, getBalance, getNetworkConstants, getNetworkId, getNetworkState, getProofsEnabled, hasAccount, setActiveInstance, type ActionStates, type FeePayerSpec, type NetworkConstants } from './mina-instance.js';
import { currentTransaction } from './transaction-context.js';
import { filterGroups } from './transaction-validation.js';
import { Transaction, transaction, type IncludedTransaction, type PendingTransaction, type PendingTransactionPromise, type PendingTransactionStatus, type RejectedTransaction } from './transaction.js';
export { ActionStates, FeePayerSpec, LocalBlockchain, Network, TestPublicKey, Transaction, activeInstance, currentSlot, currentTransaction, faucet, fetchActions, fetchEvents, filterGroups, getAccount, getActions, getBalance, getNetworkConstants, getNetworkId, getNetworkState, getProofsEnabled, hasAccount, sender, setActiveInstance, transaction, waitForFunding, type IncludedTransaction, type NetworkConstants, type PendingTransaction, type PendingTransactionPromise, type PendingTransactionStatus, type RejectedTransaction, };
/**
 * Represents the Mina blockchain running on a real network
 */
declare function Network(graphqlEndpoint: string): Mina;
declare function Network(options: {
    networkId?: NetworkId;
    mina: string | string[];
    archive?: string | string[];
    lightnetAccountManager?: string;
    bypassTransactionLimits?: boolean;
    minaDefaultHeaders?: HeadersInit;
    archiveDefaultHeaders?: HeadersInit;
}): Mina;
/**
 * Returns the public key of the current transaction's sender account.
 *
 * Throws an error if not inside a transaction, or the sender wasn't passed in.
 */
declare function sender(): Types.PublicKey;
declare function waitForFunding(address: string, headers?: HeadersInit): Promise<void>;
/**
 * Requests the [testnet faucet](https://faucet.minaprotocol.com/api/v1/faucet) to fund a public key.
 */
declare function faucet(pub: PublicKey, network?: string, headers?: HeadersInit): Promise<void>;
