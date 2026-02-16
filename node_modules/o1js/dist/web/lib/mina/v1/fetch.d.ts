import { Types } from '../../../bindings/mina-transaction/v1/types.js';
import { PrivateKey, PublicKey } from '../../provable/crypto/signature.js';
import { UInt32, UInt64 } from '../../provable/int.js';
import { Field } from '../../provable/wrapped.js';
import { Account, PartialAccount, parseFetchedAccount } from './account.js';
import { type ActionsQueryInputs, type DepthOptions, type EventsQueryInputs, type FetchedAction, type SendZkAppResponse, type TransactionDepthInfo, type TransactionStatus } from './graphql.js';
import { ActionStates } from './mina.js';
export { Lightnet, addCachedAccount, checkZkappTransaction, fetchAccount, fetchActions, fetchCurrentSlot, fetchEvents, fetchGenesisConstants, fetchLastBlock, fetchMissingData, fetchTimedAccountInfo, fetchTransactionDepth, fetchTransactionStatus, getCachedAccount, getCachedActions, getCachedGenesisConstants, getCachedNetwork, makeGraphqlRequest, markAccountToBeFetched, markActionsToBeFetched, markNetworkToBeFetched, networkConfig, parseFetchedAccount, sendZkapp, setArchiveDefaultHeaders, setArchiveGraphqlEndpoint, setArchiveGraphqlFallbackEndpoints, setGraphqlEndpoint, setGraphqlEndpoints, setLightnetAccountManagerEndpoint, setMinaDefaultHeaders, setMinaGraphqlFallbackEndpoints, type ActionStatesStringified, type GenesisConstants, };
declare let networkConfig: {
    minaEndpoint: string;
    minaFallbackEndpoints: string[];
    archiveEndpoint: string;
    archiveFallbackEndpoints: string[];
    lightnetAccountManagerEndpoint: string;
    minaDefaultHeaders: {};
    archiveDefaultHeaders: {};
};
/**
 * Sets up the default headers to be used for all Mina node GraphQL requests, example usage:
 * ```typescript
 * setMinaDefaultHeaders({ Authorization: 'Bearer example-token' });
 * ```
 *
 * It can be overridden by passing headers to the individual fetch functions, example usage:
 * ```typescript
 * setMinaDefaultHeaders({ Authorization: 'Bearer default-token' });
 * await fetchAccount({publicKey}, minaEndpoint, { headers: { Authorization: 'Bearer override-token' } });
 * ```
 * @param headers Arbitrary sized headers to be used for all Mina node GraphQL requests.
 */
declare function setMinaDefaultHeaders(headers: HeadersInit): void;
/**
 * Sets up the default headers to be used for all Archive node GraphQL requests, example usage:
 * ```typescript
 * setArchiveDefaultHeaders({ Authorization: 'Bearer example-token' });
 * ```
 *
 * It can be overridden by passing headers to the individual fetch functions, example usage:
 * ```typescript
 * setArchiveDefaultHeaders({ Authorization: 'Bearer default-token' });
 * await fetchEvents({publicKey}, archiveEndpoint, { headers: { Authorization: 'Bearer override-token' } });
 * ```
 * @param headers Arbitrary sized headers to be used for all Mina Archive node GraphQL requests.
 */
declare function setArchiveDefaultHeaders(headers: HeadersInit): void;
declare function setGraphqlEndpoints([graphqlEndpoint, ...fallbackEndpoints]: string[]): void;
declare function setGraphqlEndpoint(graphqlEndpoint: string, minaDefaultHeaders?: HeadersInit): void;
declare function setMinaGraphqlFallbackEndpoints(graphqlEndpoints: string[]): void;
/**
 * Sets up a GraphQL endpoint to be used for fetching information from an Archive Node.
 *
 */
declare function setArchiveGraphqlEndpoint(graphqlEndpoint: string, archiveDefaultHeaders?: HeadersInit): void;
declare function setArchiveGraphqlFallbackEndpoints(graphqlEndpoints: string[]): void;
/**
 * Sets up the lightnet account manager endpoint to be used for accounts acquisition and releasing.
 *
 * @param endpoint Account manager endpoint.
 */
