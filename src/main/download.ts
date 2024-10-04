import { app } from 'electron'
import { readFileSync } from 'fs'
import Downloader from 'nodejs-file-downloader'
import { mainWindow } from '.'
import ky, { HTTPError } from 'ky'

const gameDir = app.getPath('userData') + '/.minecraft'

export async function initDownload(): Promise<boolean> {
  // TODO: download version meta
  // TODO: download client file
  // TODO: download libs
  // TODO: download assets

  try {
    const versionMeta = await getVersionMeta('1.21')
    await downloadClient(versionMeta)
  } catch (e) {
    if (e instanceof HTTPError) {
      console.log('AxiosError:')
      console.log(e)
      mainWindow.webContents.send('download-fail', { error: e.message })
      return false
    }
    console.log('error:')
    console.log(e)
    mainWindow.webContents.send('download-fail', { error: e })
    return false
  }
  mainWindow.webContents.send('download-end')
  return true
}

function downloadProgress(percentage, name): void {
  mainWindow.webContents.send('download-progress', {
    name: name,
    percent: percentage
  })
}

async function getVersionMeta(version: string): Promise<JSON | boolean> {
  const globalMeta = await ky.get('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json').json()

  for (const entry of globalMeta.versions) {
    if (entry.id === version) {
      const downloader = new Downloader({
        url: entry.url,
        directory: gameDir + '/meta',
        fileName: version + '.json',
        cloneFiles: false,
        onProgress: (percentage): void => {
          downloadProgress(percentage, 'Метаданные')
        }
      })
      const { filePath } = await downloader.download()
      return JSON.parse(readFileSync(filePath!).toString())
    }
  }
  return false
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
    onProgress: (percentage): void => {
      downloadProgress(percentage, `Клиент ${versionMeta.id}`)
    }
  })
  await downloader.download()

  return true
}
