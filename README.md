# teacherstudy-wordcloud

Firebase classroom word cloud for collecting short student or teacher responses in real time.

## Live Site

https://teacherstudy-5252e.web.app

## Repository

https://github.com/cjpsteacher/teacherstudy-wordcloud

## Firebase Setup

- Project ID: `teacherstudy-5252e`
- Hosting: Firebase Hosting
- Database: Cloud Firestore
- Collection: `wordcloud_words`

The Firestore rules allow public reads for the word cloud and limited public creates for short text entries. Updates and deletes are denied from the public web app.

## Files

- `public/index.html`: Page structure.
- `public/styles.css`: Layout and design.
- `public/app.js`: Firebase connection and word cloud logic.
- `firestore.rules`: Firestore database rules.
- `firebase.json`: Firebase Hosting and rules configuration.

## Deploy

```powershell
npx.cmd -y firebase-tools@latest deploy --only firestore:rules,hosting --project teacherstudy-5252e
```

## #07 Working Mode

This repo has been initialized for the classroom tools workflow. Project guidance lives in `AGENTS.md`.
