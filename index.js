#!/usr/bin/env node
const watch = require('watch')
const { exec } = require('child_process')

watch.watchTree(

  '.',
  {
    interval: 0.1,
    ignoreDotFiles: true,
    ignoreDirectoryPattern: /^node_modules.*/
  },
  function (f, curr, prev) {
    if (typeof f == 'object' && prev === null && curr === null) {
      // nothing
    } else if (prev === null) {
      // f is a new file
      console.log(`${f} created`)
    } else if (curr.nlink === 0) {
      // f was removed
      console.log(`${f} removed`)
    } else {
      // f was changed
      const path = `./${f}`
      let commands = {
        check: `prettier --check ${path}`,
        fix: `prettier --write ${path}`
      }
      const check = exec(commands.check).stdout
      console.log(commands.check)

      check.on('data', data => {
        if (data.includes('Forgot to run Prettier?')) {
          console.log(`formatting ${f}`)
          exec(commands.fix)
        }
      })
      check.on('error', e => console.error(e))
    }
  }
)
