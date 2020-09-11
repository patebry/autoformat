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
  function(f, curr, prev) {
    if (typeof f == 'object' && prev === null && curr === null) {
      // Finished walking the tree
    } else if (prev === null) {
      // f is a new file
      // console.log("new", f)
    } else if (curr.nlink === 0) {
      // f was removed
      // console.log("removed", f)
    } else {
      // f was changed
      exec(`prettier --check ./${f}`).stdout.on('data', data => {
        if (data.includes('Forgot to run Prettier?')) {
          console.log(`formatting ${f}`)
          exec(`prettier --write ./${f}`)
        }
      })
    }
  }
)
