import * as moment from 'moment';
import * as fs from 'fs';
import * as Youtube from 'youtube-api';
import * as readJson from 'r-json';
import * as Lien from 'lien';
import { logInfo, logError, logDetail } from '.';

export default class Uploader {
  credentials: any;
  server: any;
  oauth: any;
  video: string;
  reddit: string;
  date: string;

  constructor(video: string, reddit: string, date: string) {
    this.video = video;
    this.reddit = reddit;
    this.date = date;
    this.credentials = readJson(`${__dirname}/../../credentials.json`);
    this.server = new Lien({
      host: 'localhost',
      port: 5000
    });
    this.oauth = Youtube.authenticate({
      type: 'oauth',
      client_id: this.credentials.web.client_id,
      client_secret: this.credentials.web.client_secret,
      redirect_url: this.credentials.web.redirect_uris[0]
    });
    const authUrl = this.oauth.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube.upload']
    });
    logInfo(
      'Open the following link and login to your youtube account: ' + authUrl
    );
    this.server.addPage('/oauth2callback', (lien: any) => this.upload(lien));
  }

  upload(lien: any) {
    logDetail(
      'Trying to get the token using the following code: ' + lien.query.code
    );

    this.oauth.getToken(lien.query.code, (err: any, tokens: any) => {
      if (err) {
        lien.lien(err, 400);
        return logError(err);
      }
      logDetail('Got the tokens.');
      this.oauth.setCredentials(tokens);

      lien.end(
        'The video is being uploaded. Check out the logs in the terminal.'
      );
      logInfo(
        'The video is being uploaded. Check out the logs in the terminal.'
      );
      const req = Youtube.videos.insert(
        {
          resource: {
            snippet: {
              title: `r/${this.reddit} Top Clips compilation - ${this.date}`,
              description: `Dank memes from reddit: r/${this.reddit}`
            },
            status: {
              privacyStatus: 'private'
            }
          },
          part: 'snippet,status',
          media: {
            body: fs.createReadStream(this.video)
          }
        },
        (err: any, data: any) => {
          process.exit();
        }
      );
    });
  }
}
