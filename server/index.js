import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";
const mockTweets = [
  {
    id: "mock-1",
    text: "Cyclone warning issued near coastal Maharashtra. Residents advised to stay alert.",
    public_metrics: { like_count: 120 },
  },
  {
    id: "mock-2",
    text: "High tide and storm surge expected tonight along western coastline.",
    public_metrics: { like_count: 85 },
  },
];

dotenv.config({ path: "../.env" });

const app = express();
app.use(cors());
app.use(express.json());

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

app.get("/api/twitter", async (req, res) => {
  try {
    const query = req.query.q || "cyclone OR coastal flooding";

    const tweets = await twitterClient.v2.search(query, {
      max_results: 10,
      "tweet.fields": "created_at,public_metrics",
    });

    res.json(tweets.data?.data || mockTweets);
  } catch (error) {
    console.error("Twitter API error:", error);
    res.json(mockTweets); // hard fallback
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});
