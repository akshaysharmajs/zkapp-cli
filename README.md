# 🪶 Mina Recursive Add: Zero-Knowledge Rollup

This repository contains a **Mina Protocol zkApp** that demonstrates the power of **recursive zero-knowledge proofs**. Built using **o1js**, this project simulates a basic "Rollup" where multiple off-chain additions are compressed into a single, constant-sized proof for on-chain settlement.

---

## 🏗️ Project Architecture

The project is split into three core logic components:

### 1. The Recursive Circuit (`AddZkProgram.ts`)
This is where the "heavy lifting" happens off-chain. It uses **Infinite Recursion** to:
- **Base Case**: Initialize a proof with a starting value.
- **Recursive Step**: Take an existing proof, verify it, and add a new value to it, creating a "wrapped" proof.

### 2. The Smart Contract (`Add.ts`)
The on-chain verifier. It stores a single state variable `num`.
- It does **not** perform addition.
- It only verifies the final proof from the `AddZkProgram`.
- If the proof is valid, it updates the on-chain `num` to the proof's final result.

### 3. The Interaction Layer (`interact.ts`)
A script that orchestrates the entire flow:
- Connects to the **Mina Devnet**.
- Compiles the circuits (generating prover/verification keys).
- Fetches the live state.
- Generates the recursive proofs and broadcasts the transaction.

---

## 🛠️ Tech Stack & Prerequisites

- **Language**: TypeScript
- **ZK Framework**: [o1js](https://www.npmjs.com/package/o1js) (v2026 stable)
- **Network**: Mina Devnet / Mesa
- **CLI**: `zkapp-cli`

### 🔧 Setup
1. **Install dependencies**:
   ```bash
   npm install
    ```

2. **Build the project**:
    ```bash
    cd learning
    npm run build

    ```



---

## 🚀 Running the Project

To run the full end-to-end flow (Compile -> Prove -> Settle):

```bash
# Ensure the project is built
npm run build

# Run using the devnet alias
node build/src/interact.js devnet

```

### 📋 Expected Console Output

```text
0
compiling...
Generating proof...
Step 1: Initializing proof...
Step 2: Adding first recursive layer...
Step 3: Adding second recursive layer...
proving transaction...
Transaction sent!

Success! Update transaction sent.
View your transaction here:
[https://minascan.io/devnet/tx/](https://minascan.io/devnet/tx/)<TRANSACTION_HASH>?type=zk-tx

```

