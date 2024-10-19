import { gamePath, mainWindow } from '.'
import { Mojang, Launch } from 'minecraft-java-core'
const launch = new Launch()

export async function startGame(): Promise<void> {
  const opt = {
    authenticator: await Mojang.login('xllifi'),
    timeout: 10000,
    path: gamePath,
    version: '1.21',
    detached: false,
    downloadFileMultiple: 1,
    url: null,
    mcp: null,

    loader: {
      path: '',
      type: 'fabric',
      build: 'latest',
      enable: true
    },

    verify: true,
    ignored: ['config', 'essential', 'logs', 'resourcepacks', 'saves', 'screenshots', 'shaderpacks', 'W-OVERFLOW', 'options.txt', 'optionsof.txt'],

    JVM_ARGS: [],
    GAME_ARGS: [],

    java: {
      path: gamePath + '/java',
      version: 21,
      type: 'jre'
    },

    screen: {
      width: 600,
      height: 400
    },

    memory: {
      min: '512M',
      max: '6G'
    }
  }

  await launch.Launch(opt)

  let lastProgress = 0

  launch.on('extract', (extract) => {
    console.log(extract)
  })

  launch.on('progress', (progress, size, element) => {
    if (lastProgress <= Date.now()) {
      console.log(`Downloading ${element} ${Math.round((progress / size) * 100)}%`)
      lastProgress = Date.now() + 250
    }
  })

  launch.on('check', (progress, size, element) => {
    console.log(`Checking ${element} ${Math.round((progress / size) * 100)}%`)
  })

  launch.on('estimated', (time) => {
    if (time == Infinity) {
      return
    }
    console.log(time)
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time - hours * 3600) / 60)
    const seconds = Math.floor(time - hours * 3600 - minutes * 60)
    console.log(`${hours == 0 ? '' : `${hours}h `}${minutes == 0 ? '' : `${minutes}m `}${seconds}s`)
  })

  launch.on('speed', (speed) => {
    if (speed == 0) {
      return
    }
    console.log(`${(speed / 1067008).toFixed(2)} Mb/s`)
  })

  launch.on('patch', (patch) => {
    console.log(patch)
  })

  launch.on('data', (e) => {
    console.log(e)
  })

  launch.on('close', (code) => {
    console.log(code)
  })

  launch.on('error', (err) => {
    console.log(err)
  })
}
