
// const logger = require('../serverMiddleware/logger')

const fs = require("fs")
const path = require("path")
const express = require('express')
const cors = require('cors') // cors allow middleware

const settings = require("../moduleSettings")

module.exports = class ApiMiddleware {
  constructor(watchOptions) {
    this.app = express()

    const app = this.app

    this.watchOptions = watchOptions

    this.app.use(cors())
    this.app.use(express.json()) // for parsing application/json
    this.app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

    this._addUsersMiddlwares()

    this.app.get('/', (req, res, next) => {
      const availableRoutes = this._getRegisteredRoutes()

      if (availableRoutes[req.url].get > 1) {
        return next()
      }

      res.send("Api route")
    })

    this.app.use(function (err, req, res, next) {
      console.error(err)
    })

    this._registerRoutes()

    return this.app
  }

  async _addUsersMiddlwares() {
    if (!settings.prependMiddlewares || settings.prependMiddlewares.length == 0) {
      return
    }

    const middlewaresList = settings.prependMiddlewares instanceof Array
      ? settings.prependMiddlewares : [settings.prependMiddlewares];

    let finalList = []

    for (const middleware of middlewaresList) {
      let module = middleware

      if (typeof middleware === "string") {
        const mdoulePath = path.resolve(settings._rootDir, middleware.replace(/~\/|@\//, "./"))

        module = (await import(mdoulePath)).default
      }

      finalList.push(module)
    }

    this.app.use(finalList)
  }

  _getRouterStack(root) {
    const toReturn = (root || this.app._router).stack.reduce((acc, middleware) => {
      if (middleware.route) {
        acc.push(middleware)
      } else if (middleware.name === "router") {
        acc.push(...this._getRouterStack(middleware.handle))
      }

      return acc
    }, [])

    return toReturn
  }

  _getRegisteredRoutes() {
    const plainStacks = this.app._router.stack

    const routes = this._getRouterStack()
      .reduce((acc, middleware) => {
        const path = middleware.route.path

        /**
         * @type {{method: string, counter: number}}
         */
        const methods = Object.keys(middleware.route.methods)

        if (!acc[path]) {
          acc[path] = [...methods]
        } else {
          acc[path].push(...methods)
        }


        return acc
      }, {})


    return Object.keys(routes).reduce((acc, path) => {
      acc[path] = routes[path].reduce((methods, curr) => {
        if (!methods[curr]) {
          methods[curr] = 1
        } else {
          methods[curr] += 1
        }

        return methods
      }, {})

      return acc
    }, {})

  }

  async _registerRoutes() {
    // Import API Routes
    const availableRoutes = fs.readdirSync(settings.resolve("routesFolder"))

    for (const file of availableRoutes) {
      const fileExtension = path.extname(file)

      // tries to load only Javascript files
      if (!fileExtension.match(/\.(m|)js/)) {
        continue
      }

      const Module = (await import(settings.resolve("routesFolder", file))).default

      if (Module && Module.constructor.name === "Function") {
        const routeMiddleware = new Module()

        // Adds the imported controller to the watch list
        const filePath = settings.resolve("routesFolder", file)
        
        if (!this.watchOptions.find(_existing => _existing === filePath)){
          this.watchOptions.push(filePath)
        }

        this.app.use(routeMiddleware.router)
      }
    }
  }
}