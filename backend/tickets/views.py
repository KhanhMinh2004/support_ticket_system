from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from .serializers import UserSerializer, TicketSerializer
from .models import Users, Tickets
# Create your views here.


class UserView(generics.ListAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer

class UserPost(generics.CreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    
class TicketView(generics.ListAPIView):
    queryset = Tickets.objects.all()
    serializer_class = TicketSerializer

class TicketPost(generics.CreateAPIView):
    queryset = Tickets.objects.all()
    serializer_class = TicketSerializer
