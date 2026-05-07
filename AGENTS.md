# teacherstudy-wordcloud AGENTS.md

## Project Profile

Project name: teacherstudy-wordcloud
Purpose: A classroom word cloud tool backed by Firebase Firestore and hosted on Firebase Hosting.
Workspace: G:\我的雲端硬碟\榮彬老師雲端硬碟\2026database
GitHub repo: https://github.com/cjpsteacher/teacherstudy-wordcloud
Main branch: main

## Firebase

Firebase project id: teacherstudy-5252e
Hosting URL: https://teacherstudy-5252e.web.app
Firestore collection: wordcloud_words

Current database rule intent:
- Public read is allowed for the word cloud display.
- Create is allowed only for documents with `text` and `createdAt`.
- `text` must be a non-empty string of 24 characters or fewer.
- Update and delete are denied from the public web app.
- All other collections are denied by default.

## Project Files

- `public/index.html`: App shell.
- `public/styles.css`: Visual design and responsive layout.
- `public/app.js`: Firebase SDK connection, Firestore sync, and D3 word cloud rendering.
- `firebase.json`: Firebase Hosting and Firestore rules configuration.
- `firestore.rules`: Firestore security rules.
- `.firebaserc`: Default Firebase project mapping.

## Obsidian Notes

Obsidian vault: Not configured.
Project note path: Not configured.

When an Obsidian vault path is provided later, create a vault-relative project note for startup/shutdown summaries and keep this file updated with the path.

## Startup Routine

- Read this `AGENTS.md`.
- Check `git status --short --branch`.
- Confirm Firebase target from `.firebaserc`.
- If changing the web app, verify locally or deploy to Firebase Hosting.
- Do not commit or push unless the user asks.

## Shutdown Routine

- Summarize changed files and deployment status.
- Run `git status --short --branch`.
- If requested, commit and push to GitHub.
- If Obsidian is configured later, update the project note before closing.

## Guardrails

- Do not commit secrets, API tokens, private keys, or `.env` files.
- Do not loosen Firestore rules to public write/update/delete without explicit approval.
- Do not overwrite unrelated user changes.
- Prefer small, classroom-friendly changes over broad refactors.
