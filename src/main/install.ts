/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line prettier/prettier
import { getVersionList, installAssetsTask, installJavaRuntimeTask, installLibrariesTask, installVersionTask, MinecraftVersion } from '@xmcl/installer'
import { MinecraftLocation, ResolvedVersion, Version } from '@xmcl/core'
import { gamePath, mainWindow } from '.'
import { Task, TaskContext } from '@xmcl/task'
import { randomUUID } from 'crypto'
import { Agent } from 'undici'
import { existsSync } from 'fs'

const agent = new Agent({
  connections: 8
})

export async function initInstall(targetVersion): Promise<boolean> {
  const mcDir: MinecraftLocation = gamePath
  const versionMeta = await getVersionMeta(targetVersion)

  installAndTrack(mcDir, versionMeta)

  return false
}

async function getVersionMeta(targetVersion): Promise<MinecraftVersion> {
  try {
    const list = await getVersionList()
    const versionList: MinecraftVersion[] = list.versions
    const versionMeta: MinecraftVersion = versionList.find((x) => x.id === targetVersion)!
    return versionMeta
  } catch (error) {
    mainWindow.webContents.send('fail', { message: error })
    throw error
  }
}

async function installAndTrack(mcDir, versionMeta): Promise<void> {
  try {
    await submit(installVersionTask(versionMeta, mcDir, { side: 'client' }))
    const resolvedVersion: ResolvedVersion = await Version.parse(mcDir, versionMeta.id)
    const prevalidSizeOnly = existsSync(`${mcDir}/assets/indexes/${resolvedVersion.assets}.json`)
    console.log(`${mcDir}/assets/indexes/${resolvedVersion.assets}.json`)
    await submit(installLibrariesTask(resolvedVersion, { librariesDownloadConcurrency: 8, agent: { dispatcher: agent } }))
    await submit(installAssetsTask(resolvedVersion, { assetsDownloadConcurrency: 8, prevalidSizeOnly, agent: { dispatcher: agent } }))
    // await submit(installJavaRuntimeTask({ mani }))
  } catch (error) {
    if (error instanceof Error) {
      mainWindow.webContents.send('fail', { message: 'Несколько ошибок. Попробуйте снова.' })
    }
    mainWindow.webContents.send('fail', { message: 'Неизвестная ошибка. Попробуйте снова.' })
    throw error
  }
}

const tasks: Task<any>[] = []
const record: Record<string, Task> = {}
let nextUpdate = 0

const createTaskListener = (uid: string): TaskContext => {
  const context = {
    onStart(task: Task<any>): void {
      if (getActiveTask() === task) {
        mainWindow.webContents.send('start', { taskname: task.name })
      }
    },
    onUpdate(task: Task<any>, chunkSize: number): void {
      console.log(`task id: ${task.id} | task name: ${task.name} | task progress: ${task.progress} | task total: ${task.total} | chunkSize: ${chunkSize}`)
      if (Date.now() >= nextUpdate) {
        nextUpdate = Date.now() + 400
        return
      }
      if (task.name === 'asset') {
        mainWindow.webContents.send('update', {
          taskname: task.name,
          small: `${task.id} / ${task.parent?.children.length}`,
          percent: ((task.id / task.parent?.children.length) * 100).toFixed(2)
        })
      } else if (getActiveTask() === task && task.name !== 'assets') {
        mainWindow.webContents.send('update', {
          taskname: task.name,
          small: `${((task.progress / task.total) * 100).toFixed(2)}%`,
          percent: ((task.progress / task.total) * 100).toFixed(2)
        })
      }
    },
    async onFailed(task: Task<any>, error: any): Promise<void> {
      if (getActiveTask() === task) {
        mainWindow.webContents.send('fail', { message: error })
      }
      Reflect.set(task, 'error', error)

      console.warn(`Task ${task.path} (${Object.getPrototypeOf(task).constructor.name}) ${task.name}(${uid}) failed!`)
      if (error instanceof Array) {
        for (const e of error) {
          console.warn(e)
        }
      } else {
        console.warn(error)
      }
    },
    onSucceed(task: Task<any>): void {
      console.log('success for task ' + task.id)
      if (getActiveTask() === task) {
        mainWindow.webContents.send('success', { message: task.name })
      }
    }
  }
  return context
}

const submit = async <T>(task: Task<T>): Promise<T> => {
  const uid = randomUUID()
  const listener = createTaskListener(uid)
  record[uid] = task
  task.start(listener)
  const index = tasks.length
  tasks.push(task)
  try {
    return await task.wait()
  } finally {
    console.log('Task done and delete record!')
    delete record[uid]
    tasks.splice(index, 1)
  }
}
const getActiveTask = (): Task<any> | undefined => {
  return tasks[tasks.length - 1]
}
