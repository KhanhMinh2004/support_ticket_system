from django.urls import path
from .views import UserView, UserPost, TicketListCreateView, ticket_counts

urlpatterns = [
    path('users', UserView.as_view(), name='user-view'),
    path('users/create', UserPost.as_view(), name='user-create'),

    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/counts', ticket_counts, name='ticket-counts')
]