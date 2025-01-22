import { Launch, LaunchOpts } from 'xlicore'
import { LauncherParams } from './types.js'
import { gamePath, renderer } from './index.js'
import { ChildProcessWithoutNullStreams } from 'child_process'

export async function startGame(params: LauncherParams): Promise<ChildProcessWithoutNullStreams> {
  let modpack: null | { url: string; verify?: { hash: string; algorithm: 'sha1' | 'sha256' } } = null
  switch (params.modpackType) {
    case 'ess':
      modpack = null
      break
    case 'min':
      modpack = {
        url: 'https://files.xllifi.ru/modpacks/min.mrpack'
      }
      break
    case 'ful':
      modpack = {
        url: 'https://files.xllifi.ru/modpacks/ful.mrpack'
      }
      break
  }
  const launchOpts: LaunchOpts = {
    auth: params.launchCredentials,
    useAuthlib: true,
    rootDir: gamePath,
    version: '1.21.1',
    gameOpts: {
      memory: {
        min: params.launchOpts.memory.min,
        max: params.launchOpts.memory.max
      },
      screen: {
        width: params.launchOpts.screen.width,
        height: params.launchOpts.screen.height
      },
      detached: params.launchOpts.detached
    },
    callbacks: {
      dlOnProgress(progress, _chunk, file, _lastProgress) {
        renderer.send('progress', { type: file.type, percent: (progress.percent * 100).toFixed(2) })
      },
      gameOnStart(pid) {
        console.log(`MC started`)
        renderer.send('start')
        renderer.send('addmcpid', { pid })
      },
      gameOnExit(pid) {
        console.log(`MC closed`)
        renderer.send('close')
        renderer.send('rmmcpid', { pid })
      },
      gameOnError(err) {
        renderer.send('feed-push', {
          id: 'game-error-unknown',
          additional: [err]
        })
        console.error(`Error: ${err}`)
      },
      gameOnLogs(data) {
        renderer.send('logs', { data })
      }
    }
  }
  if (modpack) launchOpts.mrpack = modpack

  const launch = new Launch(launchOpts)
  const process = await launch.start()
  return process
}
