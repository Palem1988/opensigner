import Connector from './connector'
import {generateKey, handleResponse} from './utils'

export default class WebConnector extends Connector {
  //
  // Create session
  //
  async createSession() {
    // create shared key
    if (!this.sharedKey) {
      this.sharedKey = await generateKey()
    }

    // store session info on bridge
    const res = await this.frisbeeInstance.post('/session/new')
    handleResponse(res)

    // session id
    this.sessionId = res.body.sessionId

    // return sessionId
    return this.sessionId
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
      {body: encryptedData}
    )
    handleResponse(res)

    // return transactionId
    return res.body.transactionId
  }

  //
  // get session data
  //
  async getSessionData() {
    if (!this.sessionId) {
      throw new Error('sessionId is required')
    }

    return this._getEncryptedData(`/session/${this.sessionId}`)
  }

  //
  // get transaction data
  //
  async getTransactionData(transactionId) {
    if (!this.sessionId || !transactionId) {
      throw new Error('sessionId and transactionId are required')
    }

    return this._getEncryptedData(
      `/session/${this.sessionId}/transaction/${transactionId}`
    )
  }

  //
  // get transaction status
  //
  async getTransactionStatus(transactionId) {
    if (!this.sessionId || !transactionId) {
      throw new Error('sessionId and transactionId are required')
    }

    return this._getEncryptedData(
      `/session/${this.sessionId}/transaction/${transactionId}/status`
    )
  }

  // getter for session id
  get sessionId() {
    return this._sessionId
  }

  // setter for sessionId
  set sessionId(value) {
    this._sessionId = value
  }
}
