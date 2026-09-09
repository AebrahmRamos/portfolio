# Blog Setup: one-time steps

The blog is fully built and merged to main. Code is ready; D1 database is provisioned.
One step required to get it live: add your Cloudflare API token to GitHub.

## 1. Get your Cloudflare API token

Go to: https://dash.cloudflare.com/profile/api-tokens
Create a token with:
- **Workers Scripts: Edit** (for the `portfolio` worker)
- **Account: Cloudflare Workers for Platforms: Read** (optional)

Or use the "Edit Cloudflare Workers" template, it has everything needed.

## 2. Add GitHub secrets (takes 2 minutes)

Go to: https://github.com/AebrahmRamos/portfolio/settings/secrets/actions

Add three secrets:
| Secret name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | The token from step 1 |
| `CLOUDFLARE_ACCOUNT_ID` | `9f542f93d3d90ff5911d32dae3a9c3a5` |
| `VITE_RECAPTCHA_SITE_KEY` | Your existing recaptcha key |

## 3. Re-trigger deployment

After adding the secrets, go to:
https://github.com/AebrahmRamos/portfolio/actions/runs/26771538573

Click "Re-run all jobs". The build will succeed and deploy to aebrahmramos.dev.

## 4. Set a real admin token (recommended before going public)

The current admin token is `dev-change-me-in-production` (stored in wrangler.jsonc).
After deploying, set a real secret:

```bash
cd ~/Documents/Repositories/portfolio
wrangler secret put ADMIN_TOKEN
# Enter your chosen token at the prompt
```

Then log in at https://aebrahmramos.dev/admin using that token.

## What's already done

- D1 database `portfolio-blog` (uuid: `da664f90-3880-4e3b-934a-dbbd4cb802b8`), schema applied
- All blog code merged to main
- GitHub Actions workflow ready to deploy
- `/llms.txt` will auto-generate from your posts
- MCP tools `get_posts`, `get_post_by_slug`, `get_series` wired up
