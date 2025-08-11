from rest_framework import generics
from .serializers import UserSerializer, TicketSerializer
from .models import Users, Tickets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .tasks import send_ticket_email
from django.db.models.functions import TruncDate, TruncMonth, TruncYear
from django.db.models import Count
from django.db.models import Q
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

class TicketView(generics.ListAPIView):
    queryset = Tickets.objects.all()
    serializer_class = TicketSerializer

class TicketPost(generics.CreateAPIView):
    queryset = Tickets.objects.all()
    serializer_class = TicketSerializer

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
        queryset = Tickets.objects.all()

        if group_by == 'month':
            queryset = queryset.annotate(period=TruncMonth('create_at'))
        elif group_by == 'year':
            queryset = queryset.annotate(period=TruncYear('create_at'))
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