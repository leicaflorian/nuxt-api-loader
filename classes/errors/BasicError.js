const HttpStatus = require('http-status-codes')

export class BasicError extends Error {
  static _errors = {}

  /**
   *
   * @param {string} message
   * @param {Number} [code]
   */
  constructor(message, code) {
    super(message)

    this.code = code || null
    this.message = this.message || 'Basic error - ' + this.constructor.name

    BasicError.errors
  }

  static get httpCodes() {
    return HttpStatus
  }
}
