export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://myle247.vercel.app";

  const pages = [
    "",
    "/auth/login",
    "/auth/signup",
    "/dashboard",
    "/flashcards",
    "/quizzes",
    "/leaderboard",
    "/profile",
    "/privacy",
    "/terms",
    "/sitemap",
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      return `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${page === "" ? "weekly" : "monthly"}</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`;
    })
    .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
