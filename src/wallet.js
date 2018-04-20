import crypto from 'crypto'

import {generateKey as _generateKey} from './utils'

const AES_ALGORITHM = 'AES-256-CBC'
const HMAC_ALGORITHM = 'SHA256'

export default class WalletConnect {
  constructor(key) {
    this._sharedKey = key
    this._counter = 0
  }

  encrypt(data, customIv = null) {
    if (!this._sharedKey) {
      throw new Error(
        'Shared key is required. Please use `setSharedKey` before using encryption'
      )
    }

    const key = this._sharedKey
    const iv = Buffer.from(customIv || _generateKey())
    const actualContent = JSON.stringify({
      data: data,
      counter: this._counter
    })

    // update counter
    this._counter += 1

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
      nonce: this._counter,
      iv: iv.toString('hex')
    }
  }

  decrypt({data, hmac, nonce, iv}) {
    const key = this._sharedKey
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

  setSharedKey(key) {
    this._sharedKey = key
  }

  //
  // static methods
  //

  static generateSharedKey(n = 32) {
    return _generateKey(n)
  }
}
