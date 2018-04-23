/* global describe, it, before */

import chai from 'chai'

import {generateKey, WalletConnector} from '../lib/walletconnect.js'

chai.expect()

const expect = chai.expect

describe('Given an instance of wallet connect', () => {
  let walletConnector

  before(async() => {
    const sharedKey = await generateKey()
    walletConnector = new WalletConnector('http://localhost:3000', sharedKey)
  })

  it('should initiate wallet connect properly', async() => {
    const obj = await walletConnector.encrypt({address: '0x123'})
    console.log(obj)
    console.log(walletConnector.decrypt(obj))
  })
})
