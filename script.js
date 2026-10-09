const searchInput = document.querySelector(".nav-search .search-input");
const courseCards = document.querySelectorAll("#videoContainer .video-card");
const noCoursesMessage = document.getElementById("noCoursesMessage");

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