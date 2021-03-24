var ACCOUNTMODEL = (function() {

  var User = {
    address: "",
    privkey : null,
    nonce: 0
  };

  function getUser() {
    return User;
  }

  function loadUserByGeth( gethfilecontents, passphrase, errcb, rescb ) {

    try {
      let gethobj = JSON.parse( gethfilecontents );
      let privk = global.keythereum.recover( passphrase, gethobj );
      privkeyToKeyObject( privk );
    }
    catch (err) {
      errcb( err.toString() );
      return;
    }
    rescb();
  }

  function loadUserByRawKey( keyhexstr, errcb, rescb ) {

    try {
      if (! keyhexstr || keyhexstr.length == 0) throw "Invalid key";

      if (/0x.*$/.test(keyhexstr))
        keyhexstr = keyhexstr.substring( 2 );

      let privKey = Buffer.from( keyhexstr, 'hex' );
      privkeyToKeyObject( privKey );
    }
    catch (err) {
      errcb( err.toString() );
      return;
    }
    rescb();
  }

  function loadUserByPublicKey( pubkeybytes ) {
    let uncompkey = SECP256K1.publicKeyConvert( pubkeybytes, false );

    let pubhex = '0x' + Buffer.from(uncompkey).slice(1).toString('hex');

    User.address = '0x' + ETHERS.keccak256( pubhex ).slice(26);
    User.privkey = null;
    refreshTxCount();
  }

  function privkeyToKeyObject( privkey ) {
    let addr = global.keythereum.privateKeyToAddress(privkey).toLowerCase();
    if (!addr || addr.length == 0) throw "Address fail";
    User.address = addr;
    User.privkey = privkey;
    refreshTxCount();
  }

  function currentUserBalance( rescb ) {
    if (!User.address || User.address.length == 0) return;

    COMMONMODEL.getWeb3().eth.getBalance( User.address )
    .then( bal => {
      rescb( COMMONMODEL.getWeb3().utils.fromWei(bal,'ether') );
    } )
    .catch( err => {
      User.balance = 0;
    } );
  }

  function refreshTxCount() {
    COMMONMODEL.getWeb3().eth.getTransactionCount( User.address )
    .then( cnt => {
      User.nonce = cnt;
    } )
    .catch( err => {
      User.nonce = -1;
    } );
  }

  function sendEth( toacct, amtwei, calldata, gprix, errcb, rescb ) {

    let txobj = { from: User.address,
                  to: toacct,
                  value: amtwei,
                  nonce: User.nonce,
                  gasPrice: gprix,
                  gas: 100000 };

    if (calldata) txobj.data = calldata;

    let yn = COMMONVIEW.userConfirm( JSON.stringify(txobj) );
    if (!yn) return;

    web3.eth.accounts.signTransaction( txobj, User.privkey )
    .then( sigtx => {

      COMMONMODEL.getWeb3().eth.sendSignedTransaction(
        sigtx.rawTransaction,
        (err,res) => {
          if (err)
            errcb( err.toString() );
          else
            rescb( res );
        } );
    } )
    .catch( err => {
      errcb(err.toString());
    } );
  }

  return {
    getUser:getUser,
    currentUserBalance:currentUserBalance,
    loadUserByGeth:loadUserByGeth,
    loadUserByRawKey:loadUserByRawKey,
    loadUserByPublicKey:loadUserByPublicKey,
    refreshTxCount:refreshTxCount,
    sendEth:sendEth
  };

})();

