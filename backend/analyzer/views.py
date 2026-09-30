from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render

from .serializers import RepositorySerializer
from .git_analyzer import analyze_repository
from .repository_service import analyze_github_repository


def dashboard(request):
    return render(request, "index.html")
    
@api_view(["POST"])
def analyze_repository_api(request):
    serializer = RepositorySerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    repo_path = serializer.validated_data.get("repo_path")
    repo_url = serializer.validated_data.get("repo_url")

    try:

        if repo_url:
            result = analyze_github_repository(repo_url)

        else:
            result = analyze_repository(repo_path)

        return Response(
            result,
            status=status.HTTP_200_OK
        )

    except Exception as error:
        return Response(
            {
                "error": "Unable to analyze repository",
                "details": str(error)
            },
            status=status.HTTP_400_BAD_REQUEST
        )