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
const saveCourseButton = document.getElementById("saveCourseButton");
const saveCourseIcon = document.getElementById("saveCourseIcon");
const saveCourseLabel = document.getElementById("saveCourseLabel");
const wishlistMessage = document.getElementById("wishlistMessage");
const enrollCourseButton = document.getElementById("enrollCourseBtn");
const enrollmentMessage = document.getElementById("enrollmentMessage");
const progressStorageKey = "devstream-course-progress";
const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.getElementById("profileName");
const profileNameInput = document.getElementById("profileNameInput");
const saveProfileButton = document.getElementById("saveProfileButton");
const profileStreak = document.getElementById("profileStreak");
const profileStreakStat = document.getElementById("profileStreakStat");
const profileSavedCount = document.getElementById("profileSavedCount");
const profileSavedToggle = document.getElementById("profileSavedToggle");
const profileSavedCourses = document.getElementById("profileSavedCourses");
const profileSavedEmpty = document.getElementById("profileSavedEmpty");
const profileSavedList = document.getElementById("profileSavedList");
const profileMessage = document.getElementById("profileMessage");
const showStreakToggle = document.getElementById("showStreakToggle");

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
    !saveCourseButton ||
    !saveCourseIcon ||
    !saveCourseLabel ||
    !wishlistMessage ||
    !enrollCourseButton ||
    !enrollmentMessage
) {
    throw new Error("One or more course dialog elements were not found.");
}

if (
    !profileAvatar ||
    !profileName ||
    !profileNameInput ||
    !saveProfileButton ||
    !profileStreak ||
    !profileStreakStat ||
    !profileSavedCount ||
    !profileSavedToggle ||
    !profileSavedCourses ||
    !profileSavedEmpty ||
    !profileSavedList ||
    !profileMessage ||
    !showStreakToggle
) {
    throw new Error("One or more profile menu elements were not found.");
}

let selectedCategory = "all";
let courseProgress = {};
let progressStorageAvailable = true;
const profileNameStorageKey = "devstream-profile-name";
const streakStorageKey = "devstream-learning-streak";
const showStreakStorageKey = "devstream-show-streak";
const wishlistStorageKey = "devstream-wishlist";
let learningStreak = { lastActiveDay: "", count: 0 };
let savedCourseIds = new Set();
let wishlistStorageAvailable = true;

// Get today's date in the visitor's local timezone as YYYY-MM-DD.
function getLocalDayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Turn a saved day into a number so consecutive calendar days can be compared.
function getDayNumber(dayKey) {
    const [year, month, day] = dayKey.split("-").map(Number);
    return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

// Show the learner's name and use its first letters for the profile avatar.
function updateProfileName(name) {
    const cleanName = name.trim() || "DevStream Learner";
    profileName.textContent = cleanName;
    profileAvatar.textContent = cleanName
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");
    profileNameInput.value = cleanName === "DevStream Learner" ? "" : cleanName;
}

// Read the display name saved by the user, or show the default name.
try {
    const savedName = localStorage.getItem(profileNameStorageKey);
    updateProfileName(savedName || "DevStream Learner");
} catch {
    updateProfileName("DevStream Learner");
    profileMessage.textContent = "Browser storage is unavailable; profile settings cannot be saved.";
}

// Read saved learning streak data and reject malformed values.
try {
    const savedStreak = localStorage.getItem(streakStorageKey);

    if (savedStreak) {
        const parsedStreak = JSON.parse(savedStreak);

        if (
            !parsedStreak ||
            typeof parsedStreak.lastActiveDay !== "string" ||
            !Number.isInteger(parsedStreak.count) ||
            parsedStreak.count < 1
        ) {
            throw new Error("Saved learning streak has an invalid format.");
        }

        learningStreak = parsedStreak;
    }
} catch {
    profileMessage.textContent = "Saved learning streak could not be read.";
}

// Read saved course IDs from the same localStorage key the profile uses.
try {
    const savedWishlist = localStorage.getItem(wishlistStorageKey);

    if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);

        if (!Array.isArray(parsedWishlist) ||
            !parsedWishlist.every((courseId) => typeof courseId === "string")) {
            throw new Error("Saved wishlist has an invalid format.");
        }

        savedCourseIds = new Set(parsedWishlist);
    }
} catch {
    wishlistStorageAvailable = false;
    profileSavedCount.textContent = "—";
    wishlistMessage.textContent = "Saved courses could not be read from browser storage.";
}

// Keep the profile list in sync so removing a saved course immediately hides it.
function updateSavedCourses() {
    profileSavedCount.textContent = wishlistStorageAvailable
        ? String(savedCourseIds.size)
        : "—";
    profileSavedList.replaceChildren();

    courseCards.forEach((card) => {
        const courseId = card.dataset.courseId;

        if (!courseId || !savedCourseIds.has(courseId)) {
            return;
        }

        const title = card.querySelector("h3");

        if (!title) {
            throw new Error("Every saved course needs a title.");
        }

        const item = document.createElement("li");
        item.className = "profile-saved-item";

        const openButton = document.createElement("button");
        openButton.className = "profile-saved-course";
        openButton.type = "button";
        openButton.textContent = title.textContent.trim();
        openButton.addEventListener("click", () => openCourseDialog(card));

        const removeButton = document.createElement("button");
        removeButton.className = "profile-remove-course";
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.setAttribute(
            "aria-label",
            `Remove ${title.textContent.trim()} from saved courses`
        );
        removeButton.disabled = !wishlistStorageAvailable;
        removeButton.addEventListener("click", () => {
            if (toggleSavedCourse(courseId)) {
                profileMessage.textContent =
                    `${title.textContent.trim()} was removed from saved courses.`;
            }
        });

        item.append(openButton, removeButton);
        profileSavedList.append(item);
    });

    profileSavedEmpty.hidden = profileSavedList.childElementCount > 0;
    profileSavedEmpty.textContent = wishlistStorageAvailable
        ? "No saved courses yet."
        : "Saved courses are unavailable.";
}

