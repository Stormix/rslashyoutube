import { logError } from '.';

const Reddit = require('reddit');

class Subreddit {
  public url: string;
  client: any;
  constructor(name: string) {
    this.url = `/r/${name}`;
    this.client = new Reddit({
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD,
      appId: process.env.ID,
      appSecret: process.env.SECRET,
      userAgent: 'rslashyoutube/1.0.0 (https://stormix.co)'
    });
  }

  /**
   * getPosts
   */
  public async getPosts(filter: string = 'top', limit: number = 5) {
    try {
      let listing = await this.client.get(`${this.url}/${filter}`, {
        limit
      });
      return listing.data.children;
    } catch (e) {
      console.error(`Failed to fetch posts from ${this.url}/${filter}. %o`, e);
    }
  }
}

export default Subreddit;
