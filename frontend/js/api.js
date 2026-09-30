// ========================================
// GitHub Visualization - API
// ========================================

async function analyzeRepository(repoUrl) {

    const response = await fetch(
        "/api/analyze/",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                repo_url: repoUrl
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.details ||
            "Unable to analyze repository."
        );
    }

    return data;
}