from django.urls import path

from .views import analyze_repository_api


urlpatterns = [
    path("analyze/", analyze_repository_api, name="analyze-repository"),
]