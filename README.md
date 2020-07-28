# /r/ to Youtube

## Usage

To compile during dev:

```
yarn watch
```

To run:

```
yarn start fetch --subreddit WatchPeopleDieInside
```

## How it works

Given a subreddit, this tool should be able to do the following:

- [x] Fetch the top/hot/new videos posted on the subreddit (reddit API + youtube-dl ?).
- [ ] Stitch all the videos together (using ffmpeg probably).
- [ ] Upload the out video to a youtube channel.
- [ ] Rince and repeat.
