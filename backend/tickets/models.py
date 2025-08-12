from django.db import models
from django.conf import settings

# Create your models here.

class Users(models.Model):
    id_user = models.AutoField( primary_key = True)
    username = models.CharField( max_length = 100, null = False, unique = True)
    password = models.CharField( max_length = 100, null = False)
    email = models.EmailField( max_length = 100, null = False, unique = True)
    role = models.CharField( max_length = 50, null = False, default = 'user')
    
    def __str__(self):
        return self.username
    
    class Meta:
        db_table = 'users'
        unique_together = ('username', 'email')
        managed = False
        

class Ticket(models.Model):
    CATEGORY_CHOICES = [
        ("Hardware Issues", "Hardware Issues"),
        ("Software Problems", "Software Problems"),
        ("Network Connectivity", "Network Connectivity"),
        ("Email & Communication", "Email & Communication"),
        ("Account Access", "Account Access"),
        ("Security & Permissions", "Security & Permissions"),
        ("Other", "Other"),
    ]

    PRIORITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
    ]

    STATUS_CHOICES = [
        ("Open", "Open"),
        ("In Progress", "In Progress"),
        ("Resolved", "Resolved")
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices = STATUS_CHOICES, default="Open")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tickets'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.status})"