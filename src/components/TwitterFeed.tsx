import { useEffect, useState } from "react";
import { fetchTweets } from "../services/twitterApi";
import { Loader2, AlertTriangle } from "lucide-react";
import { twitterTweetToSourceItem } from "@/services/twitterAdapter";

interface Tweet {
  id: string;
  text: string;
  public_metrics?: {
    like_count: number;
  };
}

const data = await fetchTweets("cyclone OR coastal flooding");

const sourceItems = data.map(twitterTweetToSourceItem);

// now sourceItems is SourceItem[]

function TwitterFeed() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTweets = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchTweets("cyclone OR coastal flooding");
        setTweets(data);
      } catch (err) {
        setError("Unable to load Twitter data at the moment.");
      } finally {
        setLoading(false);
      }
    };

    loadTweets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading live Twitter alerts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <AlertTriangle className="w-4 h-4" />
        {error}
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No relevant tweets found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tweets.map((t) => (
        <div
          key={t.id}
          className="border rounded-lg p-3 text-sm hover:bg-muted/40 transition"
        >
          <p>{t.text}</p>
          <div className="text-xs text-muted-foreground mt-1">
            Likes: {t.public_metrics?.like_count ?? 0}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TwitterFeed;
