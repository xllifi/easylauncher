import axios from 'axios'
import { app } from 'electron'
import { readFileSync } from 'fs'
import Downloader from 'nodejs-file-downloader'
import { mainWindow } from '.'

const launcherDir = app.getAppPath()

export async function initDownload(): Promise<boolean> {
  // TODO: download version meta
  // TODO: download client file
  // TODO: download libs
  // TODO: download assets

  const versionMeta = await getVersionMeta('1.21')
  downloadClient(versionMeta)
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
        directory: launcherDir + './meta',
        fileName: version + '.json',
        cloneFiles: false
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
    onProgress: function (percentage): void {
      mainWindow.webContents.send('downloadprogress', { name: 'Клиент', percent: percentage })
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
