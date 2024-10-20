import { LaunchOPTS } from 'minecraft-java-core/build/Launch'
import { gamePath, mainWindow } from '.'
import { Mojang, Launch } from 'minecraft-java-core'

const launch = new Launch()

export async function startGame(username: string): Promise<void> {
  const ipc = mainWindow.webContents
  const opt: LaunchOPTS = {
    authenticator: await Mojang.login(username),
    timeout: 10000,
    path: gamePath,
    instance: 'something somewhere',
    version: '1.21',
    detached: false,
    downloadFileMultiple: 8,
    url: null,
    mcp: null,

    loader: {
      path: 'load',
      type: 'fabric',
      build: 'latest',
      enable: true
    },

    verify: true,
    ignored: ['config', 'essential', 'logs', 'resourcepacks', 'saves', 'screenshots', 'shaderpacks', 'W-OVERFLOW', 'options.txt', 'optionsof.txt'],

    JVM_ARGS: [],
    GAME_ARGS: [],

    java: {
      path: undefined,
      version: undefined,
      type: 'jre'
    },

    screen: {
      width: 854,
      height: 480
    },

    memory: {
      min: '512M',
      max: '6G'
    }
  }

  ipc.send('start')
  await launch.Launch(opt)

  let lastProgress = 0

  launch.on('extract', (extract) => {
    console.log(`Extract: ${extract}`)
    ipc.send('extract', { extract })
  })

  launch.on('progress', (progress, size, element) => {
    if (lastProgress <= Date.now()) {
      console.log(`Progress: ${element} - ${((progress / size) * 100).toFixed(2)}%`)
      ipc.send('progress', { element, percent: ((progress / size) * 100).toFixed(2) })
      lastProgress = Date.now() + 250
    }
  })

  launch.on('check', (progress, size, element) => {
    if (lastProgress <= Date.now()) {
      console.log(`Verify: ${element} - ${((progress / size) * 100).toFixed(2)}%`)
      ipc.send('check', { element, percent: ((progress / size) * 100).toFixed(2) })
      lastProgress = Date.now() + 250
    }
  })

  launch.on('estimated', (time) => {
    if (time == Infinity) {
      return
    }
    console.log(`ETA: ${time}`)
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time - hours * 3600) / 60)
    const seconds = Math.floor(time - hours * 3600 - minutes * 60)
    console.log(`ETA: ${hours == 0 ? '' : `${hours}h `}${minutes == 0 ? '' : `${minutes}m `}${seconds}s`)
    ipc.send('eta', { eta: `${hours == 0 ? '' : `${hours}ч `}${minutes == 0 ? '' : `${minutes}м `}${seconds}с` })
  })

  launch.on('speed', (speed) => {
    if (speed == 0) {
      return
    }
    console.log(`Speed: ${(speed / 1067008).toFixed(2)} Mb/s`)
    ipc.send('speed', { speed: `${(speed / 1067008).toFixed(2)} Мб/c` })
  })

  launch.on('patch', (patch) => {
    console.log(`Patch: ${patch}`)
  })

  launch.on('data', (logs) => {
    console.log(`Data: ${logs}`)
    ipc.send('data') // TODO: сделать логи? а надо вообще???
  })

  launch.on('close', (code) => {
    console.log(`Close code: ${code}`)
    ipc.send('close')
  })

  launch.on('error', (err) => {
    console.log(`Error: ${err}`) // TODO: add error feed / status feed
  })
}
