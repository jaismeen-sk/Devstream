# DevStream

DevStream is a responsive front-end learning dashboard built with **HTML, CSS, and vanilla JavaScript**. It is a portfolio project for practicing semantic markup, responsive layouts, accessible interactions, and browser storage without a framework or backend.

## Run it

Open `index.html` in a modern browser. No build step or package installation is required. Course images and the optional icon font load from external services, so those assets need an internet connection.

## Features

- Search courses by title and filter by category.
- Open course details in a native HTML dialog.
- Save courses, update a learner display name, and track demo progress.
- Keep profile preferences and course state in `localStorage`.
- Use the course cards, filters, profile menu, and dialog with a keyboard.
- Adapt the navigation, course cards, and footer to smaller screens.

## How the code is organized

- `index.html` contains the page sections, course data attributes, and dialog markup.
- `style.css` controls the theme, responsive layouts, cards, and interactive states.
- `script.js` connects the controls, filters the cards, opens the dialog, and saves demo state.

The JavaScript reads each course's title and `data-*` attributes from its HTML card. Search and category selection are combined to decide which cards are visible. When a course opens, those same attributes populate the dialog. Profile and course actions save values in the browser's `localStorage`, so the data stays on this device and is not connected to an account or server.

## Demo limitations

This is a UI prototype, not a real learning service. Courses and descriptions are sample content. Enrollment, saved courses, profile settings, and progress are local-only interactions; no course videos, authentication, or backend are provided.
