# Generated by Django 3.2.8 on 2021-10-18 22:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('phonechecker', '0018_remove_upload_timestamp'),
    ]

    operations = [
        migrations.AddField(
            model_name='phonenumber',
            name='timestamp',
            field=models.DateTimeField(auto_now=True, verbose_name='Timestamp'),
        ),
    ]
