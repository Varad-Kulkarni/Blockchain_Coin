const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec
const ec = new EC('secp256k1');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new error('You canot sign transaction for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isvalid(){
        if(this.fromAddress === null) return true;
        if(!this.signature || this.signature.length === 0){
            throw new error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block mined: '+ this.hash);
    }

    hasvalidTransaction(){
        for(const tx of this.transactions){
            if(!tx.isvalid()){
                return false;
            }
        }
        return true;
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransaction = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("01/01/2022", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    //     1st} addBlock(newBlock){
    //     // newBlock.previousHash = this.getLatestBlock().Block;
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.hash = newBlock.calculateHash();
    //     this.chain.push(newBlock);
    // }

    minePendingtransaction(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransaction);
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined');
        this.chain.push(block);
        this.pendingTransaction = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address');
        }

        if(!transaction.isvalid()){
            throw new Error('invalid transaction');
        }

        this.pendingTransaction.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(!currentBlock.hasvalidTransaction()){
                return false;
            }
    
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

const myKey = ec.keyFromPrivate('0d4abe27b5d7a90a78005bd25823d6d051f038849f02d3608a4528adc6cd63a2');
const myWalletAddress = myKey.getPublic('hex');

let savjeeCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
// tx1 = signTransaction(myKey);
tx1.signTransaction(myKey);
savjeeCoin.addTransaction(tx1);

console.log('\n starting the miner.....');
savjeeCoin.minePendingtransaction(myWalletAddress);

console.log('\n Balance of user is', savjeeCoin.getBalanceOfAddress(myWalletAddress));

savjeeCoin.chain[1].transactions[0].amount = 1;
console.log('Is chain valid ', savjeeCoin.isChainValid());

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;