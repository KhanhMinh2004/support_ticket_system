from celery import shared_task

@shared_task

def send_ticket_email(ticked_id):
    print(f"Sending email for ticket ID: {ticked_id}")
    return True