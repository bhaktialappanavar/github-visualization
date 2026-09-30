// ========================================
// GitHub Visualization - Main
// ========================================


// ========================================
// DOM Elements
// ========================================

const analyzeButton =
    document.getElementById(
        "analyze-btn"
    );


const repoInput =
    document.getElementById(
        "repo-url"
    );


const statusMessage =
    document.getElementById(
        "status-message"
    );


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


    // Validate URL

    if (!repoUrl) {

        setStatus(
            "Please enter a GitHub repository URL."
        );

        return;
    }


    setStatus(
        "Analyzing repository..."
    );


    setLoading(true);


    try {

        const data =
            await analyzeRepository(
                repoUrl
            );


        console.log(
            "Repository data:",
            data
        );


        // Update statistics

        updateStatistics(
            data.summary
        );


        // Create charts

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


        setStatus(
            "Repository analyzed successfully!"
        );


    } catch (error) {

        console.error(error);


        setStatus(
            "Error: " + error.message
        );


    } finally {

        setLoading(false);
    }
}