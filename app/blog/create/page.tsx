import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createPost } from "../actions";

export default async function CreatePostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="page-shell page-section">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-extrabold text-brand-indigo font-heading tracking-tight mb-8">
          Write a New Post
        </h1>

        <form action={createPost} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-brand-indigo mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full rounded-xl border-brand-muted/20 bg-white px-4 py-3 text-brand-indigo shadow-sm focus:border-brand-lime focus:ring-brand-lime focus:outline-none"
              placeholder="e.g. My Best Study Tips"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-brand-indigo mb-2">
              Content (Markdown supported)
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={15}
              className="w-full rounded-xl border-brand-muted/20 bg-white px-4 py-3 text-brand-indigo shadow-sm focus:border-brand-lime focus:ring-brand-lime focus:outline-none font-mono text-sm"
              placeholder="# Heading\n\nWrite your blog post here..."
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="published"
              name="published"
              className="h-5 w-5 rounded border-brand-muted/30 text-brand-lime focus:ring-brand-lime"
            />
            <label htmlFor="published" className="text-sm font-medium text-brand-indigo">
              Publish immediately (uncheck to save as draft)
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <a
              href="/blog"
              className="inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold text-brand-muted hover:text-brand-indigo transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="inline-flex items-center rounded-xl bg-brand-indigo px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-md"
            >
              Save Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
