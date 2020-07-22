var COMMONVIEW = (function() {
  'use strict';

  function openTab(evt, tabName) {
    var ii, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (ii = 0; ii < tabcontent.length; ii++) {
      tabcontent[ii].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (ii = 0; ii < tablinks.length; ii++) {
      tablinks[ii].className = tablinks[ii].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  // ethereum timestamps are seconds since epoch
  function timestampToZulu( ts_secs ) {
    return new Date( ts_secs * 1000 ).toUTCString();
  }

  function userAlert( str ) {
    alert( str );
  }

  function userConfirm( msg ) {
    return confirm( msg );
  }

  function userPrompt( msg ) {
    return prompt( msg );
  }

  function userConfirmTransaction( command, acct, val, gas, gasprix ) {

    let msg = command + "\n" +
      "{from:" + acct + ",value:" + val + ",gas:" + gas + ",gasPrice:" +
      gasprix + "}";

    return confirm( msg );
  }

  function setHighlighted( widget, isHighlit ) {
    if (isHighlit)
      widget.style.backgroundColor = "yellow";
    else
      widget.style.backgroundColor = "initial";
  }

  function shiftValueRightDecimals( strval, decs ) {

    let working = strval;
    if (working.indexOf('.') == -1)
      working.concat( '.' );

    let decix = 0, wholepart = '', fracpart = '';

    for (let ii = 0; ii < decs; ii++) {
      decix = working.indexOf( '.' );

      wholepart = (decix != -1) ? working.substring( 0,decix ) : working;
      fracpart = (decix != -1) ? working.substring( decix+1 ) : '';

      if (fracpart.length == 0)
        working = wholepart + '0.';
      else
        working = wholepart +
                  fracpart[0] +
                  '.' +
                  fracpart.substring( 1 );
    }

    return working.substring( 0, working.indexOf('.') ).replace( /^0+/, '' );
  }

  function shiftValueLeftDecimals( strval, decs ) {
    if (!strval || strval.length == 0 || /^0+$/.test(strval))
      return "0";

    let working = strval;

    for (let ii = 0; ii < decs; ii++) {
      let parts = working.split( '.' );

      if ( parts.length > 1 ) { // fractional
        if (parts[0].length > 0) {
          working =   parts[0].substring( 0, parts[0].length - 1 )
                    + '.'
                    + parts[0][parts[0].length - 1]
                    + parts[1];
        }
        else {
          working = '.0' + parts[1];
        }
      }
      else { // whole number
        if (parts[0].length > 0) {
          working =   parts[0].substring( 0, parts[0].length - 1 )
                    + '.'
                    + parts[0][parts[0].length - 1];
        }
        else {
          working = '0';
        }
      }

      if (working.indexOf('.') != -1)
        working = working.replace( /0+$/, '' );
    }
  
    working = working.replace( /\.$/, '' );

    if (working.startsWith('.'))
      working = '0' + working;

    return working;
  }

  return {
    openTab:openTab,
    timestampToZulu:timestampToZulu,
    userAlert:userAlert,
    userConfirm:userConfirm,
    userPrompt:userPrompt,
    userConfirmTransaction:userConfirmTransaction,
    setHighlighted:setHighlighted,
    shiftValueRightDecimals:shiftValueRightDecimals,
    shiftValueLeftDecimals:shiftValueLeftDecimals
  };

})();

