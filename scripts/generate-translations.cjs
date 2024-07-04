const fs = require('fs')
const path = require('path')

// Define command line options.
const options = ['--clean-up']

// Check if source files are specified via command line.
const files = []

for (let i = 2; i < process.argv.length; i++) {
  if (!options.includes(process.argv[i]) && fs.existsSync(process.argv[i])) {
    files.push(process.argv[i])
  }
}

// Prepare options.
const force = process.argv.includes('--force') && !files.length
const cleanUp = process.argv.includes('--clean-up') && !files.length

// Update source and translation files.
if (files.length) {
  update(files)
} else {
  walk(path.resolve(`${__dirname}/../app`), function (err, files) {
    if (err) {
      throw err
    }

    update(files)
  })
}

/**
 * Function to recursively read all files from a directory.
 *
 * @param dir  Path to the directory to recursively read all nested files.
 * @param done Callback function.
 */
function walk(dir, done) {
  const results = []

  fs.readdir(dir, function (err, list) {
    if (err) {
      return done(err)
    }

    let pending = list.length

    if (!pending) {
      return done(null, results)
    }

    list.forEach(function (file) {
      file = path.resolve(dir, file)

      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results.splice(0, 0, ...res)

            if (!--pending) {
              done(null, results)
            }
          })
        } else {
          results.push(file)

          if (!--pending) {
            done(null, results)
          }
        }
      })
    })
  })
}

/**
 * Function to update source and translation files.
 *
 * @param files An array of source codes to process.
 */
function update(files) {
  console.log('Detect translatable text strings from source files...')

  // Loop thru files and get all text strings wrapped inside the translate function.
  const textStrings = {}

  for (const file of files) {
    const fileContent = fs.readFileSync(file).toString()
    const matches = fileContent.match(/\Wt\([\r\n]?\s*['"][^'"]+['"]\s*[\r\n]?\)/g)

    if (matches) {
      matches.forEach(match => {
        const test = match.match(/t\([\r\n]?\s*['"]([^'"]+)['"]\s*[\r\n]?\)/)

        if (test) {
          textStrings[test[1]] = textStrings[test[1]] || {}
          textStrings[test[1]][file] = fileContent
        }
      })
    }
  }

  // Create translation object from text strings.
  const translationObject = {}

  for (const text in textStrings) {
    translationObject[text.toLowerCase().replace(/\W+/g, '-')] = text
  }

  // Get all text keys used for translation.
  const allTextKeys = Object.keys(translationObject)

  // Replace text strings with text keys in source files.
  const updatedFiles = {}

  for (const textKey in translationObject) {
    if (textKey !== translationObject[textKey]) {
      if (textStrings[translationObject[textKey]]) {
        for (const file in textStrings[translationObject[textKey]]) {
          const fileContent = updatedFiles[file] || textStrings[translationObject[textKey]][file]

          const regExpPattern = new RegExp(
            `(t\\([\r\n]?\\s*['"])${translationObject[textKey]}(['"]\\s*[\r\n]?\\))`,
            'g'
          )

          updatedFiles[file] = fileContent.replace(regExpPattern, `$1${textKey}$2`)
        }
      }
    }
  }

  // Update source files.
  for (const file in updatedFiles) {
    fs.writeFileSync(file, updatedFiles[file])
    console.log(`Updated source file: ${file}`)
  }

  // Read translation files to update.
  walk(path.resolve(`${__dirname}/../public/locales`), function (err, files) {
    if (err) {
      throw err
    }

    for (const file of files) {
      let updated, translation

      try {
        translation = JSON.parse(fs.readFileSync(file).toString())
      } catch {
        translation = {}
      }

      // Remove obsolete text keys in translation files.
      if (cleanUp) {
        for (const textKey in translation) {
          if (!allTextKeys.includes(textKey)) {
            updated = true

            delete translation[textKey]
          }
        }
      }

      // Add new text keys to the translation files.
      for (const textKey of allTextKeys) {
        if (
          force ||
          !translation[textKey] ||
          (textKey === translation[textKey] && textKey !== translationObject[textKey])
        ) {
          updated = updated || true
          translation[textKey] = translationObject[textKey]
        }
      }

      // Update translation files.
      if (updated) {
        fs.writeFileSync(file, JSON.stringify(translation, null, 2))
        console.log(`Updated translation file: ${file}`)
      }
    }

    console.log('Generating translations completed!')
  })
}
