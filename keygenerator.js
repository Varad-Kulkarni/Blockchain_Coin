const EC = require('elliptic').ec
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log();
console.log('private key: ' + privateKey);

console.log();
console.log('Public key: ' + publicKey);

// private key: 0d4abe27b5d7a90a78005bd25823d6d051f038849f02d3608a4528adc6cd63a2

// Public key: 045b56d03adadb2ff34d245620517ab690d883dbe8c86f50b5bb77edb8809319f0e0c25356f95b40891937ff734f0f7f1eb9606087161207d6e2cb7bd323410ee2

