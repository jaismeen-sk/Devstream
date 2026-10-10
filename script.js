const searchInput = document.querySelector(".nav-search .search-input");
const courseCards = document.querySelectorAll("#videoContainer .video-card");
const noCoursesMessage = document.getElementById("noCoursesMessage");
const filterButtons = document.querySelectorAll(".category-filter");
const moreInfoButton = document.getElementById("moreInfoBtn");
const reasonsSection = document.getElementById("reasons-title");
const playButton = document.querySelector(".btn-play");
const courseSection = document.getElementById("videoContainer");

if (!searchInput) {
    throw new Error("Course search input was not found.");
}

if (courseCards.length === 0) {
    throw new Error("No course cards were found inside #videoContainer.");
}

if (filterButtons.length === 0) {
    throw new Error("No category filter buttons were found.");
}

if (!moreInfoButton || !reasonsSection || !playButton || !courseSection) {
    throw new Error("A hero button or its scroll target was not found.");
}

let selectedCategory = "all";

function filterCourses() {
    const searchText = searchInput.value.trim().toLowerCase();
    let visibleCourseCount = 0;

    courseCards.forEach((card) => {
        const title = card.querySelector("h3");
        const category = card.dataset.category;

        if (!title || !category) {
            throw new Error("Every course card needs a heading and data-category.");
        }

        const matchesSearch = title.textContent.trim().toLowerCase().includes(searchText);
        const matchesCategory =
            selectedCategory === "all" || category === selectedCategory;
        const shouldShow = matchesSearch && matchesCategory;

        card.style.display = shouldShow ? "" : "none";

        if (shouldShow) {
            visibleCourseCount++;
        }
    });

    if (noCoursesMessage) {
        noCoursesMessage.hidden = visibleCourseCount > 0;
    }
}

searchInput.addEventListener("input", filterCourses);

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const category = button.dataset.category;

        if (!category) {
            throw new Error("Every category filter button needs data-category.");
        }

        selectedCategory = category;

        filterButtons.forEach((filterButton) => {
            const isSelected = filterButton === button;
            filterButton.classList.toggle("active", isSelected);
            filterButton.setAttribute("aria-pressed", String(isSelected));
        });

        filterCourses();
    });
});

function scrollToSection(section) {
    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const top =
        window.scrollY + section.getBoundingClientRect().top - navbarHeight - 12;

    window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth"
    });
}

moreInfoButton.addEventListener("click", () => {
    scrollToSection(reasonsSection);
});

playButton.addEventListener("click", () => {
    scrollToSection(courseSection);
});
