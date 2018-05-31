/* global describe, it, before */

import fetch from 'node-fetch'
import XMLHttpRequest from 'xhr2'
import chai from 'chai'

import {generateKey, WalletConnector, WebConnector} from '../src'

// set fetch
global.XMLHttpRequest = XMLHttpRequest
global.fetch = fetch

chai.expect()

const expect = chai.expect

describe('Given an instance of wallet connect', () => {
  let webConnector

  before(async() => {})

  it('should initiate wallet connect properly', async() => {})
})
