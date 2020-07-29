import { logInfo, log } from '../utils';
import { prompt as ask } from 'inquirer';
import Subreddit from '../utils/Subreddit';
import * as yargs from 'yargs'; // eslint-disable-line no-unused-vars
import Downloader from '../utils/Downloader';

async function getSubreddit(): Promise<string> {
  const { subreddit } = await ask([
    {
      type: 'input',
      name: 'subreddit',
      message: 'Subreddit r/'
    }
  ]);
  return subreddit;
}

export type Params = { subreddit?: string };
export type Listing = { data: { permalink?: string } };
export const command = 'fetch';
export const desc = `Fetches posts from a given subreddit.`;
export const builder: { [key: string]: yargs.Options } = {
  subreddit: {
    type: 'string',
    required: false,
    description: 'the subreddit name.'
  }
};
export async function handler({ subreddit }: Params) {
  let subReddit = new Subreddit(subreddit || (await getSubreddit()));
  logInfo(`Fetching posts from  ${subReddit.url}`);
  let posts = await subReddit.getPosts();
  logInfo(`Got ${posts.length} post.`);
  await Downloader.get(
    posts.map((p: Listing) => `https://reddit.com${p.data.permalink}`),
    subreddit
  );
}
