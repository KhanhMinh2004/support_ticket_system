from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, filters, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, TicketSerializer
from .models import Ticket
from rest_framework.views import APIView
from rest_framework import status
from .tasks import send_ticket_email
from django.db.models.functions import TruncDate, TruncMonth, TruncYear, TruncDay
from django.db.models import Count
from django.db.models import Q
from datetime import datetime
from django.http import HttpResponse
import csv
from .serializers import RegisterSerializer

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data
            return Response({
                "message": "Login successful",
                "user": user_data,
                "token": token.key
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

class TicketListCreateView(generics.ListCreateAPIView):
    queryset = Ticket.objects.all().order_by('id')
    serializer_class = TicketSerializer
#     permission_classes = [permissions.IsAuthenticated]
    permission_classes = [AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'priority', 'category']
    search_fields = ['title', 'description']
    

    def perform_create(self, serializer):
        ticket = serializer.save(user=self.request.user)
        emailFE = self.request.data.get('email')
        user_data = UserSerializer(self.request.user).data
        fullname = user_data.get('full_name', 'User')

        send_ticket_email.delay(
                ticket.id,
                ticket.title,
                fullname,
                emailFE,
                ticket.description,
                ticket.category,
                ticket.priority,
                ticket.created_at.isoformat(),      
            )
        
            

class TicketStatusUpdateView(generics.UpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def update(self, request, *args, **kwargs):
        ticket = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response({"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)

        ticket.status = new_status
        ticket.save()

        return Response({
            "message": "Ticket status updated",
            "id": ticket.id,
            "status": ticket.status,
        }, status=status.HTTP_200_OK)


@api_view(['GET'])
def ticket_counts(request):
    counts = {
        "total": Ticket.objects.count(),
        "open": Ticket.objects.filter(status="Open").count(),
        "in_progress": Ticket.objects.filter(status="In Progress").count(),
        "resolved": Ticket.objects.filter(status="Resolved").count(),
    }
    return Response(counts)

    

class TicketViewByTime(APIView):

    def get(self, request, *args, **kwargs):
        group_by = request.query_params.get('group_by', 'day')
        date_filter = request.query_params.get('date', None)
        queryset = Ticket.objects.all()

        if group_by == 'month':
            queryset = queryset.annotate(period=TruncMonth('created_at'))
            data = (
            queryset.values('period').annotate(count=Count('id')).order_by('period')
        )
            results = [
                {
                    "date": item["period"].strftime("%Y-%m"),
                    "count": item["count"]
                }
                for item in data
            ]

        elif group_by == 'year':
            queryset = queryset.annotate(period=TruncYear('created_at'))
            data = (
            queryset.values('period').annotate(count=Count('id')).order_by('period')
        )
            results = [
                {
                    "date": item["period"].strftime("%Y"),
                    "count": item["count"]
                }
                for item in data
            ]

        elif group_by == 'day':
            queryset = queryset.annotate(period=TruncDay('created_at'))
            if date_filter:
                try:
                    date_obj = datetime.strptime(date_filter, '%Y-%m-%d').date()
                    queryset = queryset.filter(period=date_obj)
                except ValueError:
                    pass
            data = (queryset.values('period').annotate(count=Count('id')).order_by('period'))
            results = [
                {
                    "date": item["period"].strftime("%Y-%m-%d"),
                    "count": item["count"]
                }
                for item in data
            ]

        else:
            queryset = queryset.annotate(period=TruncDate('created_at'))
            data = (
                queryset.values('period').annotate(count=Count('id')).order_by('period')
            )
            results = [
                {
                    "date": item["period"].strftime("%Y-%m-%d"),
                    "count": item["count"]
                }
                for item in data
            ]

        return Response(results)

class SearchTicketView(generics.ListAPIView):
    serializer_class = TicketSerializer

    def get_queryset(self):
        queryset = Ticket.objects.all()

        query = self.request.query_params.get('query')
        if query:
            queryset = queryset.filter(
                Q(fullname__icontains=query) |
                Q(email__icontains=query) |
                Q(description__icontains=query) |
                Q(issue_type__icontains=query) |
                Q(urgently_level__icontains=query) |
                Q(status__icontains=query)
            )

        issue_type = self.request.query_params.get('issue_type')
        if issue_type:
            queryset = queryset.filter(issue_type__iexact=issue_type)

        urgently_level = self.request.query_params.get('urgently_level')
        if urgently_level:
            queryset = queryset.filter(urgently_level__iexact=urgently_level)

        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status__iexact=status)

        return queryset

class ExportTicketCSV(generics.ListAPIView):
    serializer_class = TicketSerializer

    def get(self, request, *args, **kwargs):
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response.write('\ufeff')

        writer = csv.writer(response)
        writer.writerow(['ID', 'Title', 'Description', 'Category', 'Priority', 'Status', 'Created At', 'Updated At'])
        for ticket in Ticket.objects.all().values_list('id', 'title', 'description', 'category', 'priority', 'status', 'created_at', 'updated_at'):
            writer.writerow(ticket)

        response['Content-Disposition'] = 'attachment; filename="ticket.csv"'
        return response
    
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)