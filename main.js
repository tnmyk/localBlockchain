const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}
class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.timestamp +
        JSON.stringify(this.transactions) +
        this.previousHash +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== "0".repeat(difficulty)) {
      this.hash = this.calculateHash();
      ++this.nonce;
    }
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesis()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesis() {
    return new Block("05-10-2021", "Genesis Block", "0");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransaction(minerAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block Mined!");
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, minerAddress, this.miningReward),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.toAddress === address) {
          balance += trans.amount;
        } else if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
      }
    }
    console.log(address+"'s balance:",balance)
  }

  verifyChain() {
    for (let i = 1; i < this.chain.length; ++i) {
      if (this.chain[i].hash !== this.chain[i].calculateHash()) return false; // Check if the calculate hash is equal to present.
      if (this.chain[i - 1].hash !== this.chain[i].previousHash) return false;
    }
    return true;
  }

  print() {
    console.log(JSON.stringify(this, null, 4));
  }
}

let tkCoin = new Blockchain();

tkCoin.createTransaction(new Transaction('address1','address2',40));
tkCoin.createTransaction(new Transaction("address2", "address1", 20));
tkCoin.minePendingTransaction("address3");

tkCoin.getBalanceOfAddress("address2");
