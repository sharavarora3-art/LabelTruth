LabelTruth
Nutritonal Tracking App

## Deploying outside Lovable (Netlify / Cloudflare)

The label scanner runs server-side and picks its AI provider from environment
variables at runtime, in this order:

1. `LOVABLE_API_KEY` — Lovable AI Gateway (used automatically inside Lovable)
2. `OPENAI_API_KEY` — OpenAI (`gpt-4o-mini` by default)
3. `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) — Google Gemini (`gemini-2.5-flash`)

Optional: `AI_MODEL` overrides the model for whichever provider is selected.

Set exactly one provider key on your host:

- **Netlify** — Site settings → Environment variables. `netlify.toml` already
  sets the build command, publish dir and `NITRO_PRESET=netlify`.
- **Cloudflare Workers/Pages** — add the key as a secret
  (`npx wrangler secret put OPENAI_API_KEY`) or in the dashboard. The build
  targets Cloudflare by default.

Never prefix these with `VITE_` — that would expose the key to the browser.
Redeploy after changing an environment variable.
