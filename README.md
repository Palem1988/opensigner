# WalletConnect

Simple library to connect with wallet-connect's bridge server. Works with browsers, node.js and react-native.

You can read more about WalletConnect protocol here: http://walletconnect.org/

## install

```bash
npm install --save walletconnect # yarn add walletconnect
```

## Example

```js
import WalletConnect from 'walletconnect'

const sharedKey = WalletConnect.generateSharedKey()
const walletConnect = new WalletConnect(sharedKey)

const data = {address: '0x123'}
const encryptedObj = walletConnect.encrypt(JSON.stringify(data))
const decrypted = JSON.parse(walletConnect.decrypt(obj).data)
```
