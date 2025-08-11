from django.urls import path
from .views import UserView, TicketView, UserPost, TicketPost, LoginView, TicketViewByTime, SearchTicketView, ExportTicketCSV

urlpatterns = [
    path('login', LoginView.as_view(), name = 'login-view'),
    path('users', UserView.as_view(), name = 'user-view'),
    path('users/create', UserPost.as_view(), name = 'user-create'),
    path('tickets', TicketView.as_view(), name = 'ticket-view'),
    path('tickets/create', TicketPost.as_view(), name = 'ticket-create'),
    path('tickets/stats', TicketViewByTime.as_view(), name = 'ticket-stats'),
    path('tickets/search', SearchTicketView.as_view(), name = 'ticket-search'),
    path('export', ExportTicketCSV.as_view(), name='export-tickets')
]