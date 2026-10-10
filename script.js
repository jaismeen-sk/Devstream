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
const dialogProgressPercent = document.getElementById("dialogProgressPercent");
const dialogProgressBar = document.getElementById("dialogProgressBar");
const dialogProgressStatus = document.getElementById("dialogProgressStatus");
const progressCourseButton = document.getElementById("progressCourseBtn");
const completeCourseButton = document.getElementById("completeCourseBtn");
const enrollCourseButton = document.getElementById("enrollCourseBtn");
const enrollmentMessage = document.getElementById("enrollmentMessage");
const progressStorageKey = "devstream-course-progress";

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
    !dialogProgressPercent ||
    !dialogProgressBar ||
    !dialogProgressStatus ||
    !progressCourseButton ||
    !completeCourseButton ||
    !enrollCourseButton ||
    !enrollmentMessage
) {
    throw new Error("One or more course dialog elements were not found.");
}

let selectedCategory = "all";
let courseProgress = {};
let progressStorageAvailable = true;

// Restore each course's saved percentage from this browser.
try {
    const savedProgress = localStorage.getItem(progressStorageKey);

    if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        const hasInvalidProgress =
            parsedProgress === null ||
            Array.isArray(parsedProgress) ||
            typeof parsedProgress !== "object" ||
            Object.values(parsedProgress).some(
                (value) => !Number.isInteger(value) || value < 0 || value > 100
            );

        if (hasInvalidProgress) {
            throw new Error("Saved course progress has an invalid format.");
        }

        courseProgress = parsedProgress;
    }
} catch {
    // Keep the page usable, but disable progress controls if saved data cannot be read.
    progressStorageAvailable = false;
}

// Use a clear label for each course state.
function getProgressStatus(percent) {
    if (percent >= 100) {
        return "Completed";
    }

    if (percent > 0) {
        return `Continue Learning · ${percent}%`;
    }

    return "Not started";
}

// Add or refresh the visible progress bar and status on a course card.
function updateCourseCardProgress(card) {
    const details = card.querySelector(".video-details");
    const courseId = card.dataset.courseId;
    const title = card.querySelector("h3");

    if (!details || !courseId || !title) {
        throw new Error("Every course needs a title, details area, and data-course-id.");
    }

    let progressDisplay = details.querySelector(".card-progress");

    if (!progressDisplay) {
        progressDisplay = document.createElement("div");
        progressDisplay.className = "card-progress";

        const status = document.createElement("p");
        status.className = "card-progress-status";

        const bar = document.createElement("progress");
        bar.className = "card-progress-bar";
        bar.max = 100;
        bar.setAttribute("aria-label", `${title.textContent.trim()} course progress`);

        progressDisplay.append(status, bar);
        details.append(progressDisplay);
    }

    const percent = courseProgress[courseId] || 0;
    const status = progressDisplay.querySelector(".card-progress-status");
    const bar = progressDisplay.querySelector(".card-progress-bar");

    if (!status || !bar) {
        throw new Error("The course progress display is missing its label or bar.");
    }

    status.textContent = getProgressStatus(percent);
    bar.value = percent;
    bar.textContent = `${percent}%`;
    bar.setAttribute("aria-valuetext", `${percent}% complete`);
}

// Update every card's progress display, including after page refresh.
function updateAllCourseProgress() {
    courseCards.forEach(updateCourseCardProgress);
}

// Fill in the modal progress display and match its buttons to the course state.
function updateDialogProgress() {
    const courseId = courseDialog.dataset.courseId;

    if (!courseId) {
        return;
    }

    const percent = courseProgress[courseId] || 0;
    dialogProgressPercent.textContent = `${percent}%`;
    dialogProgressBar.value = percent;
    dialogProgressBar.textContent = `${percent}%`;
    dialogProgressBar.setAttribute("aria-valuetext", `${percent}% complete`);
    dialogProgressStatus.textContent = progressStorageAvailable
        ? getProgressStatus(percent)
        : "Progress storage is unavailable in this browser.";
    progressCourseButton.textContent = percent >= 100
        ? "Completed"
        : percent === 0
            ? "Start learning"
            : "Continue learning";
    progressCourseButton.disabled = !progressStorageAvailable || percent >= 100;
    completeCourseButton.disabled = !progressStorageAvailable || percent >= 100;
}

// Save one course's percentage; update the cards and open dialog together.
function saveCourseProgress(courseId, percent) {
    const previousProgress = courseProgress[courseId];
    courseProgress[courseId] = Math.min(100, Math.max(0, percent));

    try {
        localStorage.setItem(progressStorageKey, JSON.stringify(courseProgress));
    } catch {
        // Restore the old value so the page never shows progress that was not saved.
        if (previousProgress === undefined) {
            delete courseProgress[courseId];
        } else {
            courseProgress[courseId] = previousProgress;
        }

        progressStorageAvailable = false;
        updateDialogProgress();
        dialogProgressStatus.textContent =
            "Progress could not be saved. Browser storage may be blocked.";
        return false;
    }

    updateAllCourseProgress();
    updateDialogProgress();
    return true;
}

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
    updateDialogProgress();

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

// Update demo progress by 25% each time Start/Continue Learning is clicked.
progressCourseButton.addEventListener("click", () => {
    const courseId = courseDialog.dataset.courseId;

    if (!courseId) {
        throw new Error("No course is selected for progress tracking.");
    }

    const currentProgress = courseProgress[courseId] || 0;
    saveCourseProgress(courseId, currentProgress + 25);
});

// Let the learner mark the current demo course as finished in one click.
completeCourseButton.addEventListener("click", () => {
    const courseId = courseDialog.dataset.courseId;

    if (!courseId) {
        throw new Error("No course is selected for progress tracking.");
    }

    saveCourseProgress(courseId, 100);
});

// Draw saved progress bars when the page first loads.
updateAllCourseProgress();

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
