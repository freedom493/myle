import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title")
    .eq("slug", slug)
    .single();

  if (!post) return { title: "Post Not Found" };
  return { title: post.title };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <div className="page-shell page-section">
      <article className="mx-auto max-w-3xl bg-white/50 border border-brand-muted/20 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="mb-8 space-y-4 text-center sm:text-left border-b border-brand-muted/20 pb-8">
          <Link href="/blog" className="text-sm font-semibold text-brand-lime hover:opacity-80 transition-opacity inline-flex items-center">
            &larr; Back to Blog
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-indigo font-heading tracking-tight mt-4">
            {post.title}
          </h1>
          <div className="flex items-center justify-center sm:justify-start space-x-4 text-sm text-brand-muted mt-4">
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.published ? (
              <span className="inline-flex items-center rounded-full bg-brand-lime/10 px-2.5 py-1 text-xs font-semibold text-brand-lime border border-brand-lime/20">
                Published
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800 border border-yellow-200">
                Draft
              </span>
            )}
          </div>
        </div>

        <div className="markdown-content text-brand-muted leading-relaxed space-y-6 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-brand-indigo [&>h1]:mt-10 [&>h1]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-brand-indigo [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-brand-indigo [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>li]:mb-1 [&>a]:text-brand-lime [&>a]:hover:underline [&>blockquote]:border-l-4 [&>blockquote]:border-brand-lime [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-brand-muted/80 [&>pre]:bg-brand-indigo/5 [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>code]:bg-brand-indigo/5 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:font-mono [&>code]:text-sm">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
