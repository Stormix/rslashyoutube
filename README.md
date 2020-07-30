# /r/ to Youtube

## Configuration

### ENV variables

### Youtube API credentials

## Usage

To compile during dev:

```
yarn watch
```

To use, run the following commands in order:

```
yarn start fetch --subreddit WatchPeopleDieInside
```

```
yarn start generate --subreddit WatchPeopleDieInside
```

```
yarn start upload --subreddit WatchPeopleDieInside
```

## How it works

Given a subreddit, this tool should be able to do the following:

- [x] Fetch the top/hot/new videos posted on the subreddit (reddit API + youtube-dl ?).
- [x] Stitch all the videos together (using ffmpeg probably).
- [x] Upload the out video to a youtube channel.
- [ ] Document it.
- [ ] Rince and repeat.
