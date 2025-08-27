from django.urls import path, include
from .views import TicketListCreateView, ticket_counts, LoginView, TicketViewByTime, ExportTicketCSV, \
    TicketStatusUpdateView, RegisterView, MeView, GoogleLoginView, RefreshTokenView

urlpatterns = [
    path('login', LoginView.as_view(), name = 'login-view'),
    path('login/google', GoogleLoginView.as_view(), name='google-login'),
    path('register', RegisterView.as_view(), name = 'register-view'),
    path('tickets/stats', TicketViewByTime.as_view(), name = 'ticket-stats'),
    path('export/', ExportTicketCSV.as_view(), name='export-tickets'),
    path('tickets/<int:pk>', TicketListCreateView.as_view(), name='ticket-detail'),
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:pk>/status', TicketStatusUpdateView.as_view(), name='ticket-status-update'),
    path('tickets/counts', ticket_counts, name='ticket-counts'),
    path('me/', MeView.as_view(), name='me-view'),
    path('refresh/', RefreshTokenView.as_view(), name='refresh-view')
]