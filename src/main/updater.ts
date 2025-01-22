import ky from 'ky'
import fs from 'fs'
import { Readable } from 'stream'
import { ReadableStream } from 'stream/web'
import path from 'path'
import { app, shell } from 'electron'
import { renderer } from './index.js'

export class Updater {
  appxPath: null | string = null
  updateFound: boolean = false

  async checkForUpdates(): Promise<void> {
    const latestRelease: githubReleasesResponse = await ky.get(`https://api.github.com/repos/${import.meta.env.VITE_AUTOUPDATE_GITHUB_REPO}/releases/latest`).then((res) => res.json())
    if (parseInt(latestRelease.tag_name.replaceAll('.', '')) > parseInt(import.meta.env.APP_VERSION.replaceAll('.', ''))) {
      renderer.send('updatefound')
      this.updateFound = true

      const appxAsset = latestRelease.assets.filter((x) => x.name.match(/\.appx$/))[0]
      const dest = path.resolve(app.getPath('temp'), appxAsset.name)
      console.log(`downloading new release to ${dest}`)

      await this.download(dest, appxAsset.browser_download_url, appxAsset.size)
      this.appxPath = dest
    }
  }

  installUpdate() {
    if (!this.updateFound) throw new Error(`Update not found!`)
    if (this.appxPath == null) {
      setTimeout(() => {
        this.installUpdate()
      }, 1500)
    }
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
  assets: {
    name: string
    browser_download_url: string
    size: number
  }[]
}
