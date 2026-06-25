import { fetchPosts, toCardPost } from "@/lib/payload";
import { BlogSearchClient } from "./SearchClient";

export default async function BlogSearchPage() {
  const posts = await fetchPosts(200);
  return <BlogSearchClient posts={posts.map(toCardPost)} />;
}
