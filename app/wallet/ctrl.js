var WALLETCTRL = (function() {

  var abi;
  var txobj;

  function updateUser() {
    try {
      ACCOUNTMODEL.refreshTxCount();
    }
    catch( e ) { }

    if (ACCOUNTMODEL.getUser()) {
      setTimeout( function() { 
          WALLETVIEW.nonce(ACCOUNTMODEL.getUser().nonce);
          calcTx();
        }, 250 );
    }
  }

  function initWalletTab() {
    updateUser()

    COMMONMODEL.gasPrice( err => {
      console.log( err.toString() );
    }, res => {
      WALLETVIEW.gasPrice( COMMONVIEW.shiftValueLeftDecimals(res,9) );
    } );

    selectedSendEth()
  }

  function selectedSendEth() {
    WALLETVIEW.opSelected( 0 );
    WALLETVIEW.gasLimit( COMMONMODEL.ethTransferGasUnits() )
  }

  function selectedTransfer() {
    WALLETVIEW.opSelected( 1 );
    WALLETVIEW.gasLimit( COMMONMODEL.tokTransferGasUnits() )
  }

  function selectedCallContract() {
    WALLETVIEW.opSelected( 2 );
    WALLETVIEW.gasLimit( "" )
  }

  function setTxFields() {

    let user = ACCOUNTMODEL.getUser();

    if (COMMONMODEL.getWeb3() && user != null && user.privkey != null) {
      COMMONMODEL.getWeb3().eth.accounts.signTransaction(
        txobj, ACCOUNTMODEL.getUser().privkey.toString('hex') )
      .then( sigtx => {

        WALLETVIEW.signedTransaction( sigtx.rawTransaction );

        if (txobj.data)
          txobj.data = txobj.data.substring(0,10) + "...";

      } ).catch( err => { console.log( err ); } );
    }

    WALLETVIEW.setTransaction( JSON.stringify(txobj,null,2) );
  }

  function calcTx() {
    WALLETVIEW.setTransaction( "" );
    //WALLETVIEW.signedTransaction( "" );

    let op = WALLETVIEW.opSelected();
    if (op == 0) {
      let toaddr = WALLETVIEW.getToAddress();
      let amt = WALLETVIEW.getAmount();
      let cdat = WALLETVIEW.getCalldata();
      let gasu = parseInt( WALLETVIEW.gasLimit() );
      if (cdat) gasu += cdat.length * 100; // should be 68, but safety margin

      txobj = {
        from: ACCOUNTMODEL.getUser().address,
        to: toaddr,
        value: COMMONVIEW.shiftValueRightDecimals(amt, 18),
        gas: gasu,
        gasPrice: (WALLETVIEW.gasPrice() * 1e09),
        nonce: WALLETVIEW.nonce()
      };
      if (cdat) txobj.data = COMMONMODEL.toUtf8Hex(cdat);

      setTxFields();
    }
    else if (op == 1) {
      calcTokenTx();
    }
    else if (op == 2) {
      calcContractTx();
    }
  }

  function tokenSelected( sca ) {
    sca = sca.toLowerCase();

    ERC20.fetch( sca,
      err => { console.log(err) },
      tok => {
        if (null == tok || /^0[xX]0+$/.test(sca) ) {
          WALLETVIEW.setTokenBalance( 0 );
          return;
        }

        if (ACCOUNTMODEL.getUser()) {
        tok.balanceOf(
          ACCOUNTMODEL.getUser().address,
          err => { console.log( err.toString() ) },
          res => {
            if (res == 0)
              res = "0" + "0".repeat(tok.decimals);

            let val = COMMONVIEW.shiftValueLeftDecimals( res, tok.decimals() );
            WALLETVIEW.setTokenBalance( val );
          } );
        }
        else {
          WALLETVIEW.setTokenBalance( 0 );
        }

        calcTokenTx();
      }
    );
  }

  function calcTokenTx() {

    let tok = ERC20.fetch( WALLETVIEW.getTokenSCA().toLowerCase(),
      err => { console.log(err) },
      res => {}
    );

    if (null == tok) return;

    let to = WALLETVIEW.getTokenToAddress();
    let quant = WALLETVIEW.getTokenAmount();
    if (quant == null || quant.length == 0 || to == null || to.length == 0)
      return;
    quant = COMMONVIEW.shiftValueRightDecimals( quant, tok.decimals() );

    let web3 = COMMONMODEL.getWeb3();
    let con = new web3.eth.Contract( ERC20.ABI, tok.sca() );
    let calldata = con.methods.transfer( to, quant ).encodeABI();

    txobj = {
      to: tok.sca(),
      data: calldata,
      gas: WALLETVIEW.gasLimit(),
      gasPrice: (WALLETVIEW.gasPrice() * 1e09),
      nonce: WALLETVIEW.nonce()
    };
    if (ACCOUNTMODEL.getUser().address) {
      txobj.from = '' + ACCOUNTMODEL.getUser().address;
    }
    setTxFields();
  }

  function contractSelected( sca ) {
    COMMONMODEL.getWeb3().eth.getCode( sca )
    .then( code => {
      WALLETVIEW.showContractValid( /^0[xX]6.*$/.test(code) );
    } )
    .catch( err => {
      WALLETVIEW.showContractValid( false );
    } );
  }

  function abiChanged( abijson ) {
    try {
      abi = JSON.parse( abijson );
    }
    catch(err) {
      abi = null;
      WALLETVIEW.abi( " " );
      return;
    }

    let funcs = [], ix = 0;
    funcs.push( { val:ix++, text:'fallback()' } );
    funcs.push( { val:ix++, text:'receive()' } );

    abi.forEach( func => {
      if ( func.type == "function" && func.stateMutability != "view" )
        funcs.push( {val: ix++, text: func.name} );
    } );

    WALLETVIEW.setFunctions( funcs );
  }

  function functionSelected() {
    let it = WALLETVIEW.getSelectedFunction();
    let parms = [], ii = 0;

    if (it.val == 0) { // fallback: calldata doesnt match any function
      parms.push( { ix:ii++, name: 'calldata', type:'hex' } );
    }
    else if (it.val == 1) { // leave parms as is - no parameters
    }
    else {
      let entry = getABIEntry( it.text );
      entry.inputs.forEach( inp => {
        parms.push( { ix:ii++, name: inp.name, type: inp.internalType } );
      } );
    }

    WALLETVIEW.setParameters( parms );
  }

  function getABIEntry( fname ) {
    for( let ii = 0; ii < abi.length; ii++ )
      if (abi[ii].name == fname)
        return( abi[ii] );

    return null;
  }

  function calcContractTx() {

    let sca = WALLETVIEW.getContractSCA();
    let entry = WALLETVIEW.getSelectedFunction();
    let abientry = getABIEntry( entry.text );
    let parms = WALLETVIEW.getParameterValues();

    let val =
      COMMONVIEW.shiftValueRightDecimals( WALLETVIEW.getContractValue(), 18 );
    let gasl = WALLETVIEW.gasLimit();

    txobj = {
      to: sca,
      gasPrice: (WALLETVIEW.gasPrice() * 1e09),
      nonce: WALLETVIEW.nonce()
    };

    if (ACCOUNTMODEL.getUser().address) {
      txobj.from = '' + ACCOUNTMODEL.getUser().address;
    }

    if (val && parseInt(val) != 0)
      txobj.value = val;

    let web3 = COMMONMODEL.getWeb3();
    if (entry.val == 0) { // fallback
      txobj.data = parms[0];
    }
    else if (entry.val == 1) { // receive value, no calldata
    }
    else { // function call
      txobj.data = web3.eth.abi.encodeFunctionCall( abientry, parms );
    }

    if (!gasl || parseInt(gasl) == 0) {
      web3.eth.estimateGas( txobj ).then( est => {
        let estint = parseInt( est * 1.5 )
        WALLETVIEW.gasLimit( estint )
        gasl = estint;
        txobj.gas = gasl;
        setTxFields();
      } )
      .catch( e => { console.log(e) } );
    }

    txobj.gas = gasl;
    setTxFields();
  }

  function obtainSignature() {
    WALLETVIEW.signedTransaction("");

    // same as txobj but all the values are hex
    let hexobj = {
      nonce: COMMONMODEL.toHex(txobj.nonce),
      gasPrice: COMMONMODEL.toHex(txobj.gasPrice),
      gasLimit: COMMONMODEL.toHex(txobj.gas),
      to: txobj.to,
      value: COMMONMODEL.toHex(txobj.value),
      data: txobj.data
    };

    let tx = ETHJS.Transaction.fromTxData( hexobj );
    let hash = COMMONMODEL.bytesToHex( tx.getMessageToSign() );

    COMMONCTRL.setCallback( sigScanned );
    COMMONCTRL.setMainScreen( false );
    QRDIALOG.showQR( false, hash );
  }

  function sigScanned( rspHexStr ) {
    global.pauseQRScanner();

    let lc = rspHexStr.toLowerCase();
    if (!lc.startsWith('0x'))
      lc = '0x' + lc;

    let msgarray = COMMONMODEL.hexToBytes( lc );
    let recovid = msgarray.pop();

    let dersig = Uint8Array.from( msgarray );
    let sigobj = SECP256K1.signatureImport( dersig );

    let sigR = sigobj.subarray( 0, 32 );
    let sigS = sigobj.subarray( 32, 64 );

    // start here ...
    // https://ethereum.stackexchange.com/questions/42455/
    //   during-ecdsa-signing-how-do-i-generate-the-recovery-id

    let sigV = 1 * 2 + 35 + recovid;

    let hextx = {
      nonce: COMMONMODEL.toHex(txobj.nonce),
      gasPrice: COMMONMODEL.toHex(txobj.gasPrice),
      gasLimit: COMMONMODEL.toHex(txobj.gas),
      to: txobj.to,
      value: COMMONMODEL.toHex(txobj.value),
      data: (txobj.data && txobj.data.length > 1) ? txobj.data : [],
      v: sigV,
      r: sigR,
      s: sigS
    }

    let signedtx = ETHJS.Transaction.fromTxData( hextx );
    let serializedtx = signedtx.serialize();

    updateUser();
    setTxFields();
    WALLETVIEW.signedTransaction( COMMONMODEL.toHex(serializedtx) );
  }

  function sendTransaction() {
    let rawTxHex = WALLETVIEW.signedTransaction();

    if (!rawTxHex || rawTxHex.length == 0) {
      console.log( 'nothing to do' );
      return;
    }

    COMMONMODEL.sendRawTx( rawTxHex );
  }

  return {
    initWalletTab:initWalletTab,
    selectedSendEth:selectedSendEth,
    selectedTransfer:selectedTransfer,
    selectedCallContract:selectedCallContract,
    calcTx:calcTx,
    tokenSelected:tokenSelected,
    contractSelected:contractSelected,
    abiChanged:abiChanged,
    functionSelected:functionSelected,
    calcContractTx:calcContractTx,
    obtainSignature:obtainSignature,
    sigScanned:sigScanned,
    sendTransaction:sendTransaction
  };

})();

