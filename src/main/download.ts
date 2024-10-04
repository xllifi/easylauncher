import axios from 'axios'
import { app } from 'electron'
import { readFileSync } from 'fs'
import Downloader from 'nodejs-file-downloader'
import { mainWindow } from '.'

const gameDir = app.getPath('userData') + '/.minecraft'
console.log(gameDir)

export async function initDownload(): Promise<boolean> {
  // TODO: download version meta
  // TODO: download client file
  // TODO: download libs
  // TODO: download assets

  const versionMeta = await getVersionMeta('1.21')
  await downloadClient(versionMeta)
  mainWindow.webContents.send('download-end')
  return false
}

async function getVersionMeta(version: string): Promise<JSON | boolean> {
  const resp = await axios.get('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json')
  const globalMeta = await resp.data

  let filePath: string
  for (const entry of globalMeta.versions) {
    if (entry.id === version) {
      const downloader = new Downloader({
        url: entry.url,
        directory: gameDir + '/meta',
        fileName: version + '.json',
        cloneFiles: false,
        onProgress: function (percentage): void {
          mainWindow.webContents.send('downloadprogress', {
            name: 'Метаданные',
            percent: percentage
          })
        }
      })
      try {
        filePath = await (await downloader.download()).filePath!
        break
      } catch (error) {
        console.error('Загрузка не удалась', error)
        return false
      }
    }
  }

  return JSON.parse(readFileSync(filePath!).toString())
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function downloadClient(versionMeta: any): Promise<boolean> {
  const clientDownload = versionMeta.downloads.client
  if (clientDownload == null) {
    return false
  }

  const downloader = new Downloader({
    url: clientDownload.url,
    directory: gameDir + '/versions/' + versionMeta.id,
    fileName: 'client.jar',
    cloneFiles: false,
    onProgress: function (percentage): void {
      mainWindow.webContents.send('downloadprogress', {
        name: 'Клиент ' + versionMeta.id,
        percent: percentage
      })
    }
  })
  try {
    await downloader.download()
  } catch (error) {
    console.error('Загрузка не удалась', error)
    return false
  }

  return true
}
