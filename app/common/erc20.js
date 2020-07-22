class ERC20 {

  static TRANSFERFROMGAS = 100000;
  static TRANSFERGAS = 100000;
  static APPROVEGAS = 100000;

  static ABI = JSON.parse(
'[{"inputs":[{"internalType":"uint256","name":"initialSupply","type":"uint256"},{"internalType":"string","name":"tokenName","type":"string"},{"internalType":"uint8","name":"decimalUnits","type":"uint8"},{"internalType":"string","name":"tokenSymbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"delegate","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]' );

  static ETHEREUM = {
    sca:"0x0000000000000000000000000000000000000000",
    totalSupply:"unlimited",
    decimals:18,
    symbol:"ETH",
    name:"Ether"
  };

  static cache = {
    "0x0000000000000000000000000000000000000000" : new ERC20(this.ETHEREUM)
  }

  static tokenSCAs() {
    return Object.keys(this.cache);
  }

  static fetch( toksca, errcb, rescb ) {
    if (!toksca || toksca.length == 0) {
      if (errcb) errcb( "invalid sca" );
      return null;
    }
    toksca = toksca.toLowerCase();

    if (this.cache[toksca]) {
      if (rescb) rescb( this.cache[toksca] );
      return this.cache[toksca];
    }

    let web3 = COMMONMODEL.getWeb3();
    let con = new web3.eth.Contract( ERC20.ABI, toksca );
    let tok = { smartcontract: con, sca: toksca };

    con.methods.totalSupply().call().then( ts => {
      tok.totalSupply = ts;
      con.methods.decimals().call().then( dec => {
        tok.decimals = dec;
        con.methods.symbol().call().then( sym => {
          tok.symbol = sym;
          con.methods.name().call().then( nam => {
            tok.name = nam;
            this.cache[toksca] = new ERC20( tok );
            if (rescb) rescb( this.cache[toksca] );
          } )
          .catch( err => { errcb(err); } );
        } )
        .catch( err => { errcb(err); } );
      } )
      .catch( err => { errcb(err); } );
    } )
    .catch( err => { errcb(err); } );
  }

  constructor( blob ) {
    this.blob = blob;
  }

  sca() {
    return this.blob.sca;
  }

  totalSupply() {
    return this.blob.totalSupply;
  }

  decimals() {
    return this.blob.decimals;
  }

  symbol() {
    return this.blob.symbol;
  }

  name() {
    return this.blob.name;
  }

  balanceOf( addr, errcb, rescb ) {
    this.blob.smartcontract.methods.balanceOf( addr ).call()
    .then( res => {
      rescb( res );
    } )
    .catch( err => {
      errcb( err.toString() );
    } );
  }

  allowance( owner, spender, errcb, rescb ) {
    this.blob.smartcontract.methods.allowance( owner, spender )
    .then( res => {
      rescb( res );
    } )
    .catch( err => {
      errcb( err.toString() );
    } );
  }

  transfer( toaddr, quant, errcb, rescb ) {
    let calldata =
      this.blob.smartcontract.methods.transfer( toaddr, quant ).encodeABI();

    this.doTransaction( calldata, ERC20.TRANSFERGAS,
      err => { errcb(err) },
      res => { rescb(res) } );
  }

  approve( spender, quant, errcb, rescb ) {
    let calldata =
      this.blob.smartcontract.methods.approve( spender, quant ).encodeABI();

    this.doTransaction( calldata, ERC20.APPROVEGAS,
      err => { errcb(err) },
      res => { rescb(res) } );
  }

  transferFrom( from, to, quant, errcb, rescb ) {
    let calldata =
      this.blob.smartcontract.methods.transferFrom( from, to, quant )
      .encodeABI();

    this.doTransaction( calldata, ERC20.TRANSFERFROMGAS,
      err => { errcb(err) },
      res => { rescb(res) } );
  }

  async doTransaction( calldata, gasunits, errcb, rescb ) {
    let thenonce = ACCOUNTMODEL.getUser().nonce++;
    let txobj = { nonce: thenonce,
                  to: this.sca(),
                  from: ACCOUNTMODEL.getUser().address,
                  data: calldata,
                  gas: gasunits,
                  gasPrice: SETTINGSVIEW.gasPrice() };

    let priv = ACCOUNTMODEL.getUser().privkey.toString('hex');
    let signedTxObj =
      await COMMONMODEL.getWeb3().eth.accounts.signTransaction( txobj, priv );

    COMMONMODEL.getWeb3().eth.sendSignedTransaction(
      signedTxObj.rawTransaction, (err, res) => {
        if (err)
          errcb( err.toString() );
        else
          rescb( res );
      }
    );
  }
}
