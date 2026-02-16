import { Mina, NetworkId, PrivateKey, PublicKey, fetchAccount } from 'o1js';
import { Add } from './Add.js';
import { AddZkProgram } from './AddZkProgram.js';

const Network = Mina.Network("https://api.minascan.io/node/devnet/v1/graphql")

Mina.setActiveInstance(Network)

const appKey = PublicKey.fromBase58("B62qiTbC3oB1tczPaAdDAuhx6uQ7nmCxfTLdKw1ELJHUWeaTYQQCftZ")

const zkApp = new Add(appKey)

await fetchAccount({publicKey : appKey})

console.log(zkApp.num.get().toString())

const accountPrivateKey = PrivateKey.fromBase58("EKFJWDs7gcv3qBW9DanGRPyosv4D8YFAQ49dEgq14pgAuzLwPY9j");
const accountPublicKey = accountPrivateKey.toPublicKey();

// ... (Your existing setup code)
console.log("compiling...")
await AddZkProgram.compile(); // 1. Compile the program first
await Add.compile();          // 2. Then compile the contract

// 1. Fetch the current state from the blockchain
await fetchAccount({ publicKey: appKey });
const currentState = zkApp.num.get();

// 2. Generate the proof off-chain using your ZkProgram
console.log('Generating proof...');
// This matches the logic in your AddZkProgram.ts (init -> update -> update)
const initProof = await AddZkProgram.init(currentState);
const update1 = await AddZkProgram.update(currentState, initProof.proof);
const finalProof = await AddZkProgram.update(currentState, update1.proof);

// 3. Now pass that 'finalProof.proof' into the settleState method
const tx = await Mina.transaction({ sender: accountPublicKey, fee: 0.1e9 }, async () => {
  await zkApp.settleState(finalProof.proof); // <--- Pass the proof here
});

console.log("proving...")
await tx.prove();
const sentTx = await tx.sign([accountPrivateKey]).send();
console.log('https://minascan.io/devnet/tx/' + sentTx.hash + '?type=zk-tx');