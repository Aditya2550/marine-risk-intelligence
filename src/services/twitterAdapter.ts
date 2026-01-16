import { SourceItem } from "./sources";

interface TwitterApiTweet {
  id: string;
  text: string;
  created_at?: string;
}

export function twitterTweetToSourceItem(tweet: TwitterApiTweet): SourceItem {
  return {
    id: tweet.id,
    source: "twitter",
    content: tweet.text,
    timestamp: tweet.created_at ? new Date(tweet.created_at) : new Date(),
    author: "Twitter User",
  };
}
