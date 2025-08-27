import os
from celery.result import AsyncResult
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
from .tasks import send_ticket_email, export_ticket_csv
from django.db.models.functions import TruncDate, TruncMonth, TruncYear, TruncDay
from django.db.models import Count
from django.db.models import Q
from datetime import datetime
from django.http import HttpResponse
from .serializers import RegisterSerializer
from oauth2_provider.models import Application, AccessToken, RefreshToken
from oauthlib.common import generate_token
from datetime import timedelta
from django.utils import timezone
from google.auth.transport import requests
from google.oauth2 import id_token
import requests as http_requests
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            try:
                app = Application.objects.get(name = "tickets")
                access_token = AccessToken.objects.create(
                    user=user,
                    application=app,
                    token=generate_token(),
                    expires=timezone.now() + timedelta(minutes=1),
                    scope="read write"
                )

                refresh_token = RefreshToken.objects.create(
                    user=user,
                    application=app,
                    token=generate_token(),
                    access_token=access_token,
                )

                user_data = UserSerializer(user).data
                return Response({
                    "message": "Login successful",
                    "user": user_data,
                    "access_token": access_token.token,
                    "refresh_token": refresh_token.token,
                    "expires_in": 60
                }, status=status.HTTP_200_OK)
            except Application.DoesNotExist:
                return Response(
                    {"error": "OAuth2 application not configured"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(
            {"message": "Invalid username or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            idinfo = id_token.verify_oauth2_token(token, 
                                                  requests.Request(),
                                                  os.getenv("GOOGLE_CLIENT_ID"),
                                                  clock_skew_in_seconds=60)
            email = idinfo.get("email")
            name = idinfo.get("name")

            user, created = User.objects.get_or_create(username=email, defaults={"first_name": name.split()[0], 
                                                                                 "last_name": " ".join(name.split()[1:]), 
                                                                                 "email": email})
            if created:
                user.set_unusable_password()
                user.save()
            
            app = Application.objects.get(name = "tickets")
            access_token = AccessToken.objects.create(
                user=user,
                application=app,
                token=generate_token(),
                expires=timezone.now() + timedelta(minutes=1),
                scope="read write"
            )

            refresh_token = RefreshToken.objects.create(
                user=user,
                application=app,
                token=generate_token(),
                access_token=access_token,
            )

            user_data = UserSerializer(user).data
            return Response({
                "message": "Login successful",
                "user": user_data,
                "access_token": access_token.token,
                "refresh_token": refresh_token.token,
                "expires_in": 60
            })
        except Exception as e:
            import traceback
            print("Google token verify failed:", str(e))
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)  
        
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

class TicketListCreateView(generics.ListCreateAPIView):
    queryset = Ticket.objects.all().order_by('created_at')
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]


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
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        ticket = self.get_object()
        new_status = request.data.get('status')
        ticket = self.get_object()

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
    permission_classes = [IsAuthenticated]

    counts = {
        "total": Ticket.objects.count(),
        "open": Ticket.objects.filter(status="Open").count(),
        "in_progress": Ticket.objects.filter(status="In Progress").count(),
        "resolved": Ticket.objects.filter(status="Resolved").count(),
    }
    return Response(counts)

    

class TicketViewByTime(APIView):
    permission_classes = [IsAuthenticated]
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

class ExportTicketCSV(APIView):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'priority', 'category']
    search_fields = ['title', 'description']

    def get_queryset(self):
        queryset = Ticket.objects.all().order_by('created_at')
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)
        return queryset

    def get(self, request):
        queryset = self.get_queryset()
        result = export_ticket_csv.delay(list(queryset.values_list(
            'id', 'title', 'description', 'category',
            'priority', 'status', 'created_at', 'updated_at'
        )))
        csv_data = result.get()
        response = HttpResponse(csv_data, content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="ticket.csv"'
        return response
    
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    # permission_classes = [AllowAny]
    # def get(self, request):
    #     auth_header = request.headers.get("Authorization")
    #     print("Authorization header:", auth_header)
    #     if not auth_header or not auth_header.startswith("Bearer "):
    #         return Response({"error": "Authorization header missing"}, status=status.HTTP_401_UNAUTHORIZED)

    #     access_token = auth_header.split(" ")[1]

    #     # Gọi Google API để xác thực access_token
    #     google_resp = http_requests.get(
    #         "https://openidconnect.googleapis.com/v1/userinfo",
    #         headers={"Authorization": f"Bearer {access_token}"}
    #     )

    #     if google_resp.status_code != 200:
    #         return Response({"error": "Invalid or expired Google token"}, status=status.HTTP_401_UNAUTHORIZED)

    #     user_info = google_resp.json()
    #     return Response(user_info, status=status.HTTP_200_OK)
class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        payload = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "client_secret": os.getenv("GOOGLE_CLIENT_SECRET")
        }
        response = http_requests.post("https://oauth2.googleapis.com/token", data=payload)
        
        if response.status_code == 200:
             data = response.json()
             if "refresh_token" not in data:
                data["refresh_token"] = refresh_token

        return Response(data, status=status.HTTP_200_OK)