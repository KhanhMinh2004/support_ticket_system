from rest_framework import serializers
from .models import Users, Tickets

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id_user', 'username', 'password', 'email', 'role']

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tickets
        fields = ['id_ticket', 'fullname', 'email', 'description', 'issue_type', 'urgently_level', 'status', 'create_at', 'user']
