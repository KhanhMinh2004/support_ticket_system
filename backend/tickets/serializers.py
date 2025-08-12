from rest_framework import serializers
from .models import Users, Ticket

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id_user', 'username', 'password', 'email', 'role']
        extra_kwargs = {
            'role': {'required': False}
        }

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
