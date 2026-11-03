Read info.md to understand the current codebase. Add an OpenGraph image to the cs-drill Next.js app so it shows a clean preview card when shared on WhatsApp, Twitter, LinkedIn etc.

1. Create app/opengraph-image.tsx
Use Next.js built-in ImageResponse from next/og — no extra installs needed. The image should:

Size: 1200×630px
Match the app’s existing dark design: background 
#09090b, no borders, no drop shadows
Top: app name cs/drill in large monospace font, color 
#58a6ff
Middle: tagline CS Fundamentals MCQ Prep in zinc-400
Bottom: topic pills in a row — OS · Networks · DBMS · OOP · DSA Theory · SQL Lab in zinc-600
Set export const runtime = 'edge'

2. Update app/layout.tsx metadata
Add a full openGraph and twitter block to the existing metadata export:

title: CS Drill
description: CS Fundamentals MCQ Prep for SDE & SWE interviews
openGraph.type: website
openGraph.images: [{ width: 1200, height: 630 }]
twitter.card: summary_large_image
For url and siteName use an env variable NEXT_PUBLIC_APP_URL — add it to .env.local as a placeholder http://localhost:3000 so it’s ready for when the app is deployed

3. Also create app/twitter-image.tsx
Same file as opengraph-image.tsx, identical export — Next.js uses this separately for Twitter/X cards.

General rules:

Do not install any new packages — next/og is already bundled with Next.js 14
Do not touch any existing page, component, or API route
Update info.md after implementing
