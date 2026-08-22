# Deployment

## How it works

Push to `main` → GitHub Actions (`.github/workflows/deploy-pages.yml`):
`npm ci → tokens → build → budgets` → artifact upload → Pages deploy.
Live at **https://wangdiues.github.io** (user site; repo was renamed from
`Wangdi-portfolio-v8`, old URLs redirect automatically at the GitHub level).

## First-time settings already applied

- Repo renamed to `wangdiues.github.io`
- Pages source set to **GitHub Actions** (`build_type=workflow`) via API

## Analytics (optional)

Privacy-friendly Plausible is wired but **off by default**. To enable:

1. Create a plausible.io site for your domain.
2. Set repository variable/secret `PUBLIC_ANALYTICS_DOMAIN` (e.g. `wangdiues.github.io`).
3. Re-run the deploy workflow.

No cookies are set; no GDPR banner needed.

## Old URLs

`public/My_portfolio/*` and `public/Wangdi-portfolio-v7/index.html` are meta-refresh +
canonical stubs mapping V0/V1 paths to their new homes. Keep them while inbound links exist.

## Rollback

Re-deploy a previous commit:

```sh
git revert <commit> && git push
```

or re-run the workflow from an earlier commit in the Actions UI.

## Release process

1. Confirm CI green on `main`.
2. `git tag -a vX.Y.Z -m "..." && git push --tags`.
3. Spot-check: home, `/publications?status=under-review`, one detail page, `/cv` print preview, OG card.
