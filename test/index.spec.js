/* global describe, it, before */

import chai from 'chai'
import WalletConnect from '../lib/walletconnect.js'

chai.expect()

const expect = chai.expect

describe('Given an instance of wallet connect', () => {
  let walletConnect

  before(() => {
    walletConnect = new WalletConnect()
  })

  it('should initiate wallet connect properly', () => {
    const sharedKey = WalletConnect.generateSharedKey()
    walletConnect.setSharedKey(sharedKey)

    const obj = walletConnect.encrypt(JSON.stringify({address: '0x123'}))
    console.log(obj)
    console.log(walletConnect.decrypt(obj))
  })
})
