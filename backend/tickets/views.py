from django.shortcuts import render
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, filters
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from .serializers import UserSerializer, TicketSerializer
from .models import Users, Ticket
from .models import Users, Tickets
from rest_framework.views import APIView
from rest_framework import status
from .tasks import send_ticket_email
from django.db.models.functions import TruncDate, TruncMonth, TruncYear, TruncDay
from django.db.models import Count
from django.db.models import Q
from datetime import datetime
from django.http import HttpResponse
import csv
# Create your views here.

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = Users.objects.get(username = username, password = password)
            user_data = UserSerializer(user).data
            return Response({"message" : "Login successful", "user" : user_data}, status=status.HTTP_200_OK)
        except Users.DoesNotExist:
            return Response(message = "Invalid information", status=status.HTTP_400_BAD_REQUEST)

class UserPost(generics.CreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response({"message" : "Registation successful"})

class UserView(generics.ListAPIView):
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

@api_view(['GET'])
def ticket_counts(request):
    counts = {
        "total": Ticket.objects.count(),
        "open": Ticket.objects.filter(status="Open").count(),
        "in_progress": Ticket.objects.filter(status="In Progress").count(),
        "resolved": Ticket.objects.filter(status="Resolved").count(),
    }
    return Response(counts)

    def perform_create(self, serializer):
        ticket = serializer.save()

        send_ticket_email.delay(
            ticket.id_ticket,
            ticket.fullname,
            ticket.email,
            ticket.description,
            ticket.issue_type,
            ticket.urgently_level,
            ticket.create_at.isoformat(),
            ticket.user.username if ticket.user else "Anonymous"
        )

class TicketViewByTime(APIView):

    def get(self, request, *args, **kwargs):
        group_by = request.query_params.get('group_by', 'day')
        date_filter = request.query_params.get('date', None)
        queryset = Tickets.objects.all()

        if group_by == 'month':
            queryset = queryset.annotate(period=TruncMonth('create_at'))
            data = (
            queryset.values('period').annotate(count=Count('id_ticket')).order_by('period')
        )
            results = [
                {
                    "date": item["period"].strftime("%Y-%m"),
                    "count": item["count"]
                }
                for item in data
            ]

        elif group_by == 'year':
            queryset = queryset.annotate(period=TruncYear('create_at'))
            data = (
            queryset.values('period').annotate(count=Count('id_ticket')).order_by('period')
        )
            results = [
                {
                    "date": item["period"].strftime("%Y"),
                    "count": item["count"]
                }
                for item in data
            ]

        elif group_by == 'day':
            queryset = queryset.annotate(period=TruncDay('create_at'))
            if date_filter:
                try:
                    date_obj = datetime.strptime(date_filter, '%Y-%m-%d').date()
                    queryset = queryset.filter(period=date_obj)
                except ValueError:
                    pass
            data = (queryset.values('period').annotate(count=Count('id_ticket')).order_by('period'))
            results = [
                {
                    "date": item["period"].strftime("%Y-%m-%d"),
                    "count": item["count"]
                }
                for item in data
            ]

        else:
            queryset = queryset.annotate(period=TruncDate('create_at'))
            data = (
                queryset.values('period').annotate(count=Count('id_ticket')).order_by('period')
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
        queryset = Tickets.objects.all()

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
        writer.writerow(['ID', 'Full Name', 'Email', 'Description', 'Issue Type', 'Urgently Level', 'Status', 'Created At'])
        for ticket in Tickets.objects.all().values_list('id_ticket', 'fullname', 'email', 'description', 'issue_type', 'urgently_level', 'status', 'create_at'):
            writer.writerow(ticket)

        response['Content-Disposition'] = 'attachment; filename="ticket.csv"'
        return response