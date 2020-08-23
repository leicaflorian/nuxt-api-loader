const _settings = function (moduleOptions) {
    this.apiFolder = "api"
    this.routesFolder = `${this.apiFolder}/routes`
    this.schemasFolder = `${this.apiFolder}/schemas`

    return this
}.call({})

function merge(newObj) {
    return Object.assign(_settings, newObj || {})
}


module.exports = {
    ..._settings,
    merge
}