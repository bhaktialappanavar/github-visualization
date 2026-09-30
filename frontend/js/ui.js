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
        analyzeButton.disabled = isLoading;
    }


    if (buttonText) {
        buttonText.textContent =
            isLoading ? "Analyzing..." : "Analyze";
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

    if (
        !repositoryInfo ||
        !repositoryName ||
        !repositoryUrl
    ) {
        return;
    }

    repositoryName.textContent =
        repository.name;

    repositoryUrl.textContent =
        repository.url;

    repositoryUrl.href =
        repository.url;

    repositoryInfo.classList.remove(
        "hidden"
    );
}