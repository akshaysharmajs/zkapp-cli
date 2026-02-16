// @generated this file is auto-generated - don't edit it directly
import { ProvableFromLayout } from '../../../lib/from-layout.js';
import { ActionState, Actions, AuthRequired, BalanceChange, Bool, Events, Field, MayUseToken, PublicKey, ReceiptChainHash, Sign, StateHash, TokenId, TokenSymbol, TransactionVersion, UInt32, UInt64, VerificationKeyHash, ZkappUri, } from '../../v1/transaction-leaves.js';
import { jsLayout } from './js-layout.js';
import * as Json from './transaction-json.js';
export * from '../../v1/transaction-leaves.js';
export { Account, AccountUpdate, Json, TypeMap, ZkappCommand, customTypes, empty, provableFromLayout, toJSONEssential, };
const TypeMap = {
    PublicKey,
    UInt64,
    UInt32,
    TokenId,
    Field,
    AuthRequired,
    BalanceChange,
    Sign,
    Bool,
};
let customTypes = {
    TransactionVersion,
    ZkappUri,
    TokenSymbol,
    StateHash,
    BalanceChange,
    Events,
    Actions,
    ActionState,
    MayUseToken,
    VerificationKeyHash,
    ReceiptChainHash,
};
let { provableFromLayout, toJSONEssential, empty } = ProvableFromLayout(TypeMap, customTypes);
let ZkappCommand = provableFromLayout(jsLayout.ZkappCommand);
let AccountUpdate = provableFromLayout(jsLayout.AccountUpdate);
let Account = provableFromLayout(jsLayout.Account);
//# sourceMappingURL=transaction.js.map