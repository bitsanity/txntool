var SETTINGSCTRL = (function() {

  function initSettingsTab() {
  }

  function setURL( val ) {
    COMMONMODEL.connect( val,
      err => {
        console.log( err );
      },
      res => {
        console.log( "connected" );
      }
    )
  }

  return {
    initSettingsTab:initSettingsTab,
    setURL:setURL
  };

})();

