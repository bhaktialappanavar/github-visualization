from git import Repo


def analyze_repository(repo_path):
    repo = Repo(repo_path)

    commits = []
    contributors = {}

    for commit in repo.iter_commits():

        files_changed = 0
        additions = 0
        deletions = 0

        try:
            stats = commit.stats.total

            files_changed = stats["files"]
            additions = stats["insertions"]
            deletions = stats["deletions"]

        except Exception:
            pass

        author = commit.author.name

        commits.append({
            "hash": commit.hexsha,
            "author": author,
            "email": commit.author.email,
            "message": commit.message.strip(),
            "date": commit.committed_datetime.isoformat(),
            "files_changed": files_changed,
            "additions": additions,
            "deletions": deletions
        })

        # Count commits by contributor
        if author not in contributors:
            contributors[author] = 0

        contributors[author] += 1

    return {
        "commits": commits,
        "contributors": contributors
    }