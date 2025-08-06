from django.db import models

# Create your models here.

class Tickets(models.Model):
    id_ticket = models.AutoField( primary_key=True),
    fullname = models.VarCharField( max_length = 100, null = False),
    email = models.EmailField( max_length = 100, null = False),
    description = models.TextFild( max_length = 500, null = False),
    issue_type = models.VarcharField( max_length = 50, null = False),
    urgently_level = models.VarcharField( max_length = 50, null = False),
    status = models.VarcharField( max_length = 50, null = False, default = 'pending'),
    created_at = models.DateTimeField( auto_now_add = True)
    models.ForeignKey("app.Model", verbose_name=(""), on_delete=models.id_user, related_name="tickets")

class Users(models.Model):
    id_user = models.AutoField( primary_key = True),
    username = models.VarcharField( max_length = 100, null = False, unique = True),
    password = models.PasswordField( max_length = 100, null = False),
    email = models.EmailField( max_length = 100, null = False, unique = True),
    role = models.VarcharField( max_length = 50, null = False, default = 'user'),