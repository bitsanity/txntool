var QRDIALOG = (function() {

  function clear() {
    $( "#ChallengeArea" ).empty();
  }

  function showQR( isIdent, qrtxt ) {
    clear();
    if (isIdent)
      $( "#ChallengeLabel" ).html( STRINGS[LANG].IdentChallengeLabel );
    else
      $( "#ChallengeLabel" ).html( STRINGS[LANG].SignChallengeLabel );

    $( "#QRDialog" ).show();

    let qrcode = new QRCode( "ChallengeArea", {
      text: qrtxt,
      width: 450,
      height: 450,
      colorDark: isIdent ? "#000000" : "#990000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    } );
  }

  return {
    clear:clear,
    showQR:showQR
  };

})();
