from rest_framework import generics
from .serializers import UserSerializer, TicketSerializer
from .models import Users, Tickets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .tasks import send_ticket_email
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
