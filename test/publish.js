//
// $ node me.js signedtx
//

if (process.argv.length != 3) {
  console.log( "Usage:\n\t$ node me.js <signedtx>\n" );
  process.exit( 0 );
}

const MYGASPRICE = '' + 2 * 1e9;
const Web3 = require('web3');

let web3 =
  new Web3( new Web3.providers.WebsocketProvider("ws://localhost:8545") );

var raw = process.argv[2]; // raw hex

web3.eth.sendSignedTransaction( raw )
.on( 'receipt', () => {console.log("DONE");process.exit(0);} )
.catch( e => { console.log(e.toString()) } );

