import re

from git import Repo


def get_commit_stats(repo, max_commits):
    """
    Get commit change statistics using one Git command.

    This is faster than calling commit.stats.total
    separately for every commit.
    """

    stats_by_hash = {}

    try:
        output = repo.git.log(
            f"-n{max_commits}",
            "--format=%H",
            "--shortstat"
        )

    except Exception:
        return stats_by_hash

    current_hash = None

    for line in output.splitlines():

        line = line.strip()

        # Commit hash
        if re.fullmatch(r"[0-9a-f]{40}", line):

            current_hash = line

            continue

        if not current_hash or not line:
            continue

        files_match = re.search(
            r"(\d+)\s+files?\s+changed",
            line
        )

        insertions_match = re.search(
            r"(\d+)\s+insertions?\(\+\)",
            line
        )

        deletions_match = re.search(
            r"(\d+)\s+deletions?\(-\)",
            line
        )

        if (
            files_match
            or insertions_match
            or deletions_match
        ):

            stats_by_hash[current_hash] = {
                "files": (
                    int(files_match.group(1))
                    if files_match
                    else 0
                ),

                "insertions": (
                    int(insertions_match.group(1))
                    if insertions_match
                    else 0
                ),

                "deletions": (
                    int(deletions_match.group(1))
                    if deletions_match
                    else 0
                )
            }

            current_hash = None

    return stats_by_hash


def analyze_repository(repo_path, max_commits=5000):

    repo = Repo(repo_path)

    commits = []
    contributors = {}
    weekday_activity = {}
    hourly_activity = {}

    total_additions = 0
    total_deletions = 0
    total_files_changed = 0

    # --------------------------------------------------
    # Get commit statistics in one Git operation
    # --------------------------------------------------

    commit_stats = get_commit_stats(
        repo,
        max_commits
    )

    # --------------------------------------------------
    # Read commit history
    # --------------------------------------------------

    commits_iterator = repo.iter_commits(
        max_count=max_commits + 1
    )

    for commit in commits_iterator:

        if len(commits) >= max_commits:
            break

        author = commit.author.name
        commit_date = commit.committed_datetime

        stats = commit_stats.get(
            commit.hexsha,
            {
                "files": 0,
                "insertions": 0,
                "deletions": 0
            }
        )

        files_changed = stats["files"]
        additions = stats["insertions"]
        deletions = stats["deletions"]

        # --------------------------------------------------
        # Store commit
        # --------------------------------------------------

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

        # --------------------------------------------------
        # Contributors
        # --------------------------------------------------

        if author not in contributors:
            contributors[author] = 0

        contributors[author] += 1

        # --------------------------------------------------
        # Weekday activity
        # --------------------------------------------------

        weekday = commit_date.strftime("%A")

        if weekday not in weekday_activity:
            weekday_activity[weekday] = 0

        weekday_activity[weekday] += 1

        # --------------------------------------------------
        # Hourly activity
        # --------------------------------------------------

        hour = commit_date.hour

        if hour not in hourly_activity:
            hourly_activity[hour] = 0

        hourly_activity[hour] += 1

        # --------------------------------------------------
        # Total changes
        # --------------------------------------------------

        total_additions += additions
        total_deletions += deletions
        total_files_changed += files_changed

    # --------------------------------------------------
    # Check whether more commits exist
    # --------------------------------------------------

    try:

        next(commits_iterator)

        limited = True

    except StopIteration:

        limited = False

    # --------------------------------------------------
    # Summary
    # --------------------------------------------------

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

        "hourly_activity": hourly_activity,

        "analysis": {
            "max_commits": max_commits,
            "commits_analyzed": len(commits),
            "limited": limited
        }
    }