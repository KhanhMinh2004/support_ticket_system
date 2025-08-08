from django.db import models

# Create your models here.

class Users(models.Model):
    id_user = models.AutoField( primary_key = True)
    username = models.CharField( max_length = 100, null = False, unique = True)
    password = models.CharField( max_length = 100, null = False)
    email = models.EmailField( max_length = 100, null = False, unique = True)
    role = models.CharField( max_length = 50, default = 'user')
    
    def __str__(self):
        return self.username
    
    class Meta:
        db_table = 'users'
        unique_together = ('username', 'email')
        managed = True
        

class Tickets(models.Model):
    id_ticket = models.AutoField( primary_key=True)
    fullname = models.CharField( max_length = 100, null = False)
    email = models.EmailField( max_length = 100, null = False)
    description = models.TextField( max_length = 500, null = False)
    issue_type = models.CharField( max_length = 50, null = False)
    urgently_level = models.CharField( max_length = 50, null = False)
    status = models.CharField( max_length = 50, null = False, default = 'pending')
    create_at = models.DateTimeField( auto_now_add = True)
    user = models.ForeignKey(
        Users,
        to_field='id_user',
        on_delete=models.CASCADE,
        related_name='tickets',
        db_column='id_user'  
    )
    
    class Meta:
        db_table = 'tickets'
        managed = False