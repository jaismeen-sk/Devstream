// const searchInput = document.getElementById("courseSearch");
// const courseCards = document.querySelectorAll("#videoContainer .video-card");
// const noCoursesMessage = document.getElementById("noCoursesMessage");

// searchInput.addEventListener("input", () => {
//     const searchText = searchInput.value.trim().toLowerCase();
//     let visibleCourseCount = 0;

//     courseCards.forEach((card) => {
//         const courseTitle = card.querySelector("h3").textContent.toLowerCase();
//         const matchesSearch = courseTitle.includes(searchText);

//         card.style.display = matchesSearch ? "" : "none";

//         if (matchesSearch) {
//             visibleCourseCount++;
//         }
//     });

//     noCoursesMessage.hidden = visibleCourseCount > 0;
// });