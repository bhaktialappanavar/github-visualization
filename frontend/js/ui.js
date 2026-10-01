// ========================================
// GitHub Visualization - UI
// ========================================


// ========================================
// Update Statistics
// ========================================

function updateStatistics(summary) {

    document.getElementById(
        "total-commits"
    ).textContent =
        summary.total_commits;


    document.getElementById(
        "total-contributors"
    ).textContent =
        summary.total_contributors;


    document.getElementById(
        "total-additions"
    ).textContent =
        summary.total_additions.toLocaleString();


    document.getElementById(
        "total-deletions"
    ).textContent =
        summary.total_deletions.toLocaleString();

}


// ========================================
// Set Loading State
// ========================================

function setLoading(isLoading) {

    const analyzeButton =
        document.getElementById("analyze-btn");

    const buttonText =
        document.getElementById("button-text");

    const loading =
        document.getElementById("loading");


    if (analyzeButton) {

        analyzeButton.disabled =
            isLoading;

    }


    if (buttonText) {

        buttonText.textContent =
            isLoading
                ? "Analyzing..."
                : "Analyze";

    }


    if (loading) {

        loading.classList.toggle(
            "hidden",
            !isLoading
        );

    }

}


// ========================================
// Set Status Message
// ========================================

function setStatus(message) {

    const statusMessage =
        document.getElementById(
            "status-message"
        );


    if (statusMessage) {

        statusMessage.textContent =
            message;

    }

}


// ========================================
// Update Repository Information
// ========================================

function updateRepositoryInfo(repository) {

    const repositoryInfo =
        document.getElementById(
            "repository-info"
        );


    const repositoryName =
        document.getElementById(
            "repository-name"
        );


    const repositoryUrl =
        document.getElementById(
            "repository-url"
        );


    const repositoryDescription =
        document.getElementById(
            "repository-description"
        );


    const repositoryLanguage =
        document.getElementById(
            "repository-language"
        );


    const repositoryStars =
        document.getElementById(
            "repository-stars"
        );


    const repositoryForks =
        document.getElementById(
            "repository-forks"
        );


    if (
        !repositoryInfo ||
        !repositoryName ||
        !repositoryUrl
    ) {
        return;
    }


    // Repository name

    repositoryName.textContent =
        repository.name;


    // Repository URL

    repositoryUrl.textContent =
        repository.url;

    repositoryUrl.href =
        repository.url;


    // Repository description

    if (repositoryDescription) {

        repositoryDescription.textContent =
            repository.description ||
            "No description";

    }


    // Programming language

    if (repositoryLanguage) {

        repositoryLanguage.textContent =
            repository.language ||
            "Unknown";

    }


    // Stars

    if (repositoryStars) {

        repositoryStars.textContent =
            Number(
                repository.stars || 0
            ).toLocaleString();

    }


    // Forks

    if (repositoryForks) {

        repositoryForks.textContent =
            Number(
                repository.forks || 0
            ).toLocaleString();

    }


    // Show repository information

    repositoryInfo.classList.remove(
        "hidden"
    );

}

// ========================================
// Update Contributor Filter
// ========================================

function updateContributorFilter(contributors) {

    const contributorFilter =
        document.getElementById(
            "contributor-filter"
        );


    if (!contributorFilter) {
        return;
    }


    // Clear existing contributors

    contributorFilter.innerHTML = "";


    // Add default option

    const allOption =
        document.createElement("option");

    allOption.value = "all";

    allOption.textContent =
        "All Contributors";

    contributorFilter.appendChild(
        allOption
    );


    // Add contributors

    Object.keys(contributors).forEach(
        (contributor) => {

            const option =
                document.createElement("option");

            option.value =
                contributor;

            option.textContent =
                contributor;

            contributorFilter.appendChild(
                option
            );

        }
    );

}