import os
import shutil
import tempfile

import requests
from git import Repo
from git.exc import GitCommandError

from .git_analyzer import analyze_repository


def analyze_github_repository(repo_url):
    temp_directory = tempfile.mkdtemp()

    try:
        remote_url = repo_url.rstrip("/")

        repo_name = remote_url.split("/")[-1]

        if repo_name.endswith(".git"):
            repo_name = repo_name[:-4]

        parts = remote_url.split("/")

        if len(parts) < 2:
            raise ValueError(
                "Invalid GitHub repository URL."
            )

        owner = parts[-2]

        repo_path = os.path.join(
            temp_directory,
            repo_name
        )

        try:

            Repo.clone_from(
                remote_url,
                repo_path
            )

        except GitCommandError:

            raise ValueError(
                "Unable to clone the repository. "
                "Make sure the GitHub URL is correct "
                "and the repository is publicly accessible."
            )


        result = analyze_repository(
            repo_path
        )


        github_api_url = (
            f"https://api.github.com/repos/"
            f"{owner}/{repo_name}"
        )


        try:

            response = requests.get(
                github_api_url,
                timeout=10
            )

            response.raise_for_status()

            github_data = response.json()

        except requests.RequestException:

            github_data = {}


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