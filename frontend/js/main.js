const analyzeButton =
    document.getElementById("analyze-btn");

const repoInput =
    document.getElementById("repo-url");

const statusMessage =
    document.getElementById("status-message");

let repositoryData = null;


// ========================================
// Analyze Button
// ========================================

if (analyzeButton) {

    analyzeButton.addEventListener(
        "click",
        analyzeRepositoryData
    );

}


// ========================================
// Analyze Repository
// ========================================

async function analyzeRepositoryData() {

    const repoUrl =
        repoInput.value.trim();


    if (!repoUrl) {

        setStatus(
            "Please enter a GitHub repository URL."
        );

        return;
    }


    // Clear status message while analyzing
    setStatus("");

    setLoading(true);


    try {

        const data =
            await analyzeRepository(repoUrl);

        repositoryData = data;


        console.log(
            "Repository data:",
            data
        );


        // ========================================
        // Update Repository Information
        // ========================================

        updateRepositoryInfo(
            data.repository
        );


        // ========================================
        // Update Statistics
        // ========================================

        updateStatistics(
            data.summary
        );


        // ========================================
        // Update Contributor Filter
        // ========================================

        updateContributorFilter(
            data.contributors
        );


        // ========================================
        // Update Commit History
        // ========================================

        updateCommitHistory(
            data.commits
        );


        // ========================================
        // Clear URL Input
        // ========================================

        repoInput.value = "";


        // ========================================
        // Create Charts
        // ========================================

        createCommitChart(
            data.commits
        );


        createContributorChart(
            data.contributors
        );


        createChangesChart(
            data.summary
        );


        createWeekdayChart(
            data.weekday_activity
        );


        createHourlyChart(
            data.hourly_activity
        );


        // ========================================
        // Analysis Status
        // ========================================

        if (
            data.analysis &&
            data.analysis.limited
        ) {

            setStatus(
                `Repository analyzed. Showing the latest ${data.analysis.commits_analyzed.toLocaleString()} commits.`
            );

        } else {

            setStatus(
                "Repository analyzed successfully!"
            );

        }


    } catch (error) {

        console.error(error);

        setStatus(
            "Error: " + error.message
        );


    } finally {

        setLoading(false);

    }

}


// ========================================
// Contributor Filter
// ========================================

const contributorFilter =
    document.getElementById(
        "contributor-filter"
    );

const dateFilter =
    document.getElementById(
        "date-filter"
    );


if (contributorFilter) {

    contributorFilter.addEventListener(
        "change",
        applyFilters
    );

}


if (dateFilter) {

    dateFilter.addEventListener(
        "change",
        applyFilters
    );

}


// ========================================
// Apply Filters
// ========================================

function applyFilters() {

    if (!repositoryData) {
        return;
    }


    const selectedContributor =
        contributorFilter.value;

    const selectedDays =
        dateFilter.value;


    let filteredCommits =
        repositoryData.commits;


    // ========================================
    // Contributor Filter
    // ========================================

    if (
        selectedContributor !== "all"
    ) {

        filteredCommits =
            filteredCommits.filter(
                (commit) =>
                    commit.author ===
                    selectedContributor
            );

    }


    // ========================================
    // Date Filter
    // ========================================

    if (
        selectedDays !== "all"
    ) {

        const days =
            Number(selectedDays);

        const currentDate =
            new Date();

        const startDate =
            new Date(currentDate);

        startDate.setDate(
            currentDate.getDate() - days
        );


        filteredCommits =
            filteredCommits.filter(
                (commit) => {

                    const commitDate =
                        new Date(commit.date);

                    return commitDate >=
                        startDate;

                }
            );

    }


    updateFilteredDashboard(
        filteredCommits
    );

}


// ========================================
// Update Filtered Dashboard
// ========================================

function updateFilteredDashboard(
    commits
) {

    // ========================================
    // Update Commit History
    // ========================================

    updateCommitHistory(
        commits
    );


    // ========================================
    // Update Statistics
    // ========================================

    const totalCommits =
        commits.length;


    const totalContributors =
        new Set(
            commits.map(
                (commit) => commit.author
            )
        ).size;


    let totalAdditions = 0;
    let totalDeletions = 0;


    commits.forEach(
        (commit) => {

            totalAdditions +=
                commit.additions || 0;

            totalDeletions +=
                commit.deletions || 0;

        }
    );


    updateStatistics({

        total_commits:
            totalCommits,

        total_contributors:
            totalContributors,

        total_additions:
            totalAdditions,

        total_deletions:
            totalDeletions

    });


    // ========================================
    // Update Commit Chart
    // ========================================

    createCommitChart(
        commits
    );


    // ========================================
    // Calculate Contributor Counts
    // ========================================

    const contributors = {};


    commits.forEach(
        (commit) => {

            if (
                !contributors[commit.author]
            ) {

                contributors[
                    commit.author
                ] = 0;

            }


            contributors[
                commit.author
            ]++;

        }
    );


    // ========================================
    // Update Contributor Chart
    // ========================================

    createContributorChart(
        contributors
    );


    // ========================================
    // Calculate Changes
    // ========================================

    let additions = 0;
    let deletions = 0;


    commits.forEach(
        (commit) => {

            additions +=
                commit.additions || 0;

            deletions +=
                commit.deletions || 0;

        }
    );


    // ========================================
    // Update Changes Chart
    // ========================================

    createChangesChart({

        total_additions:
            additions,

        total_deletions:
            deletions

    });


    // ========================================
    // Calculate Weekday Activity
    // ========================================

    const weekdayActivity = {};


    commits.forEach(
        (commit) => {

            const date =
                new Date(commit.date);


            const weekday =
                date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "long"
                    }
                );


            if (
                !weekdayActivity[weekday]
            ) {

                weekdayActivity[weekday] = 0;

            }


            weekdayActivity[weekday]++;

        }
    );


    // ========================================
    // Update Weekday Chart
    // ========================================

    createWeekdayChart(
        weekdayActivity
    );


    // ========================================
    // Calculate Hourly Activity
    // ========================================

    const hourlyActivity = {};


    commits.forEach(
        (commit) => {

            const hour =
                new Date(
                    commit.date
                ).getHours();


            if (
                hourlyActivity[hour] ===
                undefined
            ) {

                hourlyActivity[hour] = 0;

            }


            hourlyActivity[hour]++;

        }
    );


    // ========================================
    // Update Hourly Chart
    // ========================================

    createHourlyChart(
        hourlyActivity
    );

}