export async function fetchTweets(query: string) {
  const res = await fetch(`http://localhost:5000/api/twitter?q=${query}`);
  return res.json();
}
