// 
const searchInput = document.querySelector(".nav-search .search-input");
const courseCards = document.querySelectorAll("#videoContainer .video-card");
const noCoursesMessage = document.getElementById("noCoursesMessage");
// const moreInfoButton = document.getElementById("moreInfoBtn");


if (!searchInput) {
    throw new Error("Course search input was not found.");
}

searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.trim().toLowerCase();
    let visibleCourseCount = 0;

    courseCards.forEach((card) => {
        const courseTitle = card.querySelector("h3").textContent.trim().toLowerCase();
        const matchesSearch = courseTitle.includes(searchText);

        card.style.display = matchesSearch ? "" : "none";

        if (matchesSearch) {
            visibleCourseCount++;
        }
    });

    if (noCoursesMessage) {
        noCoursesMessage.hidden = visibleCourseCount > 0;
    }
});

// for the "More Info" button to scroll to the "reasons-title" section
document.getElementById("moreInfoBtn").addEventListener("click", function () {
  document.getElementById("reasons-title").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// for lecture play button to scroll to the "videoContainer" section
document.querySelector(".btn-play").addEventListener("click", function () {
  document.getElementById("videoContainer").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});