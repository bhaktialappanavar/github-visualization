from git_analyzer import analyze_repository


repo_path = r"C:\Users\pramo\GitHubVisualization"

result = analyze_repository(repo_path)


print("REPOSITORY SUMMARY")

for key, value in result["summary"].items():
    print(key, ":", value)


print("\nCOMMITS")

for commit in result["commits"]:
    print(commit)


print("\nCONTRIBUTORS")

for contributor, count in result["contributors"].items():
    print(contributor, ":", count)


print("\nWEEKDAY ACTIVITY")

for day, count in result["weekday_activity"].items():
    print(day, ":", count)


print("\nHOURLY ACTIVITY")

for hour, count in result["hourly_activity"].items():
    print(hour, ":", count)