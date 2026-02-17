import { AccountUpdate, Mina, PrivateKey, PublicKey } from 'o1js';
import { Add } from './Add.js';
import { AddZkProgram } from './AddZkProgram.js';

// 1. Setup Local Blockchain (Async in 2026)
const Local = await Mina.LocalBlockchain({ proofsEnabled: true });
Mina.setActiveInstance(Local);

// 2. Setup Identities
// In 2026, testAccounts[i] is a PublicKey object that contains the PrivateKey in its '.key' property.
const deployerAccount = Local.testAccounts[0]; // This is the PublicKey
const deployerKey = deployerAccount.key;       // This is the PrivateKey

const senderAccount = Local.testAccounts[1];   // This is the second PublicKey
const senderKey = senderAccount.key;           // This is the second PrivateKey

// Generate a random key for the zkApp
const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

// 3. Compile the circuits 
// IMPORTANT: Always compile the ZkProgram BEFORE the SmartContract
console.log("Compiling AddZkProgram...");
await AddZkProgram.compile();
console.log("Compiling Add Contract...");
await Add.compile();

// Initialize the contract instance
const zkApp = new Add(zkAppAddress);

// 4. Deploy the Contract
console.log("Deploying zkApp...");
const deployTxn = await Mina.transaction(deployerAccount, async () => {
    // This pays the 1 MINA account creation fee
    AccountUpdate.fundNewAccount(deployerAccount);
    await zkApp.deploy();
});

await deployTxn.prove();
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

console.log("Initial state:", zkApp.num.get().toString());

// 5. Update the state using Recursion
console.log("Generating recursive proof...");

const currentState = zkApp.num.get(); // Let's say this is 0

// Step A: Create the "Base" proof (Result: 0)
const initProof = await AddZkProgram.init(currentState);

// Step B: Create the "Update" proof (Result: 0 + 1 = 1)
// We pass the starting state AND the proof we just made
const finalProof = await AddZkProgram.update(currentState, initProof.proof);

console.log("Settling final proof on-chain...");
const updateTxn = await Mina.transaction(senderAccount, async () => {
    await zkApp.settleState(finalProof.proof);
});

await updateTxn.prove();
await updateTxn.sign([senderKey]).send();

console.log("Final state:", zkApp.num.get().toString()); // Should now be 1!