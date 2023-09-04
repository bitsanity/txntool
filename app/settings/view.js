var SETTINGSVIEW = (function() {

  function getURL() {
    return $( "#LoadRawKeyField" ).val();
  }

  function setURL( url ) {
    $( "#LoadRawKeyField" ).val( url );
  }

  return {
    getURL:getURL,
    setURL:setURL,
  };

})();

