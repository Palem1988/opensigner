import Connector from './connector'
import {generateKey, handleResponse} from './utils'
import Listener from './listener'

export default class WebConnector extends Connector {
  //
  // Create session
  //
  async createSession() {
    if (this.sessionId) {
      throw new Error('session already created')
    }

    // create shared key
    if (!this.sharedKey) {
      this.sharedKey = await generateKey()
    }

    // store session info on bridge
    const res = await this.frisbeeInstance.post('/session/new')
    handleResponse(res)

    // session id
    this.sessionId = res.body.sessionId

    // sessionId and shared key
    return {
      sessionId: this.sessionId,
      sharedKey: this.sharedKey
    }
  }

  //
  // create transaction
  //
  async createTransaction(data = {}) {
    if (!this.sessionId) {
      throw new Error(
        'Create session using `createSession` before sending transaction'
      )
    }

    // encrypt data
    const encryptedData = await this.encrypt(data)

    // store transaction info on bridge
    const res = await this.frisbeeInstance.post(
      `/session/${this.sessionId}/transaction/new`,
      {
        body: {
          data: encryptedData,
          dappName: this.dappName
        }
      }
    )
    handleResponse(res)

    // return transactionId
    return {
      transactionId: res.body.transactionId
    }
  }

  //
  // get session status
  //
  getSessionStatus() {
    if (!this.sessionId) {
      throw new Error('sessionId is required')
    }

    return this._getEncryptedData(`/session/${this.sessionId}`)
  }

  //
  // get transaction status
  //
  getTransactionStatus(transactionId) {
    if (!this.sessionId || !transactionId) {
      throw new Error('sessionId and transactionId are required')
    }

    return this._getEncryptedData(
      `/session/${this.sessionId}/transaction/${transactionId}/status`
    )
  }

  //
  // Listen for session status
  //
  listenSessionStatus(cb, pollInterval = 1000, timeout = 60000) {
    return new Listener(this, {
      fn: () => {
        return this.getSessionStatus()
      },
      cb,
      pollInterval,
      timeout
    })
  }

  //
  // Listen for session status
  //
  listenTransactionStatus(
    transactionId,
    cb,
    pollInterval = 1000,
    timeout = 60000
  ) {
    return new Listener(this, {
      fn: () => {
        return this.getTransactionStatus(transactionId)
      },
      cb,
      pollInterval,
      timeout
    })
  }
}
