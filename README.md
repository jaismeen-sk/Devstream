# DevStream

DevStream is a responsive front-end learning dashboard built with **HTML, CSS, and vanilla JavaScript**. It is a portfolio project for practicing semantic markup, responsive layouts, accessible interactions, and browser storage without a framework or backend.

## Run it

Run the project through a local web server because browsers block fetching `courses.json` from a `file://` page, and YouTube may reject embedded playback without an HTTP site origin:

1. Open the project folder in VS Code.
2. Start **Live Server** from `index.html` (install the Live Server extension if needed).
3. Open the local URL it gives you, usually `http://127.0.0.1:5500`.

No build step or package installation is required. Course thumbnails, YouTube videos, and the optional icon font load from external services, so those assets need an internet connection. If YouTube does not allow a video to play embedded, use the **Open on YouTube** fallback in the player.

## Features

- Search courses by title, clear the query with the visible clear button, and filter by category in Browse and My List.
- Load course details from `courses.json` and open them in a native HTML dialog.
- Play the selected course's YouTube lesson inside the dialog; closing the dialog stops playback.
- Save courses, update a learner display name, and track demo progress.
- Keep profile preferences and course state in `localStorage`.
- Use the course cards, filters, profile menu, and dialog with a keyboard.
- Adapt the navigation, course cards, and footer to smaller screens.

## How the code is organized

- `index.html` contains the page sections and dialog markup.
- `courses.json` provides course metadata and regular YouTube watch URLs in each course's `videoUrl` field.
- `style.css` controls the theme, responsive layouts, cards, and interactive states.
- `script.js` fetches and validates course data, renders cards, connects the controls, opens the dialog, and saves demo state.

Search and category selection are combined to decide which cards are visible. Selecting a course reads its details from the card's `data-*` attributes. The Watch lesson button converts the course's YouTube watch URL into an embedded player URL; closing or stopping the lesson removes the player. Add a course by copying a regular YouTube link into its `videoUrl` field in `courses.json`. Profile and course actions save values in the browser's `localStorage`, so the data stays on this device and is not connected to an account or server.

## Demo limitations

This is a UI prototype, not a real learning service. Course metadata is a small curated sample. YouTube videos are provided by their respective creators and may be unavailable, restricted, or changed by those creators. Enrollment, saved courses, profile settings, and progress are local-only interactions; no authentication or backend is provided. Progress does not track YouTube playback.
