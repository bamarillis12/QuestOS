QUESTOS PWA

FILES
- index.html: QuestOS dashboard
- coursequest.html: CourseQuest organizer
- studyquest.html: StudyQuest learning studio
- neuroquest.html: NeuroQuest research binder
- manifest.webmanifest + service-worker.js: installable app support

LOCAL PREVIEW
A service worker does not install reliably from a file:// address. For full PWA behavior, host this folder.
You can still open index.html locally to inspect the interface.

GITHUB + HOSTING
1. Sign in to GitHub with the connected account: bamarillis12.
2. Create a new repository named questos.
3. Upload every file from this folder, preserving the file names.
4. Turn on GitHub Pages in Settings > Pages, or import the repository into Vercel/Netlify.
5. Open the published URL in Chrome or Edge.
6. Choose Install QuestOS from the browser address bar or browser menu.

IMPORTANT
The Tutor panel is currently a local structured-coaching prototype. A true AI tutor needs a secure server-side API route and an API key stored as a hosting environment variable, never in browser JavaScript.
