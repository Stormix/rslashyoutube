import { logInfo, log, logError } from '../utils';
import { prompt as ask } from 'inquirer';
import * as yargs from 'yargs'; // eslint-disable-line no-unused-vars
import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';
import * as slugify from 'slugify';
import * as util from 'util';
import Uploader from '../utils/Uploader';

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

export const command = 'upload';
export const desc = `Uploads the generated video to Youtube.`;

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
  logInfo(`Upload the video from r/${sr} downloaded on ${d}`);
  let videosDir = path.join(__dirname, '../../', `downloads/${sr}/${d}`);
  const outputPath = path.join(videosDir, `${date}.mp4`);

  if (!fs.existsSync(outputPath)) {
    logError(`Can't find generated video in: ${outputPath}`);
    return;
  }

  try {
    const client = new Uploader(outputPath, sr, d);
  } catch (err) {
    logError(err);
  }
}
