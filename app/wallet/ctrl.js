var WALLETCTRL = (function() {

  var abi;

  function initWalletTab() {
    try {
      ACCOUNTMODEL.refreshTxCount();
    }
    catch( e ) { }

    WALLETVIEW.clearFields();

    if (ACCOUNTMODEL.getUser()) {
      setTimeout( WALLETVIEW.nonce(ACCOUNTMODEL.getUser().nonce), 500 );
    }

    selectedSendEth();

    COMMONMODEL.gasPrice( err => {
      console.log( err.toString() );
    }, res => {
      WALLETVIEW.gasPrice( COMMONVIEW.shiftValueLeftDecimals(res,9) );
    } );
  }

  function selectedSendEth() {
    WALLETVIEW.opSelected( 0 );
  }

  function selectedTransfer() {
    WALLETVIEW.opSelected( 1 );
  }

  function selectedCallContract() {
    WALLETVIEW.opSelected( 2 );
  }

  function setTxFields( txobj ) {

    if (COMMONMODEL.getWeb3() && ACCOUNTMODEL.getUser()) {

      COMMONMODEL.getWeb3().eth.accounts.signTransaction(
        txobj, ACCOUNTMODEL.getUser().privkey.toString('hex') )
      .then( sigtx => {

        WALLETVIEW.signedTransaction( sigtx.rawTransaction );

        if (txobj.data)
          txobj.data = txobj.data.substring(0,10) + "...";

        WALLETVIEW.setTransaction( JSON.stringify(txobj,null,2) );
      } ).catch( err => { console.log( err ); } );
    }
  }

  function calcTx() {
    WALLETVIEW.setTransaction( "" );
    WALLETVIEW.signedTransaction( "" );

    let op = WALLETVIEW.opSelected();
    if (op == 0) {
      let toaddr = WALLETVIEW.getToAddress();
      let amt = WALLETVIEW.getAmount();
      let cdat = WALLETVIEW.getCalldata();
      let gasu = COMMONMODEL.ethTransferGasUnits();
      if (cdat) gasu += cdat.length * 100; // should be 68, but safety margin

      let txobj = {
        from: ACCOUNTMODEL.getUser().address,
        to: toaddr,
        value: COMMONVIEW.shiftValueRightDecimals(amt, 18),
        gas: gasu,
        gasPrice: (WALLETVIEW.gasPrice() * 1e09),
        nonce: WALLETVIEW.nonce()
      };
      if (cdat) txobj.data = COMMONMODEL.toUtf8Hex(cdat);

      setTxFields( txobj );
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

        tok.balanceOf(
          ACCOUNTMODEL.getUser().address,
          err => { console.log( err.toString() ) },
          res => {
            if (res == 0)
              res = "0" + "0".repeat(tok.decimals);

            let val = COMMONVIEW.shiftValueLeftDecimals( res, tok.decimals() );
            WALLETVIEW.setTokenBalance( val );
          } );

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
    let txobj = {
      from: ACCOUNTMODEL.getUser().address,
      to: tok.sca(),
      data: calldata,
      gas: ERC20.TRANSFERGAS,
      gasPrice: (WALLETVIEW.gasPrice() * 1e09),
      nonce: WALLETVIEW.nonce()
    };

    setTxFields( txobj );
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
    let gasl = WALLETVIEW.getGasLimit();

    let txobj = {
      from: ACCOUNTMODEL.getUser().address,
      to: sca,
      gasPrice: (WALLETVIEW.gasPrice() * 1e09),
      nonce: WALLETVIEW.nonce()
    };

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
        WALLETVIEW.setGasLimit( est );
        gasl = est;
        txobj.gas = gasl;
      } )
      .catch( e => { console.log(e) } );
    }

    txobj.gas = gasl;
    setTxFields( txobj );
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
    calcContractTx:calcContractTx
  };

})();

