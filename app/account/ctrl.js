var ACCOUNTCTRL = (function() {

  var challengeB64;

  function initAccountTab() {

    try {
      ACCOUNTMODEL.refreshTxCount();
    }
    catch( e ) { }

    setTimeout( () => {
      ACCOUNTMODEL.currentUserBalance( bal => {
        ACCOUNTVIEW.setUserFields(
          ACCOUNTMODEL.getUser().address, bal, ACCOUNTMODEL.getUser().nonce );
      } );
    }, 500 );
  }

  function ingestRawKey() {
    let hexstr = ACCOUNTVIEW.getRawKey();
    ACCOUNTMODEL.loadUserByRawKey( hexstr,
      err => { ACCOUNTVIEW.rawKeyLoaded( false ); },
      () => {
        ACCOUNTVIEW.rawKeyLoaded( true );
        setTimeout( initAccountTab, 100 ); // yield thread
      }
    );
  }

  function ingestGeth() {
    let gethobjstr = ACCOUNTVIEW.getGethVal();
    let passphrase = ACCOUNTVIEW.getPassphraseFromUser();

    ACCOUNTMODEL.loadUserByGeth( gethobjstr, passphrase,
      err => { ACCOUNTVIEW.gethObjLoaded( false ) },
      () => {
        ACCOUNTVIEW.gethObjLoaded( true );
        setTimeout( initAccountTab, 100 ); // yield thread
      }
    );
  }

  function identityChallenge() {
    let randomSessionKey = CRYPTO.randomBytes(32);
    challengeB64 = ADILOS.makeChallenge( randomSessionKey );

    COMMONCTRL.setCallback( qrScanned );
    COMMONCTRL.setMainScreen( false );
    QRDIALOG.showQR( true, challengeB64 );
  }

  function qrScanned( respB64 ) {
    global.pauseQRScanner();
    let userpubkey = ADILOS.validateResponse( respB64, challengeB64 );
    if (userpubkey) {
      ACCOUNTMODEL.loadUserByPublicKey( userpubkey );
    }
    else
      alert( 'something fucky' );
  }

  return {
    initAccountTab:initAccountTab,
    ingestRawKey:ingestRawKey,
    ingestGeth:ingestGeth,
    identityChallenge:identityChallenge,
    qrScanned:qrScanned
  };

})();

