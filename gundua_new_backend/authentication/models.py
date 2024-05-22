from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from files.models import Counties
# Create your models here.

user_CHOICES = (
    ("Bench", "Bench"),
    ("Bar", "Bar"),
    ("Public", "Public"),

)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(choices=user_CHOICES,
                                 default='Bench', max_length=280)
    phone_number = models.CharField(max_length=180, blank=True, null=True)
    county = models.ForeignKey(
        Counties, max_length=500, null=True,  blank=True, on_delete=models.CASCADE, related_name="+")

    def __str__(self) -> str:
        return (self.user.username)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()