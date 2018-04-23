import Connector from './connector'
import {generateKey} from './utils'

export default class WebConnector extends Connector {
  async createSession() {
    // create shared key
    if (!this.sharedKey) {
      this.sharedKey = await generateKey()
    }

    // store session info on bridge
    const res = await this.frisbeeInstance.post('/session/new')
    return res.body
  }
}
