from django.urls import path
from .views import UserView, UserPost, TicketListCreateView

urlpatterns = [
    path('users', UserView.as_view(), name='user-view'),
    path('users/create', UserPost.as_view(), name='user-create'),
#     path('tickets', TicketView.as_view(), name='ticket-view'),
#     path('tickets/create', TicketPost.as_view(), name='ticket-create'),
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
]