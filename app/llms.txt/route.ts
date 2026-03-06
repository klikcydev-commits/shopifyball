/**
 * llms.txt — plain-text site summary for LLM and AI crawlers.
 * Served at /llms.txt with text/plain; UTF-8. Spec: https://llmstxt.org
 */

import { buildLlmsTxt } from "@/lib/seo/llms-txt"

export const revalidate = 3600

export async function GET() {
  const body = buildLlmsTxt()
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
