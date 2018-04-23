import crypto from 'crypto'
import Frisbee from 'frisbee'

import {generateKey} from './utils'

const AES_ALGORITHM = 'AES-256-CBC'
const HMAC_ALGORITHM = 'SHA256'

export default class Connector {
  constructor(url, key) {
    // set bridge url and key
    this.bridgeURL = url
    this.sharedKey = key

    // counter
    this._counter = 0

    // frisbee instance
    this._frisbeeInstance = new Frisbee({
      baseURI: url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }

  get bridgeURL() {
    return this._bridgeURL
  }

  set bridgeURL(url) {
    this._bridgeURL = url
  }

  get sharedKey() {
    return this._sharedKey
  }

  set sharedKey(key) {
    this._sharedKey = key
  }

  async encrypt(data, customIv = null) {
    const key = this.sharedKey
    if (!key) {
      throw new Error(
        'Shared key is required. Please use `sharedKey` before using encryption'
      )
    }

    // use custom iv or generate one
    let rawIv = customIv
    if (!rawIv) {
      rawIv = await generateKey(128 / 8)
    }
    const iv = Buffer.from(rawIv)

    // update counter
    this._counter += 1

    const actualContent = JSON.stringify({
      data: data,
      aad: this._counter
    })

    const encryptor = crypto.createCipheriv(AES_ALGORITHM, key, iv)
    encryptor.setEncoding('hex')
    encryptor.write(actualContent)
    encryptor.end()

    // get cipher text
    const encryptedData = encryptor.read()

    // ensure that both the IV and the cipher-text is protected by the HMAC
    const hmac = crypto.createHmac(HMAC_ALGORITHM, key)
    hmac.update(encryptedData)
    hmac.update(iv.toString('hex'))

    return {
      data: encryptedData,
      hmac: hmac.digest('hex'),
      aad: this._counter, // message counter for the "additional authenticated data"
      iv: iv.toString('hex')
    }
  }

  decrypt({data, hmac, nonce, iv}) {
    const key = this.sharedKey
    const ivBuffer = Buffer.from(iv, 'hex')
    const hmacBuffer = Buffer.from(hmac, 'hex')

    const chmac = crypto.createHmac(HMAC_ALGORITHM, key)
    chmac.update(data)
    chmac.update(ivBuffer.toString('hex'))
    const chmacBuffer = Buffer.from(chmac.digest('hex'), 'hex')

    // compare buffers
    if (Buffer.compare(chmacBuffer, hmacBuffer) !== 0) {
      return null
    }

    const decryptor = crypto.createDecipheriv(AES_ALGORITHM, key, ivBuffer)
    const decryptedText = decryptor.update(data, 'hex', 'utf8')
    return decryptedText + decryptor.final('utf8')
  }
}
