import { Launch, LaunchOpts } from 'xlicore'
import { LauncherMeta, LauncherMetaModpack, SharedParams } from './types.js'
import { gamePath, renderer } from './index.js'
import { ChildProcessWithoutNullStreams } from 'child_process'
import ky from 'ky'
import * as Sentry from '@sentry/electron/main'

export async function startGame(shared: SharedParams): Promise<ChildProcessWithoutNullStreams> {
  let lastUpdateTimestamp: number = 0
  function sendProgress(type: string, percent: number) {
    if (lastUpdateTimestamp > Date.now()) return

    renderer.send('progress', { type, percent: (percent * 100).toFixed(2) })
    lastUpdateTimestamp = Date.now() + 250
  }

  const launchermeta: LauncherMeta = await ky.get(import.meta.env.VITE_LAUNCHERMETA).then(res => res.json())
  if (!launchermeta) {
    throw new Error('Launchetmeta missing', {cause: 'lm_missing_whole'})
  }
  if (!launchermeta.mc_version || !launchermeta.fabric_version) {
    throw new Error('Launchermeta missing MC or Fabric loader version', {cause: 'lm_missing_version'})
  }

  const launchOpts: LaunchOpts = {
    auth: shared.launchCredentials,
    useAuthlib: true,
    rootDir: gamePath,
    version: launchermeta.mc_version,
    fabric: {
      version: launchermeta.fabric_version
    },
    gameOpts: {
      memory: {
        min: shared.launchOpts.memory.min,
        max: shared.launchOpts.memory.max
      },
      screen: {
        width: shared.launchOpts.screen.width,
        height: shared.launchOpts.screen.height
      },
      detached: shared.launchOpts.detached
    },
    callbacks: {
      dlOnProgress(progress, _chunk, file, _lastProgress) {
        sendProgress(file.type, progress.percent)
      },
      dlOnFinish(file, _lastProgress, percent) {
        if (!percent && percent != 0) return
        sendProgress(file.type, percent)
      },
      gameOnStart(pid) {
        console.log(`MC started`)
        renderer.send('start')
        renderer.send('addmcpid', { pid })
      },
      gameOnExit(pid, exitcode) {
        console.log(`MC closed with code ${exitcode}`)
        renderer.send('close', exitcode)
        if (exitcode) {
          Sentry.captureException(new Error(`Exit code ${exitcode}`))
        }
        renderer.send('rmmcpid', { pid })
      },
      gameOnError(err) {
        renderer.send('feed-push', {
          id: 'game-error-unknown',
          additional: { err }
        })
        console.error(`Error: ${err}`)
      },
      gameOnLogs(data) {
        renderer.send('logs', { data })
      }
    }
  }
  let modpack: undefined | LauncherMetaModpack
  if (launchermeta.modpack) {
    switch (shared.modpackType) {
      case 'ess':
        modpack = launchermeta.modpack.ess
        break
      case 'min':
        modpack = launchermeta.modpack.min
        break
      case 'ful':
        modpack = launchermeta.modpack.ful
        break
    }
  }
  if (modpack) launchOpts.mrpack = modpack

  const launch = new Launch(launchOpts)
  const process = await launch.start()
  return process
}
