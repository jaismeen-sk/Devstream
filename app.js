const apiKey = "AIzaSyCGvfzzTGA-A9JPMGkcj40grP9WKr--Sqo";
const query = "Python programming tutorial";

const url = new URL("https://www.googleapis.com/youtube/v3/search");
url.search = new URLSearchParams({
  part: "snippet",
  type: "video",
  maxResults: "10",
  q: query,
  key: apiKey
});




async function fetchVideos() {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }


    data.items.forEach(item => {
        console.log(item.snippet.title);
        console.log(item.id.videoId);
        console.log(item.snippet.thumbnails.medium.url);
});

    const data = await response.json();
    console.log(data.items);
  } catch (error) {
    console.error("Could not fetch videos:", error);
  }
}

fetchVideos();



// const API_KEY = "AIzaSyCGvfzzTGA-A9JPMGkcj40grP9WKr--Sqo";
// const QUERY = "Python programming tutorial";

// const videoContainer = document.getElementById("videoContainer");

// if (!videoContainer) {
//   throw new Error('Could not find the element with id="videoContainer".');
// }

// function showMessage(message) {
//   const messageElement = document.createElement("p");
//   messageElement.textContent = message;
//   messageElement.style.color = "white";
//   videoContainer.replaceChildren(messageElement);
// }

// function showVideo(videoId, title) {
//   const dialog = document.createElement("dialog");
//   dialog.style.border = "0";
//   dialog.style.padding = "0";
//   dialog.style.background = "transparent";
//   dialog.style.width = "min(92vw, 960px)";

//   const playerFrame = document.createElement("iframe");
//   playerFrame.title = `Watch ${title}`;
//   playerFrame.src =
//     `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1`;
//   playerFrame.allow =
//     "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
//   playerFrame.allowFullscreen = true;
//   playerFrame.style.display = "block";
//   playerFrame.style.width = "100%";
//   playerFrame.style.aspectRatio = "16 / 9";
//   playerFrame.style.border = "0";
//   playerFrame.style.background = "#000";

//   const closeButton = document.createElement("button");
//   closeButton.type = "button";
//   closeButton.textContent = "Close";
//   closeButton.setAttribute("aria-label", "Close video");
//   closeButton.style.display = "block";
//   closeButton.style.margin = "0 0 8px auto";
//   closeButton.style.padding = "8px 12px";
//   closeButton.style.cursor = "pointer";

//   closeButton.addEventListener("click", () => dialog.close());

//   dialog.append(closeButton, playerFrame);
//   document.body.append(dialog);

//   dialog.addEventListener("click", (event) => {
//     if (event.target === dialog) {
//       dialog.close();
//     }
//   });

//   dialog.addEventListener(
//     "close",
//     () => {
//       playerFrame.src = "about:blank";
//       dialog.remove();
//     },
//     { once: true }
//   );

//   dialog.showModal();
// }

// function createVideoCard(item) {
//   const videoId = item.id.videoId;
//   const title = item.snippet.title;
//   const thumbnailUrl =
//     item.snippet.thumbnails.medium?.url ||
//     item.snippet.thumbnails.default?.url;

//   const card = document.createElement("article");
//   card.className = "video-card";

//   const posterButton = document.createElement("button");
//   posterButton.type = "button";
//   posterButton.className = "video-thumb";
//   posterButton.setAttribute("aria-label", `Play ${title}`);
//   posterButton.style.width = "100%";
//   posterButton.style.padding = "0";
//   posterButton.style.border = "0";
//   posterButton.style.cursor = "pointer";

//   const image = document.createElement("img");
//   image.className = "poster-img";
//   image.src = thumbnailUrl;
//   image.alt = `Thumbnail for ${title}`;

//   const playOverlay = document.createElement("span");
//   playOverlay.className = "play-overlay";
//   playOverlay.textContent = "▶";
//   playOverlay.setAttribute("aria-hidden", "true");

//   posterButton.append(image, playOverlay);
//   posterButton.addEventListener("click", () => showVideo(videoId, title));

//   const details = document.createElement("div");
//   details.className = "video-details";

//   const label = document.createElement("span");
//   label.className = "video-duration";
//   label.textContent = "WATCH VIDEO";

//   const heading = document.createElement("h3");
//   heading.textContent = title;

//   details.append(label, heading);
//   card.append(posterButton, details);

//   return card;
// }

// async function fetchVideos() {
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

//     videoContainer.replaceChildren(
//       ...videos.map((video) => createVideoCard(video))
//     );
//   } catch (error) {
//     console.error("Could not fetch videos:", error);
//     showMessage(`Could not load videos: ${error.message}`);
//   }
// }

// fetchVideos();
