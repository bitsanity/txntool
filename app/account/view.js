var ACCOUNTVIEW = (function() {

  function getRawKey() {
    return $( "#LoadRawKeyField" ).val();
  }

  function getGethVal() {
    return $( "#PasteGethFileField" ).val();
  }

  function getPassphraseFromUser() {
    return prompt( STRINGS[LANG].PassphrasePrompt );
  }

  function setUserFields( addr, bal, nonce ) {
    $( "#MyBalanceValue" ).html( bal );

    let url = 'https://etherscan.io/address/' + addr;
    let spn = '<span onclick=window.open("' + url + '") >' + addr + '</span>';

    $( "#AddrValue" ).html( spn );
    $( "#TxCountValue" ).html( nonce );
  }

  function rawKeyLoaded( isGood ) {
    let tab = $( "#StartTabButton" );
    let fld = $( "#LoadRawKeyField" );

    if (isGood) {
      tab.removeClass( "redtext" );
      fld.removeClass( "highlighted" );
      fld.val( "" );
    }
    else {
      fld.addClass( "highlighted" );
    }
  }

  function gethObjLoaded( isGood ) {
    let tab = $( "#StartTabButton" );
    let fld = $( "#PasteGethFileField" );

    if (isGood) {
      tab.removeClass( "redtext" );
      fld.removeClass( "highlighted" );
      fld.val( "" );
    }
    else {
      fld.addClass( "highlighted" );
    }
  }

  function getToAddress() {
    return $( "#SendToAddrValue" ).val();
  }

  function getAmount() {
    return $( "#SendAmountValue" ).val();
  }

  function getCalldata() {
    return $( "#SendCalldataValue" ).val();
  }

  function clearSendFields() {
    $( "#SendToAddrValue" ).val( "" );
    $( "#SendAmountValue" ).val( "" );
    $( "#SendCalldataValue" ).val( "" );
  }

  return {
    getRawKey:getRawKey,
    getGethVal:getGethVal,
    getPassphraseFromUser:getPassphraseFromUser,
    setUserFields:setUserFields,
    rawKeyLoaded:rawKeyLoaded,
    gethObjLoaded:gethObjLoaded,
    getToAddress:getToAddress,
    getAmount:getAmount,
    getCalldata:getCalldata,
    clearSendFields:clearSendFields
  };

})();

