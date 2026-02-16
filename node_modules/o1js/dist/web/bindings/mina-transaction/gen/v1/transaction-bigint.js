// @generated this file is auto-generated - don't edit it directly
import { SignableFromLayout } from '../../../lib/from-layout.js';
import { ActionState, Actions, AuthRequired, BalanceChange, Bool, Events, Field, MayUseToken, PublicKey, ReceiptChainHash, Sign, StateHash, TokenId, TokenSymbol, TransactionVersion, UInt32, UInt64, VerificationKeyHash, ZkappUri, } from '../../v1/transaction-leaves-bigint.js';
import { jsLayout } from './js-layout.js';
import * as Json from './transaction-json.js';
export * from '../../v1/transaction-leaves-bigint.js';
export { Account, AccountUpdate, Json, TypeMap, ZkappCommand, customTypes, empty, signableFromLayout, toJSONEssential, };
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
let { signableFromLayout, toJSONEssential, empty } = SignableFromLayout(TypeMap, customTypes);
let ZkappCommand = signableFromLayout(jsLayout.ZkappCommand);
let AccountUpdate = signableFromLayout(jsLayout.AccountUpdate);
let Account = signableFromLayout(jsLayout.Account);
//# sourceMappingURL=transaction-bigint.js.map