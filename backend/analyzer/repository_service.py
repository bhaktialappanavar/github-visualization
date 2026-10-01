import os
import shutil
import tempfile

import requests
from git import Repo

from .git_analyzer import analyze_repository


def analyze_github_repository(repo_url):
    temp_directory = tempfile.mkdtemp()

    try:
        repo_name = repo_url.rstrip("/").split("/")[-1]

        if repo_name.endswith(".git"):
            repo_name = repo_name[:-4]

        repo_path = os.path.join(
            temp_directory,
            repo_name
        )

        repo = Repo.clone_from(
            repo_url,
            repo_path
        )

        result = analyze_repository(
            repo_path
        )

        remote_url = repo_url.rstrip("/")

        parts = remote_url.split("/")

        owner = parts[-2]
        repo_name = parts[-1]

        github_api_url = (
            f"https://api.github.com/repos/{owner}/{repo_name}"
        )

        response = requests.get(
            github_api_url,
            timeout=10
        )

        response.raise_for_status()

        github_data = response.json()

        repository = {
            "name": repo_name,
            "url": remote_url,
            "description": (
                github_data.get("description")
                or "No description"
            ),
            "language": (
                github_data.get("language")
                or "Unknown"
            ),
            "stars": github_data.get(
                "stargazers_count",
                0
            ),
            "forks": github_data.get(
                "forks_count",
                0
            )
        }

        result["repository"] = repository

        return result

    finally:
        shutil.rmtree(
            temp_directory,
            ignore_errors=True
        )