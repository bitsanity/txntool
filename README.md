# Ethereum Transaction Tool

Use this simple Ethereum wallet desktop UI to create and sign offline Ethereum
transactions that you can later provide to a public Ethereum gateway.

## Uses

* Send Ether
* Transfer ERC20 tokens
* Call any function on any smart contract

## Requirements

1. Provide your private key as either raw, unencrypted bytes (you like living
   dangerously), or copy/paste your encrypted geth account file (safer).

2. You will need the ERC20 token's SCA (smart contract address) to transfer
   tokens.

3. You will need the SCA and the smart contract's ABI (abstract binary
   interface) to call a smart contract.

## Warnings

1. Be careful to ensure you are using the correct nonce.

2. The program gets the suggested gas price - check it through other sources
   and override if desired.

3. Includes minimized versions of jQuery, keythereum and web3 that may not be
   the latest.

4. Includes altered version of npm module secp256k1. See
   [github](https://github.com/cryptocoinjs/secp256k1-node/issues/175) issue.
