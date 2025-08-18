from django.conf import settings
from django.core.mail import send_mail
from celery import shared_task
from io import StringIO
from .models import Ticket
import csv
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import uuid

@shared_task
def send_ticket_email(id, title, username, email, description, category, priority, create_at ):
    subject = f"New Ticket {title} - Category {category}"
    message = (
        f"Hello {username} , \n\n"
        f"Your ticket has been created at {create_at} successfully.\n"
        f"Ticket ID: {id}' '"
        f"Description: {description}\n"
        f"Category: {category}\n"
        f"Priority: {priority}\n"
        f"Status: Pending \n\n"
        f"Thank you for reaching out to us. We will get back to you as soon as possible.\n\n"
    )

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False
    )
    return f"Email sent to {email} for ticket {id}"

@shared_task
def export_ticket_csv():
    output = StringIO()

    writer = csv.writer(output)
    writer.writerow(['ID', 'Title', 'Description', 'Category', 'Priority', 'Status', 'Created At', 'Updated At'])
    for ticket in Ticket.objects.all().values_list('id', 'title', 'description', 'category', 'priority', 'status', 'created_at', 'updated_at'):
        writer.writerow(ticket)

    csv_data = '\ufeff' + output.getvalue()

    output.close()
    return csv_data