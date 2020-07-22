var ACCOUNTCTRL = (function() {

  function initAccountTab() {

    ACCOUNTMODEL.refreshTxCount();

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

  return {
    initAccountTab:initAccountTab,
    ingestRawKey:ingestRawKey,
    ingestGeth:ingestGeth
  };

})();

