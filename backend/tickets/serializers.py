from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Ticket

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'is_staff']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

class TicketSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()
