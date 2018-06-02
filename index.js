const { resolve } = require('path')
const { readdirSync, statSync, createWriteStream } = require('fs')

const paths = process.argv.slice(2)

if (!paths.length) {
  console.error('ERROR: At least one path must be defined')
}

const cssFiles = {}


const getCssFiles = path => {
  const folderContent = readdirSync(path)
  folderContent.forEach(f => {
    const filePath = `${path}/${f}`
    const stats = statSync(filePath)
    if (f.match(/.css$/)) {
      cssFiles[filePath] = stats.size / 1000
    }

    if (stats.isDirectory()) {
      getCssFiles(filePath)
    }
  })
}

const writeOutput = () => {
  const outputFilePath = resolve(process.cwd(), './output.txt')
  const writeStream = createWriteStream(outputFilePath, { flags: 'a' })
  Object.entries(cssFiles).forEach(([k, v]) => writeStream.write(`\n${k} ${v}`))
  writeStream.end()
}


const resolvedPaths = paths.map(path => resolve(process.cwd(), path))
resolvedPaths.forEach(getCssFiles)
writeOutput()