updateSavedCourses();

profileSavedToggle.addEventListener("click", () => {
    const isExpanded = profileSavedToggle.getAttribute("aria-expanded") === "true";
    profileSavedToggle.setAttribute("aria-expanded", String(!isExpanded));
    profileSavedCourses.hidden = isExpanded;
});

// Restore the learner's preference for showing or hiding their streak.
try {
    showStreakToggle.checked =
        localStorage.getItem(showStreakStorageKey) !== "false";
} catch {
    profileMessage.textContent = "Streak display settings could not be read.";
}

// Hide stale streaks after a missed day; count changes only when course progress is updated.
function updateProfileStreak() {
    const today = getLocalDayKey();
    const daysSinceActivity = learningStreak.lastActiveDay
        ? getDayNumber(today) - getDayNumber(learningStreak.lastActiveDay)
        : Infinity;
    const visibleStreak =
        daysSinceActivity <= 1 ? learningStreak.count : 0;

    profileStreak.textContent =
        `${visibleStreak} ${visibleStreak === 1 ? "day" : "days"}`;
    profileStreakStat.hidden = !showStreakToggle.checked;
}

updateProfileStreak();

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

    // A learning day counts when the learner records progress on a course.
    recordLearningActivity();
    updateAllCourseProgress();
    updateDialogProgress();
    return true;
}

// Increase the streak on consecutive active days, or restart it after a gap.
function recordLearningActivity() {
    const today = getLocalDayKey();
    const previousDay = learningStreak.lastActiveDay;
    const daysSinceActivity = previousDay
        ? getDayNumber(today) - getDayNumber(previousDay)
        : Infinity;

    if (daysSinceActivity === 0) {
        return;
    }

    const nextStreak = {
        lastActiveDay: today,
        count: daysSinceActivity === 1 ? learningStreak.count + 1 : 1
    };

    try {
        localStorage.setItem(streakStorageKey, JSON.stringify(nextStreak));
        learningStreak = nextStreak;
        updateProfileStreak();
    } catch {
        profileMessage.textContent =
            "Progress was saved, but the learning streak could not be saved.";
    }
}

// Save a learner-entered display name in this browser.
saveProfileButton.addEventListener("click", () => {
    const name = profileNameInput.value.trim();

    if (!name) {
        profileMessage.textContent = "Enter a name before saving.";
        profileNameInput.focus();
        return;
    }

    try {
        localStorage.setItem(profileNameStorageKey, name);
        updateProfileName(name);
        profileMessage.textContent = "Your profile name was saved.";
    } catch {
        profileMessage.textContent =
            "Your name could not be saved. Browser storage may be blocked.";
    }
});

// Remember whether the learner wants the streak displayed in the profile menu.
showStreakToggle.addEventListener("change", () => {
    try {
        localStorage.setItem(showStreakStorageKey, String(showStreakToggle.checked));
        updateProfileStreak();
        profileMessage.textContent = "Streak display setting was saved.";
    } catch {
        profileMessage.textContent =
            "This setting could not be saved. Browser storage may be blocked.";
    }
});

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

// Change the bookmark icon and button label to match the selected course's saved state.
function updateSaveCourseButton() {
    const courseId = courseDialog.dataset.courseId;

    if (!courseId) {
        return;
    }

    const isSaved = savedCourseIds.has(courseId);
    saveCourseButton.setAttribute("aria-pressed", String(isSaved));
    saveCourseButton.setAttribute(
        "aria-label",
        `${isSaved ? "Remove" : "Save"} this course ${isSaved ? "from" : "to"} your wishlist`
    );
    saveCourseIcon.classList.toggle("fa-solid", isSaved);
    saveCourseIcon.classList.toggle("fa-regular", !isSaved);
    saveCourseLabel.textContent = isSaved ? "Saved" : "Save course";
    saveCourseButton.disabled = !wishlistStorageAvailable;
}

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
    wishlistMessage.textContent = "";
    updateSaveCourseButton();
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

// Persist a saved-state change before updating either the profile or course dialog.
function toggleSavedCourse(courseId) {
    const nextSavedCourseIds = new Set(savedCourseIds);

    if (nextSavedCourseIds.has(courseId)) {
        nextSavedCourseIds.delete(courseId);
    } else {
        nextSavedCourseIds.add(courseId);
    }

    try {
        localStorage.setItem(
            wishlistStorageKey,
            JSON.stringify(Array.from(nextSavedCourseIds))
        );
    } catch {
        wishlistStorageAvailable = false;
        saveCourseButton.disabled = true;
        wishlistMessage.textContent =
            "Could not save this course. Browser storage may be blocked.";
        updateSavedCourses();
        return false;
    }

    savedCourseIds = nextSavedCourseIds;
    updateSaveCourseButton();
    updateSavedCourses();
    return true;
}

// Add or remove this course from the browser's saved wishlist.
saveCourseButton.addEventListener("click", () => {
    const courseId = courseDialog.dataset.courseId;

    if (!courseId) {
        throw new Error("No course is selected to save.");
    }

    if (!toggleSavedCourse(courseId)) {
        return;
    }

    wishlistMessage.textContent = savedCourseIds.has(courseId)
        ? "Course saved to your wishlist."
        : "Course removed from your wishlist.";
});

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
