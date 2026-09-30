const analyzeButton =
    document.getElementById("analyze-btn");

const repoInput =
    document.getElementById("repo-url");

const statusMessage =
    document.getElementById("status-message");


if (analyzeButton) {

    analyzeButton.addEventListener(
        "click",
        analyzeRepositoryData
    );

}


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


        console.log(
            "Repository data:",
            data
        );


        updateStatistics(
            data.summary
        );


        updateRepositoryInfo(
            data.repository
        );


        // Clear the URL input
        repoInput.value = "";


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


        // Show success message
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