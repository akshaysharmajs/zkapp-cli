import { Types } from '../../../bindings/mina-transaction/v1/types.js';
import { UInt32 } from '../../provable/int.js';
import { type ZkappCommand } from './account-update.js';
import type { ActionStatesStringified } from './fetch.js';
export { accountQuery, currentSlotQuery, genesisConstantsQuery, getActionsQuery, getEventsQuery, lastBlockQuery, lastBlockQueryFailureCheck, removeJsonQuotes, sendZkappQuery, transactionStatusQuery, type ActionQueryResponse, type ActionsQueryInputs, type CurrentSlotResponse, type DepthOptions, type EpochData, type EventActionFilterOptions, type EventQueryResponse, type EventsQueryInputs, type FailureReasonResponse, type FetchedAccount, type FetchedAccountResponse, type FetchedAction, type FetchedBlock, type GenesisConstantsResponse, type LastBlockQueryFailureCheckResponse, type LastBlockQueryResponse, type SendZkAppResponse, type TransactionDepthInfo, type TransactionStatus, type TransactionStatusQueryResponse, };
declare function removeJsonQuotes(json: string): string;
type ActionsQueryInputs = {
    /** Public key of the ZkApp to which actions have been emitted */
    publicKey: string;
    actionStates?: ActionStatesStringified;
    tokenId?: string;
    /** Block number to query from */
    from?: number;
    /** Block number to query to */
    to?: number;
};
type EventsQueryInputs = {
    /** Public key of the ZkApp to which events have been emitted */
    publicKey: string;
    tokenId?: string;
    /** Block number to query from */
    from?: number;
    /** Block number to query to */
    to?: number;
};
type AuthRequired = Types.Json.AuthRequired;
type FetchedAccount = {
    publicKey: string;
    token: string;
    nonce: string;
    balance: {
        total: string;
    };
    tokenSymbol: string | null;
    receiptChainHash: string | null;
    timing: {
        initialMinimumBalance: string | null;
        cliffTime: string | null;
        cliffAmount: string | null;
        vestingPeriod: string | null;
        vestingIncrement: string | null;
    };
    permissions: {
        editState: AuthRequired;
        access: AuthRequired;
        send: AuthRequired;
        receive: AuthRequired;
        setDelegate: AuthRequired;
        setPermissions: AuthRequired;
        setVerificationKey: {
            auth: AuthRequired;
            txnVersion: string;
        };
        setZkappUri: AuthRequired;
        editActionState: AuthRequired;
        setTokenSymbol: AuthRequired;
        incrementNonce: AuthRequired;
        setVotingFor: AuthRequired;
        setTiming: AuthRequired;
    } | null;
    delegateAccount: {
        publicKey: string;
    } | null;
    votingFor: string | null;
    zkappState: string[] | null;
    verificationKey: {
        verificationKey: string;
        hash: string;
    } | null;
    actionState: string[] | null;
    provedState: boolean | null;
    zkappUri: string | null;
};
type FetchedAccountResponse = {
    account: FetchedAccount;
};
type EpochData = {
    ledger: {
        hash: string;
        totalCurrency: string;
    };
    seed: string;
    startCheckpoint: string;
    lockCheckpoint: string;
    epochLength: string;
};
type LastBlockQueryResponse = {
    bestChain: {
        protocolState: {
            blockchainState: {
                snarkedLedgerHash: string;
                stagedLedgerHash: string;
                date: string;
                utcDate: string;
                stagedLedgerProofEmitted: boolean;
            };
            previousStateHash: string;
            consensusState: {
                blockHeight: string;
                slotSinceGenesis: string;
                slot: string;
                nextEpochData: EpochData;
                stakingEpochData: EpochData;
                epochCount: string;
                minWindowDensity: string;
                totalCurrency: string;
                epoch: string;
            };
        };
    }[];
};
type FailureReasonResponse = {
    failures: string[];
    index: number;
}[];
type LastBlockQueryFailureCheckResponse = {
    bestChain: {
        transactions: {
            zkappCommands: {
                hash: string;
                failureReason: FailureReasonResponse;
            }[];
        };
        stateHash: string;
        protocolState: {
            consensusState: {
                blockHeight: string;
                epoch: string;
                slotSinceGenesis: string;
            };
            previousStateHash: string;
        };
    }[];
};
type FetchedBlock = {
    protocolState: {
        blockchainState: {
            snarkedLedgerHash: string;
            stagedLedgerHash: string;
            date: string;
            utcDate: string;
            stagedLedgerProofEmitted: boolean;
        };
        previousStateHash: string;
        consensusState: {
            blockHeight: string;
            slotSinceGenesis: string;
            slot: string;
            nextEpochData: {
                ledger: {
                    hash: string;
                    totalCurrency: string;
                };
                seed: string;
                startCheckpoint: string;
                lockCheckpoint: string;
                epochLength: string;
            };
            stakingEpochData: {
                ledger: {
                    hash: string;
                    totalCurrency: string;
                };
                seed: string;
                startCheckpoint: string;
                lockCheckpoint: string;
                epochLength: string;
            };
            epochCount: string;
            minWindowDensity: string;
            totalCurrency: string;
            epoch: string;
        };
    };
};
type GenesisConstantsResponse = {
    genesisConstants: {
        genesisTimestamp: string;
        coinbase: string;
        accountCreationFee: string;
    };
    daemonStatus: {
        consensusConfiguration: {
            epochDuration: string;
            k: string;
            slotDuration: string;
            slotsPerEpoch: string;
        };
    };
};
type CurrentSlotResponse = {
    bestChain: Array<{
        protocolState: {
            consensusState: {
                slot: number;
                slotSinceGenesis: number;
            };
        };
    }>;
};
/**
 * INCLUDED: A transaction that is on the longest chain
 *
 * PENDING: A transaction either in the transition frontier or in transaction pool but is not on the longest chain
 *
 * UNKNOWN: The transaction has either been snarked, reached finality through consensus or has been dropped
 *
 */
