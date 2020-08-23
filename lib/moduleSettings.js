let _settings = function (moduleOptions) {
    this._rootDir = ""
    this.apiFolder = "api"
    this.routesFolder = `${this.apiFolder}/routes`
    this.schemasFolder = `${this.apiFolder}/schemas`

    return this
}.call({})

function merge(newObj) {
    return Object.assign(_settings, newObj || {})
}


_settings.merge  = merge

module.exports = _settings