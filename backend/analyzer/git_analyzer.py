from git import Repo


def analyze_repository(repo_path, max_commits=5000):

    repo = Repo(repo_path)

    commits = []
    contributors = {}
    weekday_activity = {}
    hourly_activity = {}

    total_additions = 0
    total_deletions = 0
    total_files_changed = 0

    commits_iterator = repo.iter_commits(
        max_count=max_commits + 1
    )

    for commit in commits_iterator:

        if len(commits) >= max_commits:
            break

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

        commit_date = (
            commit.committed_datetime
        )


        commits.append({

            "hash": commit.hexsha,

            "author": author,

            "email": commit.author.email,

            "message": commit.message.strip(),

            "date": commit_date.isoformat(),

            "files_changed":
                files_changed,

            "additions":
                additions,

            "deletions":
                deletions

        })


        # ========================================
        # Contributors
        # ========================================

        if author not in contributors:

            contributors[author] = 0

        contributors[author] += 1


        # ========================================
        # Weekday Activity
        # ========================================

        weekday = commit_date.strftime(
            "%A"
        )


        if weekday not in weekday_activity:

            weekday_activity[weekday] = 0

        weekday_activity[weekday] += 1


        # ========================================
        # Hourly Activity
        # ========================================

        hour = commit_date.hour


        if hour not in hourly_activity:

            hourly_activity[hour] = 0

        hourly_activity[hour] += 1


        # ========================================
        # Total Changes
        # ========================================

        total_additions += additions

        total_deletions += deletions

        total_files_changed += files_changed


    # ========================================
    # Detect Analysis Limit
    # ========================================

    limited = False

    try:

        remaining_commits = next(
            commits_iterator
        )

        limited = True

    except StopIteration:

        limited = False


    # ========================================
    # Summary
    # ========================================

    summary = {

        "total_commits":
            len(commits),

        "total_contributors":
            len(contributors),

        "total_additions":
            total_additions,

        "total_deletions":
            total_deletions,

        "total_files_changed":
            total_files_changed

    }


    # ========================================
    # Return Analysis
    # ========================================

    return {

        "summary":
            summary,

        "commits":
            commits,

        "contributors":
            contributors,

        "weekday_activity":
            weekday_activity,

        "hourly_activity":
            hourly_activity,

        "analysis": {

            "max_commits":
                max_commits,

            "commits_analyzed":
                len(commits),

            "limited":
                limited

        }

    }