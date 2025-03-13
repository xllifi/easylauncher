import ky from 'ky'
import fs from 'fs'
import { Readable } from 'stream'
import { ReadableStream } from 'stream/web'
import path from 'path'
import { app, ipcMain, shell } from 'electron'
import { renderer } from './index.js'
import { captureException } from '@sentry/electron'

export class Updater {
  updateFound: boolean = false
  appxAsset: null | githubReleaseAsset = null
  appxPath: null | string = null

  async checkForUpdates(): Promise<void> {
    try {
      console.log(`gettings update from https://api.github.com/repos/${import.meta.env.VITE_AUTOUPDATE_GITHUB_REPO}/releases/latest`)
      const latestRelease: githubReleasesResponse = await ky.get(`https://api.github.com/repos/${import.meta.env.VITE_AUTOUPDATE_GITHUB_REPO}/releases/latest`).then((res) => res.json())

      if (parseInt(latestRelease.tag_name.replaceAll('.', '')) > parseInt(import.meta.env.APP_VERSION.replaceAll('.', ''))) {
        this.updateFound = true
        this.appxAsset = latestRelease.assets.filter((x) => x.name.match(/\.appx$/))[0]

        ipcMain.on('getupdatestatus', () => {
          renderer.send('updatefound')
        })
      }
    } catch (e) {
      if (e instanceof TypeError && e.message == 'fetch failed') {
        ipcMain.on('getupdatestatus', () => {
          renderer.send('updatefailed')
        })
      }
      console.error(e)
      captureException(e)
    }
  }

  async installUpdate() {
    if (!this.updateFound) throw new Error(`Update not found!`, { cause: 'noupdate' })
    if (this.appxAsset == null) throw new Error(`Installer file not found in update! Please tell this to developer ASAP!`, { cause: 'nofile' })

    const dest = path.resolve(app.getPath('temp'), this.appxAsset.name)
    console.log(`downloading new release to ${dest}`)

    await this.download(dest, this.appxAsset.browser_download_url, this.appxAsset.size)
    this.appxPath = dest

    shell.openPath(this.appxPath!)

    app.quit()
  }

  async download(dest: string, url: string, size: number): Promise<void> {
    // Ensure dir exists
    if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true })

    // If file exists
    if (fs.existsSync(dest) && fs.statSync(dest).size == size) return

    // Create request
    const resp = await ky(url, { method: 'get' })

    // Write to file
    return new Promise<void>((resolve, reject) => {
      const writeStream: fs.WriteStream = fs.createWriteStream(dest + '.temp')
      const readableStream: Readable = Readable.fromWeb(resp.body! as ReadableStream)
      readableStream.pipe(writeStream)

      // Main listeners
      readableStream.on('end', async () => {
        writeStream.close()
        fs.rename(dest + '.temp', dest, (err) => {
          if (err && !fs.existsSync(dest)) reject(err)
        })
        resolve()
      })
      readableStream.on('error', (err) => reject(err))
    })
  }
}

type githubReleasesResponse = {
  tag_name: string
  assets: githubReleaseAsset[]
}
type githubReleaseAsset = {
  name: string
  browser_download_url: string
  size: number
}
