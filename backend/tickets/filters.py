from .models import Ticket
from django.db.models import Q

def filter_tickets(param):
    queryset = Ticket.objects.all()

    search = param.get('search')
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search) 
        )

    category = param.get('category')
    if category:
        queryset = queryset.filter(category__iexact=category)

    priority = param.get('priority')
    if priority:
        queryset = queryset.filter(priority__iexact=priority)

    status = param.get('status')
    if status:
        queryset = queryset.filter(status__iexact=status)

    return queryset