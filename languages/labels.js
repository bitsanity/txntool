var STRINGS = {};
var LANG = "English";

var LABELS = (function() {
  'use strict';

  function setLabels()
  {
    // dialogs
    $( "#BackButton").html( STRINGS[LANG].BackButton );
    $( "#ChallengeLabel").html( STRINGS[LANG].IdentChallengeLabel );
    $( "#RespondButton").html( STRINGS[LANG].RespondButton );
    $( "#CameraLabel").html( STRINGS[LANG].CameraLabel );
    $( "#CancelResponseButton").html( STRINGS[LANG].CancelResponseButton );

    // tab button labels
    $( "#AccountTabButton").html( STRINGS[LANG].AccountTabButton );
    $( "#WalletTabButton").html( STRINGS[LANG].WalletTabButton );
    $( "#SettingsTabButton").html( STRINGS[LANG].SettingsTabButton );

    $( "#SmartContractTabButton").html( STRINGS[LANG].SmartContractTabButton );

    // account
    $( "#LoginLabel" ).html( STRINGS[LANG].LoginLabel );
    $( "#LoadRawKeyLabel" ).html( STRINGS[LANG].LoadRawKeyLabel );
    $( "#OrLabel" ).html( STRINGS[LANG].OrLabel );
    $( "#OrLabel2" ).html( STRINGS[LANG].OrLabel );
    $( "#ADILOSLabel" ).html( STRINGS[LANG].ADILOSLabel );
    $( "#ADILOSChallengeButton" ).html( STRINGS[LANG].ADILOSChallengeButton );
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
    $( "#SignButton" ).html( STRINGS[LANG].SignButton );
    $( "#SendButton" ).html( STRINGS[LANG].SendButton );

    // settings
    $( "#WEB3URLLabel" ).html( STRINGS[LANG].WEB3URLLabel )
  }

  return {
    setLabels:setLabels
  };

})();
