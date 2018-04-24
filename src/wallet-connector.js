import Connector from './connector'
import {handleResponse} from './utils'

export default class WalletConnector extends Connector {
  //
  // send session status
  //
  async sendSessionStatus(sessionId, sessionData = {}) {
    if (!sessionId) {
      throw new Error('`sessionId` is required')
    }

    const {fcmToken, walletWebhook, data = {}} = sessionData
    if (!fcmToken || !walletWebhook) {
      throw new Error('fcmToken and walletWebhook are required')
    }

    // encrypt data
    const encryptedData = await this.encrypt(data)

    // store transaction info on bridge
    const res = await this.frisbeeInstance.post(
      `/session/${sessionId}/status/new`,
      {
        body: {
          fcmToken,
          walletWebhook,
          data: encryptedData
        }
      }
    )
    handleResponse(res)
    return true
  }

  //
  // send transaction status
  //
  async sendTransactionStatus(sessionId, transactionId, statusData = {}) {
    if (!sessionId || !transactionId) {
      throw new Error('`sessionId` and `transactionId` are required')
    }

    // encrypt data
    const encryptedData = await this.encrypt(statusData)

    // store transaction info on bridge
    const res = await this.frisbeeInstance.post(
      `/session/${sessionId}/transaction/${transactionId}/status/new`,
      {
        body: encryptedData
      }
    )
    handleResponse(res)
    return true
  }

  //
  // get session request data
  //
  async getSessionRequest(sessionId) {
    if (!sessionId) {
      throw new Error('sessionId is required')
    }

    return this._getEncryptedData(`/session/${this.sessionId}`)
  }

  //
  // get transaction request data
  //
  async getTransactionRequest(sessionId, transactionId) {
    if (!sessionId || !transactionId) {
      throw new Error('sessionId and transactionId are required')
    }

    return this._getEncryptedData(
      `/session/${this.sessionId}/transaction/${transactionId}`
    )
  }
}
