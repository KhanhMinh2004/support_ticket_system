from django.shortcuts import render
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, filters
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer, TicketSerializer
from .models import Users, Ticket
# Create your views here.


class UserView(generics.ListAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer

class UserPost(generics.CreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer

class TicketListCreateView(generics.ListCreateAPIView):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
#     permission_classes = [permissions.IsAuthenticated]
    permission_classes = [AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'priority', 'category']
    search_fields = ['title', 'description']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
