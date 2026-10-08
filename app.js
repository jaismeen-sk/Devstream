// const API_KEY = "YOUR_YOUTUBE_API_KEY";
// const QUERY = "Python programming tutorial";
// const videoContainer = document.getElementById("videoContainer");

// function showMessage(message) {
//   let messageElement = document.getElementById("videoStatus");

//   if (!messageElement) {
//     messageElement = document.createElement("p");
//     messageElement.id = "videoStatus";
//     messageElement.className = "video-status";
//     videoContainer.parentElement.insertBefore(messageElement, videoContainer);
//   }

//   messageElement.textContent = message;
// }

// function createVideoCard(item) {
//   const videoId = item.id.videoId;
//   const title = item.snippet.title;
//   const thumbnailUrl =
//     item.snippet.thumbnails.medium?.url ||
//     item.snippet.thumbnails.default?.url;

//   const card = document.createElement("article");
//   card.className = "video-card";

//   const thumbnailLink = document.createElement("a");
//   thumbnailLink.className = "video-thumb";
//   thumbnailLink.href = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
//   thumbnailLink.target = "_blank";
//   thumbnailLink.rel = "noopener noreferrer";
//   thumbnailLink.setAttribute("aria-label", `Watch ${title} on YouTube`);

//   const image = document.createElement("img");
//   image.className = "poster-img";
//   image.src = thumbnailUrl;
//   image.alt = `Thumbnail for ${title}`;

//   const playOverlay = document.createElement("span");
//   playOverlay.className = "play-overlay";
//   playOverlay.textContent = "▶";
//   playOverlay.setAttribute("aria-hidden", "true");

//   thumbnailLink.append(image, playOverlay);

//   const details = document.createElement("div");
//   details.className = "video-details";

//   const label = document.createElement("span");
//   label.className = "video-duration";
//   label.textContent = "WATCH VIDEO";

//   const heading = document.createElement("h3");
//   heading.textContent = title;

//   details.append(label, heading);
//   card.append(thumbnailLink, details);

//   return card;
// }

// async function fetchVideos() {
//   if (!videoContainer) {
//     throw new Error('Could not find the element with id="videoContainer".');
//   }

//   if (API_KEY === "YOUR_YOUTUBE_API_KEY") {
//     showMessage("Add your YouTube Data API key in app.js to load YouTube videos.");
//     return;
//   }

//   showMessage("Loading videos...");

//   const params = new URLSearchParams({
//     part: "snippet",
//     type: "video",
//     maxResults: "10",
//     q: QUERY,
//     key: API_KEY
//   });

//   try {
//     const response = await fetch(
//       `https://www.googleapis.com/youtube/v3/search?${params}`
//     );
//     const data = await response.json();

//     if (!response.ok || data.error) {
//       throw new Error(
//         data.error?.message || `YouTube API request failed (${response.status}).`
//       );
//     }

//     const videos = (data.items || []).filter(
//       (item) => item.id?.videoId && item.snippet?.title
//     );

//     if (videos.length === 0) {
//       showMessage("No videos found for this search.");
//       return;
//     }

//     videoContainer.replaceChildren(...videos.map(createVideoCard));
//     document.getElementById("videoStatus")?.remove();
//   } catch (error) {
//     console.error("Could not fetch videos:", error);
//     showMessage(`Could not load videos: ${error.message}`);
//   }
// }

// fetchVideos();
