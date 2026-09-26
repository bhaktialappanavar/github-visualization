from git_analyzer import analyze_repository


repo_path = r"C:\Users\pramo\GitHubVisualization"

result = analyze_repository(repo_path)

print("COMMITS")

for commit in result["commits"]:
    print(commit)

print("\nCONTRIBUTORS")

for contributor, count in result["contributors"].items():
    print(contributor, ":", count)