var STRINGS = {};
var LANG = "English";

var LABELS = (function() {
  'use strict';

  function setLabels()
  {
    // tab button labels
    $( "#AccountTabButton").html( STRINGS[LANG].AccountTabButton );
    $( "#WalletTabButton").html( STRINGS[LANG].WalletTabButton );
    $( "#SmartContractTabButton").html( STRINGS[LANG].SmartContractTabButton );

    // account
    $( "#LoginLabel" ).html( STRINGS[LANG].LoginLabel );
    $( "#LoadRawKeyLabel" ).html( STRINGS[LANG].LoadRawKeyLabel );
    $( "#OrLabel" ).html( STRINGS[LANG].OrLabel );
    $( "#PasteGethFileLabel" ).html( STRINGS[LANG].PasteGethFileLabel );
    $( "#AccountStatusLabel" ).html( STRINGS[LANG].AccountStatusLabel );
    $( "#AddrLabel" ).html( STRINGS[LANG].AddrLabel );
    $( "#MyBalanceLabel" ).html( STRINGS[LANG].MyBalanceLabel );
    $( "#TxCountLabel" ).html( STRINGS[LANG].TxCountLabel );

    // wallet

    $( "#SendFundsLabel" ).html( STRINGS[LANG].SendFundsLabel );
    $( "#SendToAddrLabel" ).html( STRINGS[LANG].SendToAddrLabel );
    $( "#SendAmountLabel" ).html( STRINGS[LANG].SendAmountLabel );
    $( "#SendCalldataLabel" ).html( STRINGS[LANG].SendCalldataLabel );

    $( "#ERC20TokensLabel" ).html( STRINGS[LANG].ERC20TokensLabel );
    $( "#SelectTokenLabel" ).html( STRINGS[LANG].SelectTokenLabel );
    $( "#MyTokenBalLabel" ).html( STRINGS[LANG].MyTokenBalLabel );
    $( "#TokenToLabel" ).html( STRINGS[LANG].TokenToLabel );
    $( "#TokenAmountLabel" ).html( STRINGS[LANG].TokenAmountLabel );

    $( "#CallContractLabel" ).html( STRINGS[LANG].CallContractLabel );
    $( "#SCALabel" ).html( STRINGS[LANG].SCALabel );
    $( "#ABILabel" ).html( STRINGS[LANG].ABILabel );
    $( "#FunctionLabel" ).html( STRINGS[LANG].FunctionLabel );
    $( "#ParametersLabel" ).html( STRINGS[LANG].ParametersLabel );
    $( "#ValuePayableLabel" ).html( STRINGS[LANG].ValuePayableLabel );
    $( "#GasLimitLabel" ).html( STRINGS[LANG].GasLimitLabel );

    $( "#GasPriceLabel" ).html( STRINGS[LANG].GasPriceLabel );
    $( "#NonceOverrideLabel" ).html( STRINGS[LANG].NonceOverrideLabel );
    $( "#TxJSONLabel" ).html( STRINGS[LANG].TxJSONLabel );
    $( "#RawSignedTxLabel" ).html( STRINGS[LANG].RawSignedTxLabel );
  }

  return {
    setLabels:setLabels
  };

})();
