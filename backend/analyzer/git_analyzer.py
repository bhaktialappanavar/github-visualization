from git import Repo


def analyze_repository(repo_path):
    repo = Repo(repo_path)

    commits = []
    contributors = {}
    weekday_activity = {}
    hourly_activity = {}

    total_additions = 0
    total_deletions = 0
    total_files_changed = 0

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
        commit_date = commit.committed_datetime

        # Commit information
        commits.append({
            "hash": commit.hexsha,
            "author": author,
            "email": commit.author.email,
            "message": commit.message.strip(),
            "date": commit_date.isoformat(),
            "files_changed": files_changed,
            "additions": additions,
            "deletions": deletions
        })

        # Contributor statistics
        if author not in contributors:
            contributors[author] = 0

        contributors[author] += 1

        # Weekday activity
        weekday = commit_date.strftime("%A")

        if weekday not in weekday_activity:
            weekday_activity[weekday] = 0

        weekday_activity[weekday] += 1

        # Hourly activity
        hour = commit_date.hour

        if hour not in hourly_activity:
            hourly_activity[hour] = 0

        hourly_activity[hour] += 1

        # Repository totals
        total_additions += additions
        total_deletions += deletions
        total_files_changed += files_changed

    # Repository summary
    summary = {
        "total_commits": len(commits),
        "total_contributors": len(contributors),
        "total_additions": total_additions,
        "total_deletions": total_deletions,
        "total_files_changed": total_files_changed
    }

    return {
        "summary": summary,
        "commits": commits,
        "contributors": contributors,
        "weekday_activity": weekday_activity,
        "hourly_activity": hourly_activity
    }