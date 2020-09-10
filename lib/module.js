const fs = require("fs")
const path = require("path")

const settings = require("./moduleSettings")
const ApiMiddleware = require("./apiMiddleware/ApiMiddleware")

function _createFolder(folderPath) {
  const folderExists = fs.existsSync(folderPath)

  if (!folderExists) {
    fs.mkdirSync(folderPath)
  }
}

function _checkFolders() {
  const foldersToCheck = [
    settings.apiFolder,
    settings.routesFolder,
    settings.schemasFolder,
  ]

  for (const folder of foldersToCheck) {
    const folderPath = path.resolve(settings._rootDir, folder)

    _createFolder(folderPath)
  }
}


export default function NuxtApiLoader(moduleOptions) {
  settings.merge({
    ...(moduleOptions || {}),
    _rootDir: this.options.rootDir
  })

  // check and create the required folders
  _checkFolders()

  this.addServerMiddleware({
    path: "api/",
    handler: new ApiMiddleware(this.options.watch)
  })

  this.options.watch.push(`~/${settings.apiFolder}/`)
}

export const meta = require('../package.json')
