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

        # ========================================
        # Clean Repository URL
        # ========================================

        remote_url = repo_url.rstrip("/")

        repo_name = remote_url.split("/")[-1]

        if repo_name.endswith(".git"):
            repo_name = repo_name[:-4]


        # ========================================
        # Validate GitHub URL
        # ========================================

        parts = remote_url.split("/")

        if len(parts) < 2:

            raise ValueError(
                "Invalid GitHub repository URL."
            )

        owner = parts[-2]


        # ========================================
        # Temporary Repository Path
        # ========================================

        repo_path = os.path.join(
            temp_directory,
            repo_name
        )


        # ========================================
        # Clone Repository
        # ========================================

        try:

            Repo.clone_from(
                remote_url,
                repo_path,
                depth=5000,
                single_branch=True,
                no_checkout=True,
                progress=None
            )

        except GitCommandError as error:

            error_message = str(error).lower()


            if (
                "repository not found"
                in error_message
            ):

                raise ValueError(
                    "Repository not found. "
                    "Check the GitHub URL."
                )


            if (
                "could not resolve host"
                in error_message
                or "network" in error_message
            ):

                raise ValueError(
                    "Unable to connect to GitHub. "
                    "Check your internet connection."
                )


            raise ValueError(
                "Unable to clone the repository. "
                "The repository may be too large, "
                "private, or inaccessible."
            )


        # ========================================
        # Analyze Repository
        # ========================================

        result = analyze_repository(
            repo_path
        )


        # ========================================
        # GitHub Repository Information
        # ========================================

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


        # ========================================
        # Repository Metadata
        # ========================================

        repository = {

            "name":
                repo_name,

            "url":
                remote_url,

            "description":
                (
                    github_data.get(
                        "description"
                    )
                    or "No description"
                ),

            "language":
                (
                    github_data.get(
                        "language"
                    )
                    or "Unknown"
                ),

            "stars":
                github_data.get(
                    "stargazers_count",
                    0
                ),

            "forks":
                github_data.get(
                    "forks_count",
                    0
                )

        }


        result["repository"] = repository

        return result


    finally:

        # ========================================
        # Remove Temporary Repository
        # ========================================

        shutil.rmtree(
            temp_directory,
            ignore_errors=True
        )