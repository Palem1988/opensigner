# WalletConnect

Simple library to connect with wallet-connect's bridge server. Works with browsers and react-native.

You can read more about WalletConnect protocol here: http://walletconnect.org/

## install

```bash
npm install --save walletconnect # yarn add walletconnect
```

**Extra step for react-native**

It needs [rn-nodify](https://github.com/tradle/rn-nodeify)'s `crypto` package for encryption and decryption.

## Browser Dapp Example

```js
import {WebConnector} from 'walletconnect'

// create web connector given bridgeDomain and dappName
const webConnector = new WebConnector(
  bridgeDomain, // e.g, 'https://walletconnect.matic.network'
  { dappName: dappName }
)

// create new session
const session = await webConnector.createSession()
console.log(session.sessionId) // prints session id
console.log(session.sharedKey.toString('hex')) // prints shared private key

// fetch session status
// const sessionStatus = await webConnector.getSessionStatus()

// listen status
webConnector.listenSessionStatus((err, result) => {
  if (error) {
    // handle error
  } else if (result) {
    const accountAddress = result.address;
    // handle account address
  }
})

// draft tx
const tx = {from: '0xab12...1cd', to: '0x0', nonce: 1, gas: 100000, value: 0, data: '0x0'}

// create transaction
const transactionId = await webConnector.createTransaction(tx)

// listen for tx status
webConnector.listenTransactionStatus(transactionId, (err, result) => {
  if (err) {
    // handle error
  } else if (result) {
    const success = result.success;
    if (success) {
      const txHash = result.txHash;
      // handle txHash
    }
  }
})

// alternatively, single call to fetch tx status (client responsible for polling)
const txStatus = await webConnector.getTransactionStatus()
```


## Mobile Wallet Example

```js
import {WalletConnector} from 'walletconnect'

// create wallet connector
const walletConnector = new WalletConnector(
  'https://walletconnect.matic.network',
  {
    sessionId: session.sessionId,
    sharedKey: session.sharedKey,
    dappName: 'Matic wallet'
  }
)

// send session data
const success = await walletConnector.sendSessionStatus({
  fcmToken: '12354...3adc',  // fcm token,
  walletWebhook: 'https://walletconnect.matic.network/notification/new',  // wallet webhook
  data: {
    address: '0xab12...1cd' // address fetched from phrase
  }
})

// get transaction data (assuming mobile client received transactionId from a push notification)
const transactionData = await walletConnector.getTransactionRequest(transactionId);

// send transaction status
const success = await walletConnector.sendTransactionStatus(transactionId, {
  success: true,
  txHash: '0xabcd..873'
})
```
