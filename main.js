// import SHA256 from 'crypto-js/sha256';
const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block mined: '+ this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2022", "Genesis block", "0");
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

    addBlock(newBlock){
        // newBlock.previousHash = this.getLatestBlock().Block;
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
    
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


let savjeeCoin = new Blockchain();
savjeeCoin.addBlock(new Block(1, "02/02/2022", {amount: 3}));
savjeeCoin.addBlock(new Block(2, "05/02/2022", {amount: 9}));

// 1)==========================================
console.log(JSON.stringify(savjeeCoin, null, 4));
console.log("is chain valid? "+ savjeeCoin.isChainValid());
console.log("Now we are changing some text in chain.");
savjeeCoin.chain[1].data = {amount: 100};
savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash();
console.log("is chain valid? "+ savjeeCoin.isChainValid());

// 2)============================================
console.log("mining block 1.....");
savjeeCoin.addBlock(new Block(1, "02/02/2022", {amount: 3}));
console.log("mining block 2.....");
savjeeCoin.addBlock(new Block(2, "05/02/2022", {amount: 9}));

