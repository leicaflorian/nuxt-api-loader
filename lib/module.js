const fs = require("fs")
const path = require("path")

const ApiMiddleware = require("./apiMiddleware/ApiMiddleware")

const settings = require("./moduleSettings")

class NuxtApiLoaderClass {
  constructor() {
    this._checkFolders()
  }

  _createFolder(folderPath) {
    const folderExists = fs.existsSync(folderPath)

    if (!folderExists) {
      fs.mkdirSync(folderPath)
    }
  }

  _checkFolders() {
    const foldersToCheck = [
      settings.apiFolder,
      settings.routesFolder,
      settings.schemasFolder,
    ]

    for (const folder of foldersToCheck) {
      const folderPath = path.resolve(settings._rootDir, folder)

      this._createFolder(folderPath)
    }
  }
}


export const meta = require('../package.json')

export default function NuxtApiLoader(moduleOptions) {
  settings.merge({
    ...(moduleOptions|| {}),
    _rootDir: this.options.rootDir
  })

  const moduleInstance = new NuxtApiLoaderClass()

  this.addServerMiddleware({
    path: "api/",
    handler: new ApiMiddleware(settings)
  })

  this.options.watch.push(`~/${settings.apiFolder}/`)
}