import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import { logInfo } from '.';
const exec = util.promisify(require('child_process').exec);

export default class Downloader {
  static downloadDir = 'downloads';
  static async get(urls: Array<string>) {
    return new Promise(async (resolve, reject) => {
      try {
        for (const url of urls) {
          await Downloader.download(url);
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
  static async download(url: string) {
    return new Promise(async (resolve, reject) => {
      try {
        logInfo(`- Downloading ${url}`);
        let outputDir = `downloads/%(title)s.%(ext)s`;
        const { stdout, stderr } = await exec(
          `youtube-dl -o ${outputDir} ${url}`
        );
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
        resolve(stdout);
      } catch (err) {
        reject(err);
      }
    });
  }
}
