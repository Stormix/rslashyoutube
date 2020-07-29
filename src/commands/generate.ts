import { logInfo, log, logError } from '../utils';
import { prompt as ask } from 'inquirer';
import * as yargs from 'yargs'; // eslint-disable-line no-unused-vars
import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';
import * as slugify from 'slugify';
import * as util from 'util';

const exec = util.promisify(require('child_process').exec);

async function getSubreddit(): Promise<string> {
  const { subreddit } = await ask([
    {
      type: 'input',
      name: 'subreddit',
      message: 'The subreddit name.'
    }
  ]);
  return subreddit;
}

async function getDate(): Promise<string> {
  const { date } = await ask([
    {
      type: 'input',
      name: 'date',
      message: 'Which clips ?'
    }
  ]);
  return date;
}

export type Params = { subreddit?: string; date?: string };
export type Listing = { data: { permalink?: string } };

export const command = 'generate';
export const desc = `Generates a video from the downloaded clips.`;

export const builder: { [key: string]: yargs.Options } = {
  subreddit: {
    type: 'string',
    required: false,
    description: 'the subreddit name.'
  },
  date: {
    type: 'string',
    default: moment().format('YYYY-MM-DD'),
    description: 'the subreddit name.'
  }
};

export async function handler({ subreddit, date }: Params) {
  let d = date;
  let sr = subreddit || (await getSubreddit());
  logInfo(`Concatenates videos from ${sr} downloaded on ${d}`);
  let videosDir = path.join(__dirname, '../../', `downloads/${sr}/${d}`);
  const listPath = path.join(videosDir, 'list.txt');
  const outputPath = path.join(videosDir, `${date}.mp4`);

  if (!fs.existsSync(videosDir)) {
    logError(`Can't find the folders.`);
    return;
  }

  let videos: Array<string> = [];

  fs.readdirSync(videosDir)
    .filter(file => path.extname(file).toLowerCase() === '.mp4')
    .forEach(videoPath => {
      // Rename videos to a safer filename
      let newName = `${slugify(path.basename(videoPath, '.mp4'), {
        replacement: '_',
        remove: /[*+~.()'"!:@]/g
      })}.mp4`;
      fs.renameSync(
        path.join(videosDir, videoPath),
        path.join(videosDir, newName)
      );
      videos.push(path.join(videosDir, newName));
    });

  // Write list to txt file
  fs.writeFileSync(listPath, videos.map(f => `file '${f}'`).join('\r\n'));

  // Pass list to ffmpeg
  try {
    const cmd = `ffmpeg -f  concat -safe 0 -i "${listPath}" -c copy "${outputPath}"`;
    const { stderr, stdout } = await exec(cmd);
    logInfo(stdout);
    // if (stderr) logError(stderr);
    logInfo('Deleting the clips: ');
    videos.map(p => fs.unlinkSync(p));
    fs.unlinkSync(listPath);
  } catch (err) {
    logError(err);
  }
}
