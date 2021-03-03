var COMMONCTRL = (function() {

  var scannedCallback;

  function setMainScreen( bool ) {
    if (bool) {
      $( "#QRDialog" ).hide();
      $( "#CameraDialog" ).hide();
      $( "#TabButtons" ).show();
      $( "#AccountTab" ).hide();
      $( "#WalletTab" ).hide();
    }
    else {
      $( "#QRDialog" ).show();
      $( "#TabButtons" ).hide();
      $( "#AccountTab" ).hide();
      $( "#WalletTab" ).hide();
    }
  }

  function respond() {
    $( "#QRDialog" ).hide();
    $( "#CameraDialog" ).show();
    global.startQRScanner();
  }

  function cancelResponse() {
    global.pauseQRScanner();
    setMainScreen( true );
  }

  function qrScanned( res ) {
    setMainScreen( true );
    scannedCallback( res );
  }

  function setCallback( cb ) {
    scannedCallback = cb;
  }

  return {
    setMainScreen:setMainScreen,
    respond:respond,
    cancelResponse:cancelResponse,
    qrScanned:qrScanned,
    setCallback:setCallback
  };

})();

