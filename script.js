// Find the HTML elements that the search, filters, buttons, and course dialog use.
const searchInput = document.querySelector(".nav-search .search-input");
const courseCards = document.querySelectorAll("#videoContainer .video-card");
const noCoursesMessage = document.getElementById("noCoursesMessage");
const filterButtons = document.querySelectorAll(".category-filter");
const moreInfoButton = document.getElementById("moreInfoBtn");
const reasonsSection = document.getElementById("reasons-title");
const playButton = document.querySelector(".btn-play");
const courseSection = document.getElementById("videoContainer");
const courseDialog = document.getElementById("courseDialog");
const closeCourseDialogButton = document.getElementById("closeCourseDialog");
const dialogCourseTitle = document.getElementById("dialogCourseTitle");
const dialogCourseDescription = document.getElementById("dialogCourseDescription");
const dialogCourseDuration = document.getElementById("dialogCourseDuration");
const dialogCourseLevel = document.getElementById("dialogCourseLevel");
const dialogCourseInstructor = document.getElementById("dialogCourseInstructor");
const dialogCourseTags = document.getElementById("dialogCourseTags");
const enrollCourseButton = document.getElementById("enrollCourseBtn");
const enrollmentMessage = document.getElementById("enrollmentMessage");

// Fail early with a useful message if required HTML elements were renamed or removed.
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

if (
    !courseDialog ||
    !closeCourseDialogButton ||
    !dialogCourseTitle ||
    !dialogCourseDescription ||
    !dialogCourseDuration ||
    !dialogCourseLevel ||
    !dialogCourseInstructor ||
    !dialogCourseTags ||
    !enrollCourseButton ||
    !enrollmentMessage
) {
    throw new Error("One or more course dialog elements were not found.");
}

let selectedCategory = "all";

// Show cards that match both the current search text and selected category.
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

// Remember which category was clicked, update its visual/accessibility state, then filter.
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

// These hero buttons scroll to the course list and the reasons section.
moreInfoButton.addEventListener("click", () => {
    scrollToSection(reasonsSection);
});

playButton.addEventListener("click", () => {
    scrollToSection(courseSection);
});

// Copy one card's data into the shared dialog, then open it.
function openCourseDialog(card) {
    const title = card.querySelector("h3");
    const duration = card.querySelector(".video-duration");
    const courseId = card.dataset.courseId;
    const tags = card.dataset.tags;

    if (!title || !duration || !courseId || !card.dataset.description ||
        !card.dataset.level || !card.dataset.instructor || !tags) {
        throw new Error("A course card is missing one or more detail attributes.");
    }

    dialogCourseTitle.textContent = title.textContent.trim();
    dialogCourseDescription.textContent = card.dataset.description;
    dialogCourseDuration.textContent = duration.textContent.trim();
    dialogCourseLevel.textContent = card.dataset.level;
    dialogCourseInstructor.textContent = card.dataset.instructor;
    dialogCourseTags.replaceChildren();

    // Split the comma-separated data-tags value into separate visible tag chips.
    tags.split(",").forEach((tag) => {
        const tagItem = document.createElement("li");
        tagItem.textContent = tag.trim();
        dialogCourseTags.append(tagItem);
    });

    courseDialog.dataset.courseId = courseId;
    enrollmentMessage.textContent = "";

    // localStorage remembers demo enrollments after the page is refreshed.
    try {
        const isEnrolled = localStorage.getItem(`devstream-enrolled:${courseId}`) === "true";
        enrollCourseButton.textContent = isEnrolled ? "Enrolled" : "Enroll";
        enrollCourseButton.disabled = isEnrolled;
    } catch {
        enrollmentMessage.textContent =
            "Course details are available, but browser storage could not be accessed.";
        enrollCourseButton.textContent = "Enroll";
        enrollCourseButton.disabled = false;
    }

    courseDialog.showModal();
}

// Make each course card open the dialog with mouse, Enter, or Space.
courseCards.forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-haspopup", "dialog");

    card.addEventListener("click", () => {
        openCourseDialog(card);
    });

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openCourseDialog(card);
        }
    });
});

// Support the close button and clicking the dark backdrop around the dialog.
closeCourseDialogButton.addEventListener("click", () => {
    courseDialog.close();
});

courseDialog.addEventListener("click", (event) => {
    if (event.target === courseDialog) {
        courseDialog.close();
    }
});

// Save the selected course as enrolled in this browser (no server/account required).
enrollCourseButton.addEventListener("click", () => {
    const courseId = courseDialog.dataset.courseId;

    if (!courseId) {
        throw new Error("No course is selected for enrollment.");
    }

    try {
        localStorage.setItem(`devstream-enrolled:${courseId}`, "true");
        enrollCourseButton.textContent = "Enrolled";
        enrollCourseButton.disabled = true;
        enrollmentMessage.textContent = "You are enrolled in this demo course.";
    } catch {
        enrollmentMessage.textContent =
            "Enrollment could not be saved. Please allow browser storage and try again.";
    }
});
