import * as util from 'util';
import * as moment from 'moment';

import { logInfo, logError } from '.';
const exec = util.promisify(require('child_process').exec);

export default class Downloader {
  static downloadDir = 'downloads';
  static async get(urls: Array<string>, subreddit: string) {
    return new Promise(async (resolve, reject) => {
      try {
        for (const url of urls) {
          await Downloader.download(url, subreddit);
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
  static async download(url: string, subreddit: string) {
    return new Promise(async (resolve, reject) => {
      try {
        logInfo(`- Downloading ${url}`);
        const date = moment().format('YYYY-MM-DD');
        let outputDir = `downloads/${subreddit}/${date}/%(title)s.%(ext)s`;
        const { stderr } = await exec(`youtube-dl -o ${outputDir} ${url}`);
        if (stderr) logError(stderr);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
