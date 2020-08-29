const path = require("path")

let _settings = function (moduleOptions) {
    this._rootDir = ""
    this.apiFolder = "api"
    this.routesFolder = `${this.apiFolder}/routes`
    this.schemasFolder = `${this.apiFolder}/schemas`,
    this.prependMiddlewares = []

    return this
}.call({})

function merge(newObj) {
    return Object.assign(_settings, newObj || {})
}

function resolve(prop, ...routes) {
    return path.resolve(_settings._rootDir, _settings[prop], ...routes)
}

_settings.merge = merge
_settings.resolve = resolve

module.exports = _settings