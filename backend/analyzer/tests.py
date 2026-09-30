from pathlib import Path

from django.test import TestCase
from rest_framework.test import APIClient

from .git_analyzer import analyze_repository


class GitAnalyzerTest(TestCase):

    def test_analyzer_returns_summary(self):

        project_root = Path(__file__).resolve().parents[2]

        result = analyze_repository(project_root)

        self.assertIn("summary", result)

        self.assertIn(
            "total_commits",
            result["summary"]
        )

        self.assertIn(
            "total_contributors",
            result["summary"]
        )


class AnalyzeAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_missing_repository_url(self):

        response = self.client.post(
            "/api/analyze/",
            {},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            400
        )

    def test_invalid_repository_url(self):

        response = self.client.post(
            "/api/analyze/",
            {
                "repo_url": "not-a-valid-url"
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            400
        )