declare function setLightnetAccountManagerEndpoint(endpoint: string): void;
/**
 * Gets account information on the specified publicKey by performing a GraphQL query
 * to the specified endpoint. This will call the 'GetAccountInfo' query which fetches
 * zkapp related account information.
 *
 * If an error is returned by the specified endpoint, an error is thrown. Otherwise,
 * the data is returned.
 *
 * @param accountInfo The public key and token id of the account to fetch
 * @param accountInfo.publicKey The specified publicKey to get account information on
 * @param accountInfo.tokenId The specified tokenId to get account information on
 * @param graphqlEndpoint The graphql endpoint to fetch from
 * @param config An object that exposes an additional timeout and header options
 * @returns zkapp information on the specified account or an error is thrown
 */
declare function fetchAccount(accountInfo: {
    publicKey: string | PublicKey;
    tokenId?: string | Field;
}, graphqlEndpoint?: string, { timeout, headers }?: FetchConfig): Promise<{
    account: Types.Account;
    error: undefined;
} | {
    account: undefined;
    error: FetchError;
}>;
/**
 * Fetches detailed balance information for a time-locked account.
 *
 * This function retrieves account data and calculates the liquid and locked
 * balances based on the current global slot and the account's vesting schedule.
 *
 * @param accountInfo - The account identifier containing publicKey and optional tokenId
 * @param graphqlEndpoint - The GraphQL endpoint to fetch from (defaults to configured endpoint)
 * @param config - Optional fetch configuration with timeout and headers
 * @returns An object containing balance details and timing information, or an error
 */