type TransactionStatus = 'INCLUDED' | 'PENDING' | 'UNKNOWN';
type TransactionStatusQueryResponse = {
    transactionStatus: TransactionStatus;
};
/**
 * Information about a transaction's depth (confirmation count) in the blockchain.
 * Depth represents how many blocks have been built on top of the block containing the transaction.
 *
 * @see https://docs.minaprotocol.com/mina-protocol/lifecycle-of-a-payment
 */
type TransactionDepthInfo = {
    /** Number of blocks built on top of the block containing the transaction (0 = just included) */
    depth: number;
    /** Block height at which the transaction was included */
    inclusionBlockHeight: number;
    /** Current block height of the chain */
    currentBlockHeight: number;
    /** Whether the transaction has reached finality (depth >= finalityThreshold) */
    isFinalized: boolean;
    /** The finality threshold used for this calculation */
    finalityThreshold: number;
};
/**
 * Options for querying transaction depth.
 */
type DepthOptions = {
    /** Number of blocks to search for the transaction (default: 20) */
    blockLength?: number;
    /**
     * Number of blocks required for finality (default: 15).
     * Default of 15 blocks provides 99.9% confidence per Mina documentation.
     * @see https://docs.minaprotocol.com/mina-protocol/lifecycle-of-a-payment
     */
    finalityThreshold?: number;
};
type SendZkAppResponse = {
    sendZkapp: {
        zkapp: {
            hash: string;
            id: string;
            zkappCommand: ZkappCommand;
            failureReasons: FailureReasonResponse;
        };
    };
};
type EventQueryResponse = {
    events: {
        blockInfo: {
            distanceFromMaxBlockHeight: number;
            globalSlotSinceGenesis: number;
            height: number;
            stateHash: string;
            parentHash: string;
            chainStatus: string;
        };
        eventData: {
            transactionInfo: {
                hash: string;
                memo: string;
                status: string;
            };
            data: string[];
        }[];
    }[];
};
type FetchedAction = {
    blockInfo: {
        distanceFromMaxBlockHeight: number;
    };
    actionState: {
        actionStateOne: string;
        actionStateTwo: string;
    };
    actionData: {
        accountUpdateId: string;
        data: string[];
        transactionInfo?: {
            sequenceNumber: number;
            zkappAccountUpdateIds: number[];
        };
    }[];
};
type ActionQueryResponse = {
    actions: FetchedAction[];
};
type EventActionFilterOptions = {
    to?: UInt32;
    from?: UInt32;
};
declare const transactionStatusQuery: (txId: string) => string;
declare const getEventsQuery: (inputs: EventsQueryInputs) => string;
declare const getActionsQuery: (inputs: ActionsQueryInputs) => string;
declare const genesisConstantsQuery = "{\n    genesisConstants {\n      genesisTimestamp\n      coinbase\n      accountCreationFee\n    }\n    daemonStatus {\n      consensusConfiguration {\n        epochDuration\n        k\n        slotDuration\n        slotsPerEpoch\n      }\n    }\n  }";
declare const lastBlockQuery = "{\n  bestChain(maxLength: 1) {\n    protocolState {\n      blockchainState {\n        snarkedLedgerHash\n        stagedLedgerHash\n        date\n        utcDate\n        stagedLedgerProofEmitted\n      }\n      previousStateHash\n      consensusState {\n        blockHeight\n        slotSinceGenesis\n        slot\n        nextEpochData {\n          ledger {hash totalCurrency}\n          seed\n          startCheckpoint\n          lockCheckpoint\n          epochLength\n        }\n        stakingEpochData {\n          ledger {hash totalCurrency}\n          seed\n          startCheckpoint\n          lockCheckpoint\n          epochLength\n        }\n        epochCount\n        minWindowDensity\n        totalCurrency\n        epoch\n      }\n    }\n  }\n}";
declare const lastBlockQueryFailureCheck: (length: number) => string;
declare function sendZkappQuery(json: string): string;
declare const accountQuery: (publicKey: string, tokenId: string) => string;
declare const currentSlotQuery = "{\n    bestChain(maxLength: 1) {\n      protocolState {\n        consensusState {\n          slot\n          slotSinceGenesis\n        }\n      }\n    }\n}";
