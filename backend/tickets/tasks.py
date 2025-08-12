from django.conf import settings
from django.core.mail import send_mail
from celery import shared_task

@shared_task

def send_ticket_email(ticked_id, fullname, email, description, issue_type, urgently_level, create_at, user ):
    subject = f"New Ticket {issue_type} - Urgency {urgently_level}"
    message = (
        f"Hello {fullname} from {user}, \n\n"
        f"Your ticket has been created at {create_at} successfully."
        f"Ticket ID: {ticked_id}"
        f"Description: {description}\n"
        f"Issue type: {issue_type}\n"
        f"Urgently level: {urgently_level}\n"
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
    return f"Email sent to {email} for ticket {ticked_id}"

    