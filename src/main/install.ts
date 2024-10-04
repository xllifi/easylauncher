/* eslint-disable @typescript-eslint/no-explicit-any */
import { getVersionList, installTask, MinecraftVersion } from '@xmcl/installer'
import { MinecraftLocation, ResolvedVersion } from '@xmcl/core'
import { gamePath, mainWindow } from '.'
import { Task } from '@xmcl/task'
import { Agent } from 'undici'

const agent = new Agent({
  connections: 1
})

export async function initInstall(targetVersion): Promise<boolean> {
  const mcDir: MinecraftLocation = gamePath
  const versionMeta = await getVersionMeta(targetVersion)
  console.log(versionMeta)

  installAndTrack(mcDir, versionMeta)

  return false
}

async function getVersionMeta(targetVersion): Promise<MinecraftVersion> {
  const list: MinecraftVersion[] = (await getVersionList()).versions
  const aVersion: MinecraftVersion = list.find((x) => x.id === targetVersion)!
  return aVersion
}

async function installAndTrack(mcDir, versionMeta): Promise<void> {
  const installAllTask: Task<ResolvedVersion> = installTask(versionMeta, mcDir, {
    agent: {
      dispatcher: agent
    }
  })
  await installAllTask.startAndWait({
    // onStart(task: Task<any>) {
    //   // a task start
    //   // task.path show the path
    //   // task.name is the name
    //   trackTask(task)
    // },
    onUpdate(task: Task<any>) {
      // a task update
      // the chunk size usually the buffer size
      // you can use this to track download speed

      // or you can update the root task by
      updateTaskProgress(task, installAllTask.progress, installAllTask.total)
    },
    onFailed(task: Task<any>, error: any) {
      // on a task fail
      setTaskToFail(task, error)
    },
    onSucceed(task: Task<any>, result: any) {
      // on task success
      setTaskToSuccess(task, result)
    }
    // on task is paused/resumed/cancelled
    // onPaused(task: Task<any>) {},
    // onResumed(task: Task<any>) {},
    // onCancelled(task: Task<any>) {}
  })
}

function updateTaskProgress(task: Task<any>, progress: number, total: number): void {
  console.log(`percent: ${(progress / total) * 100}\nprogress: ${progress}\ntotal: ${total}`)
  console.log(task)
  mainWindow.webContents.send('download-progress', {
    message: `Загрузка...`,
    small: `${progress}/${total}`,
    progress: (progress / total) * 100
  })
}
function setTaskToFail(task: Task<any>, err: any): void {
  console.log(err)
  mainWindow.webContents.send('download-fail', {
    error: err
  })
}
function setTaskToSuccess(task: Task<any>, result: any): void {
  console.log(result)
  mainWindow.webContents.send('download-success')
}
