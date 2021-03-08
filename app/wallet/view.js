var WALLETVIEW = (function() {

  function clearFields() {
    $( "#SendToAddrValue" ).val( "" );
    $( "#SendAmountValue" ).val( "" );
    $( "#SendCalldataValue" ).val( "" );
    $( "#SendEthTxValue" ).html( "" );

    $( "#TokenSelector" ).val( "" );
    $( "#MyTokenBalValue" ).html( "" );
    $( "#TokenToValue" ).val( "" );
    $( "#TokenAmountValue" ).val( "" );
    $( "#TokenTxValue" ).html( "" );

    $( "#SCAValue" ).val( "" );
    $( '#ContractConfirmed' ).html( "" );
    $( "#ABIValue" ).val( "" );
    $( "#FunctionSelector" ).html( "" );
    $( "#ParameterValues" ).html( "" );
    $( "#ValuePayableValue" ).val( "" );
    $( "#GasLimitValue" ).val( "" );

    setTransaction( "" );
    signedTransaction( " " );
  }

  function opSelected( op ) {

    if (arguments.length == 0) {
      if ($("#WalletOpSendEth").prop("checked")) return 0;
      if ($("#WalletOpTransfer").prop("checked")) return 1;
      if ($("#WalletOpCallContract").prop("checked")) return 2;
    }

    if (op == 0) {
      $( "#WalletOpSendEth" ).prop( "checked", true );
      $( "#SendEthWidgets" ).show();
      $( "#TransferTokensWidgets" ).hide();
      $( "#CallContractWidgets" ).hide();
    }
    else if (op == 1) {
      $( "#WalletOpTransfer" ).prop( "checked", true );
      $( "#SendEthWidgets" ).hide();
      $( "#TransferTokensWidgets" ).show();
      $( "#CallContractWidgets" ).hide();
    }
    else if (op == 2) {
      $( "#WalletOpCallContract" ).prop( "checked", true );
      $( "#SendEthWidgets" ).hide();
      $( "#TransferTokensWidgets" ).hide();
      $( "#CallContractWidgets" ).show();
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

  function setTransaction( val ) {
    $( "#TxJSONValue" ).html( '<pre>' + val + '</pre>' );
  }

  function signedTransaction( val ) {
    if (val)
      $( "#RawSignedTxValue" ).val( val );
    else
      return $( "#RawSignedTxValue" ).val();
  }

  function getTokenSCA() {
    return $( "#TokenSelector" ).val();
  }

  function getTokenToAddress() {
    return $( "#TokenToValue" ).val();
  }

  function getTokenAmount() {
    return $( "#TokenAmountValue" ).val();
  }

  function gasPrice( val ) {
    if (!val) return $( "#GasPriceValue" ).val();
    $( "#GasPriceValue" ).val( val );
  }

  function nonce( val ) {
    if (arguments.length == 0) return $( "#NonceOverrideValue" ).val();
    $( "#NonceOverrideValue" ).val( val );
  }

  function setTokenBalance( val ) {
    $( '#MyTokenBalValue' ).html( val );
  }

  function getContractSCA() {
    return $( '#SCAValue' ).val();
  }

  function showContractValid( is ) {
    if (is)
      $( '#ContractConfirmed' ).html(
        '<span style="color:darkgreen;font-style:bold;">✅</span>' );
    else
      $( '#ContractConfirmed' ).html(
        '<span style="color:red;font-style:bold;">❌</span>' );
  }

  function abi( val ) {
    if (val) $( "#ABIValue" ).val( val );
    else return $( "#ABIValue" ).val();
  }

  function setFunctions( funcs ) {
    $( "#FunctionSelector" ).html( "" );

    if (!funcs || funcs.length == 0)
      return;

    var sel =
      $('<select id="FUNCSELECT" onchange="WALLETCTRL.functionSelected()">');

    $(funcs).each(function() {
      sel.append($("<option>").attr('value',this.val).text(this.text));
    });

    $( "#FunctionSelector" ).append( sel );
  }

  function getSelectedFunction() {
    return {
      val: $('#FUNCSELECT').val(),
      text: $( '#FUNCSELECT :selected' ).text()
    };
  }

  function setParameters( parms ) {
    $( '#ParameterValues' ).html( "" );

    let contents = '<table id=ParameterValuesTable>';
    let rowix = 0;

    parms.forEach( parm => {
      contents +=
      '<tr>' +
        '<td>' + parm.name + '</td>' +
        '<td class=units>(' + parm.type + ')</td>' +
        '<td><input id=Param' + parm.ix + ' class=data type=text size=56 ' +
               'onchange="WALLETCTRL.calcTx()" />' +
        '</td>' +
      '</tr>';
    } );

    contents += '</table>';
    $( '#ParameterValues' ).html( contents );
  }

  function getParameterValues() {
    let result = [];

    let table = document.getElementById( "ParameterValuesTable" );
    for (let ii = 0; ii < table.rows.length; ii++) {
      result.push( $('#Param'+ii).val() );
    }
    return result;
  }

  function getContractValue() {
    return $( '#ValuePayableValue' ).val();
  }

  function getGasLimit() {
    return $( '#GasLimitValue' ).val();
  }

  function setGasLimit( val ) {
    $( '#GasLimitValue' ).val( val );
  }

  return {
    opSelected:opSelected,
    getToAddress:getToAddress,
    getAmount:getAmount,
    getCalldata:getCalldata,
    clearFields:clearFields,

    setTokenBalance:setTokenBalance,
    getTokenSCA:getTokenSCA,
    getTokenToAddress:getTokenToAddress,
    getTokenAmount:getTokenAmount,

    getContractSCA:getContractSCA,
    showContractValid:showContractValid,
    abi:abi,
    setFunctions:setFunctions,
    getSelectedFunction:getSelectedFunction,
    setParameters:setParameters,
    getParameterValues:getParameterValues,
    getContractValue:getContractValue,
    getGasLimit:getGasLimit,
    setGasLimit:setGasLimit,
    gasPrice:gasPrice,
    nonce:nonce,
    setTransaction:setTransaction,
    signedTransaction:signedTransaction
  };

})();

