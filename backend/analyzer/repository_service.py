import os
import shutil
import tempfile

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

        repository = {
            "name": repo_name,
            "url": remote_url
        }

        result["repository"] = repository

        return result

    finally:
        shutil.rmtree(
            temp_directory,
            ignore_errors=True
        )