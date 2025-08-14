from django.conf import settings
from django.core.mail import send_mail
from celery import shared_task

@shared_task

def send_ticket_email(id, title, username, email, description, category, priority, create_at ):
    subject = f"New Ticket {title} - Category {category}"
    message = (
        f"Hello {username} , \n\n"
        f"Your ticket has been created at {create_at} successfully."
        f"Ticket ID: {id}"
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

    