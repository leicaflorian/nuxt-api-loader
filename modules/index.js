const fs = require("fs")
const path = require("path")

const ApiMiddleware = require("../apiMiddleware/ApiMiddleware")

const settings = require("./moduleSettings")

class NuxtApiLoaderClass {
  constructor(moduleOptions) {
    /**
     * @type {{}}
     * @property {string} apiFolder
     * @property {string} routesFolder
     * @property {string} schemasFolder
     */
    

    settings.merge(moduleOptions)

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
      const folderPath = path.resolve(folder)

      this._createFolder(folderPath)
    }
  }
}



export default function NuxtApiLoader(moduleOptions) {
  const moduleInstance = new NuxtApiLoaderClass(moduleOptions)

  this.addServerMiddleware({
    path: "api/",
    handler: new ApiMiddleware(settings)
  })

  this.options.watch.push(`~/${settings.apiFolder}/`)
}