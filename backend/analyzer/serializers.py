from rest_framework import serializers


class RepositorySerializer(serializers.Serializer):
    repo_path = serializers.CharField(
        required=False,
        allow_blank=True
    )

    repo_url = serializers.URLField(
        required=False,
        allow_blank=True
    )

    def validate(self, data):
        if not data.get("repo_path") and not data.get("repo_url"):
            raise serializers.ValidationError(
                "Provide either repo_path or repo_url."
            )

        return data