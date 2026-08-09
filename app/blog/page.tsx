import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Study tips, product updates, and campus learning guides from the MYLE team.",
  path: "/blog",
});

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="page-shell page-section">
      <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-lime font-bold">
              Blog
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-indigo font-heading tracking-tight">
              Stories &amp; study tips
            </h1>
            <p className="text-sm sm:text-base text-brand-muted leading-relaxed max-w-2xl mx-auto sm:mx-0">
              Read the latest articles on exam prep, flashcard workflows, and product updates from the MYLE team.
            </p>
          </div>
          
          {user && (
            <Link
              href="/blog/create"
              className="inline-flex shrink-0 items-center rounded-xl bg-brand-indigo px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Write a Post
            </Link>
          )}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                <div className="h-full rounded-2xl border border-brand-muted/20 bg-white/50 p-6 transition-all hover:bg-white hover:shadow-sm hover:border-brand-indigo/30">
                  <h2 className="text-lg font-bold text-brand-indigo group-hover:text-brand-lime transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm text-brand-muted line-clamp-3">
                    {post.content.replace(/[#*_\[\]\(\)]/g, "") /* Simple markdown strip */}
                  </p>
                  <p className="mt-4 text-xs text-brand-muted/70 font-medium">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-brand-muted bg-white/30 rounded-2xl border border-brand-muted/10">
              No posts published yet. Check back later!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
