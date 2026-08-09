"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString(36);
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  const slug = generateSlug(title);

  const { error } = await supabase.from("blog_posts").insert({
    author_id: user.id,
    title,
    slug,
    content,
    published,
  });

  if (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }

  revalidatePath("/blog");
  redirect("/blog");
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      content,
      published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("author_id", user.id); // Ensure user owns the post

  if (error) {
    console.error("Error updating post:", error);
    throw new Error("Failed to update post");
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${id}`); // Assuming id or slug is used
  redirect("/blog");
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id)
    .eq("author_id", user.id);

  if (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }

  revalidatePath("/blog");
  redirect("/blog");
}
