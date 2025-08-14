from django.urls import path
from .views import TicketListCreateView, ticket_counts, LoginView, TicketViewByTime, SearchTicketView, ExportTicketCSV, \
    TicketStatusUpdateView, RegisterView

urlpatterns = [
    path('login', LoginView.as_view(), name = 'login-view'),
    path('register', RegisterView.as_view(), name = 'register-view'),
    path('tickets/stats', TicketViewByTime.as_view(), name = 'ticket-stats'),
    path('tickets/search', SearchTicketView.as_view(), name = 'ticket-search'),
    path('export', ExportTicketCSV.as_view(), name='export-tickets'),

    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:pk>/status', TicketStatusUpdateView.as_view(), name='ticket-status-update'),
    path('tickets/counts', ticket_counts, name='ticket-counts')
]