declare function fetchTimedAccountInfo(accountInfo: {
    publicKey: string | PublicKey;
    tokenId?: string | Field;
}, graphqlEndpoint?: string, { timeout, headers }?: FetchConfig): Promise<{
    account: Types.Account;
    totalBalance: UInt64;
    lockedBalance: UInt64;
    liquidBalance: UInt64;
    blockHeight: UInt32;
    globalSlot: UInt32;
    error: undefined;
} | {
    error: FetchError;
}>;
type FetchConfig = {
    timeout?: number;
    headers?: HeadersInit;
};
type FetchResponse<TDataResponse = any> = {
    data: TDataResponse;
    errors?: any;
};
type FetchError = {
    statusCode: number;
    statusText: string;
};
type ActionStatesStringified = {
    [K in keyof ActionStates]: string;
};
type GenesisConstants = {
    genesisTimestamp: string;
    coinbase: number;
    accountCreationFee: number;
    epochDuration: number;
    k: number;
    slotDuration: number;
    slotsPerEpoch: number;
};
declare function markAccountToBeFetched(publicKey: PublicKey, tokenId: Field, graphqlEndpoint: string): void;
declare function markNetworkToBeFetched(graphqlEndpoint: string): void;
declare function markActionsToBeFetched(publicKey: PublicKey, tokenId: Field, graphqlEndpoint: string, actionStates?: ActionStates): void;
declare function fetchMissingData(graphqlEndpoint: string, archiveEndpoint?: string): Promise<void>;
declare function getCachedAccount(publicKey: PublicKey, tokenId: Field, graphqlEndpoint?: string): Account | undefined;
declare function getCachedNetwork(graphqlEndpoint?: string): {
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
declare function getCachedActions(publicKey: PublicKey, tokenId: Field, graphqlEndpoint?: string): {
    hash: string;
    actions: string[][];
}[];
declare function getCachedGenesisConstants(graphqlEndpoint?: string): GenesisConstants;
/**
 * Adds an account to the local cache, indexed by a GraphQL endpoint.
 */
declare function addCachedAccount(partialAccount: PartialAccount, graphqlEndpoint?: string): void;
/**
 * Fetches the last block on the Mina network.
 *
 * This returns comprehensive network state information including the global slot
 * since genesis (`globalSlotSinceGenesis`), blockchain length, ledger hashes,
 * currency supply, and epoch data.
 *
 * For a lightweight query that only fetches slot information, use `fetchCurrentSlot()`,
 * which can return either the global slot since genesis or the slot within the current epoch.
 */
declare function fetchLastBlock(graphqlEndpoint?: string, headers?: HeadersInit): Promise<{
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
}>;
/**
 * Fetches the current slot number of the Mina network.
 *
 * By default, returns the global slot since genesis (the cumulative count of all slots
 * since the network launched). This matches `fetchLastBlock().globalSlotSinceGenesis`.
 *
 * Alternatively, you can fetch the slot within the current epoch by passing `slotType: 'epoch'`.
 * The epoch slot resets to 0 at each epoch boundary (approximately every 14 days) and
 * ranges from 0 to ~7,139.
 *
 * @param graphqlEndpoint GraphQL endpoint to fetch from
 * @param slotType Type of slot to fetch: 'global' (default) for slot since genesis, or 'epoch' for slot within current epoch
 * @param headers Optional headers to pass to the fetch request
 * @returns The slot number (either global or epoch-relative based on slotType)
 *
 * @example
 * ```ts
 * // Fetch global slot (default)
 * const globalSlot = await fetchCurrentSlot('https://api.minascan.io/node/devnet/v1/graphql');
 *
 * // Fetch epoch-relative slot
 * const epochSlot = await fetchCurrentSlot(
 *   'https://api.minascan.io/node/devnet/v1/graphql',
 *   'epoch'
 * );
 * ```
 */
declare function fetchCurrentSlot(graphqlEndpoint?: string, slotType?: 'global' | 'epoch', headers?: HeadersInit): Promise<number>;
declare function checkZkappTransaction(transactionHash: string, blockLength?: number): Promise<{
    success: boolean;
    failureReason: string[][][];
    blockHeight: number;
} | {
    success: boolean;
    failureReason: null;
    blockHeight: number;
} | {
    success: boolean;
    failureReason: null;
    blockHeight: undefined;
}>;
/**
 * Fetches the depth (confirmation count) of a transaction in the blockchain.
 * Depth represents how many blocks have been built on top of the block containing the transaction.
 *
 * @param transactionHash - The hash of the transaction to check
 * @param options - Optional configuration for the depth query
 * @param options.blockLength - Number of blocks to search for the transaction (default: 20)
 * @param options.finalityThreshold - Number of blocks required for finality (default: 15, which provides 99.9% confidence)
 * @returns TransactionDepthInfo if the transaction is found and successful, null otherwise
 *
 * @example
 * ```ts
 * // Check depth of a transaction
 * const depthInfo = await fetchTransactionDepth('5JuKp...');
 * if (depthInfo) {
 *   console.log(`Depth: ${depthInfo.depth}, Finalized: ${depthInfo.isFinalized}`);
 * }
 *
 * // Use custom finality threshold
 * const depthInfo = await fetchTransactionDepth('5JuKp...', { finalityThreshold: 10 });
 * ```
 *
 * @see https://docs.minaprotocol.com/mina-protocol/lifecycle-of-a-payment
 */
declare function fetchTransactionDepth(transactionHash: string, options?: DepthOptions): Promise<TransactionDepthInfo | null>;
/**
 * Fetches the status of a transaction.
 */
declare function fetchTransactionStatus(txId: string, graphqlEndpoint?: string, headers?: HeadersInit): Promise<TransactionStatus>;
/**
 * Sends a zkApp command (transaction) to the specified GraphQL endpoint.
 */
declare function sendZkapp(json: string, graphqlEndpoint?: string, { timeout, headers }?: FetchConfig): Promise<[undefined, FetchError] | [FetchResponse<SendZkAppResponse>, undefined]>;
/**
 * Asynchronously fetches event data for an account from the Mina Archive Node GraphQL API.
 * @param accountInfo - The account information object.
 * @param accountInfo.publicKey - The account public key.
 * @param [accountInfo.tokenId] - The optional token ID for the account.
 * @param [graphqlEndpoint=networkConfig.archiveEndpoint] - The GraphQL endpoint to query. Defaults to the Archive Node GraphQL API.
 * @param [filterOptions={}] - The optional filter options object.
 * @param headers - Optional headers to pass to the fetch request
 * @returns A promise that resolves to an array of objects containing event data, block information and transaction information for the account.
 * @throws If the GraphQL request fails or the response is invalid.
 * @example
 * ```ts
 * const accountInfo = { publicKey: 'B62qiwmXrWn7Cok5VhhB3KvCwyZ7NHHstFGbiU5n7m8s2RqqNW1p1wF' };
 * const events = await fetchEvents(accountInfo);
 * console.log(events);
 * ```
 */
declare function fetchEvents(queryInputs: EventsQueryInputs, graphqlEndpoint?: string, headers?: HeadersInit): Promise<{
    events: {
        data: string[];
        transactionInfo: {
            hash: string;
            memo: string;
            status: string;
        };
    }[];
    blockHeight: Types.UInt32;
    blockHash: string;
    parentBlockHash: string;
    globalSlot: Types.UInt32;
    chainStatus: string;
}[]>;
/**
 * Fetches account actions for a specified public key and token ID by performing a GraphQL query.
 *
 * @param accountInfo - An {@link ActionsQueryInputs} containing the public key, and optional query parameters for the actions query
 * @param graphqlEndpoint - The GraphQL endpoint to fetch from. Defaults to the configured Mina endpoint.
 * @param headers - Optional headers to pass to the fetch request
 *
 * @returns A promise that resolves to an object containing the final actions hash for the account, and a list of actions
 * @throws Will throw an error if the GraphQL endpoint is invalid or if the fetch request fails.
 *
 * @example
 * ```ts
 * const accountInfo = { publicKey: 'B62qiwmXrWn7Cok5VhhB3KvCwyZ7NHHstFGbiU5n7m8s2RqqNW1p1wF' };
 * const actionsList = await fetchAccount(accountInfo);
 * console.log(actionsList);
 * ```
 */
declare function fetchActions(queryInputs: ActionsQueryInputs, graphqlEndpoint?: string, headers?: HeadersInit): Promise<{
    actions: string[][];
    hash: string;
}[] | {
    error: FetchError;
}>;
/**
 * Given a graphQL response from #getActionsQuery, process the actions into a canonical actions list
 */
export declare function createActionsList(accountInfo: {
    publicKey: string;
    actionStates: ActionStatesStringified;
}, fetchedActions: FetchedAction[]): {
    actions: string[][];
    hash: string;
}[];
/**
 * Fetches genesis constants.
 */
declare function fetchGenesisConstants(graphqlEndpoint?: string, headers?: HeadersInit): Promise<GenesisConstants>;
declare namespace Lightnet {
    /**
     * Gets random key pair (public and private keys) from account manager
     * that operates with accounts configured in target network Genesis Ledger.
     *
     * If an error is returned by the specified endpoint, an error is thrown. Otherwise,
     * the data is returned.
     *
     * @param options.isRegularAccount Whether to acquire key pair of regular or zkApp account (one with already configured verification key)
     * @param options.lightnetAccountManagerEndpoint Account manager endpoint to fetch from
     * @returns Key pair
     */
    function acquireKeyPair(options?: {
        isRegularAccount?: boolean;
        lightnetAccountManagerEndpoint?: string;
    }): Promise<{
        publicKey: PublicKey;
        privateKey: PrivateKey;
    }>;
    /**
     * Releases previously acquired key pair by public key.
     *
     * @param options.publicKey Public key of previously acquired key pair to release
     * @param options.lightnetAccountManagerEndpoint Account manager endpoint to fetch from
     * @returns Response message from the account manager as string or null if the request failed
     */
    function releaseKeyPair(options: {
        publicKey: string;
        lightnetAccountManagerEndpoint?: string;
    }): Promise<string | null>;
    /**
     * Gets previously acquired key pairs list.
     *
     * @param options.lightnetAccountManagerEndpoint Account manager endpoint to fetch from
     * @returns Key pairs list or null if the request failed
     */
    function listAcquiredKeyPairs(options: {
        lightnetAccountManagerEndpoint?: string;
    }): Promise<Array<{
        publicKey: PublicKey;
        privateKey: PrivateKey;
    }> | null>;
}
declare function makeGraphqlRequest<TDataResponse = any>(query: string, graphqlEndpoint: string | undefined, fallbackEndpoints: string[], { timeout, headers }?: FetchConfig): Promise<[undefined, FetchError] | [FetchResponse<TDataResponse>, undefined]>;
