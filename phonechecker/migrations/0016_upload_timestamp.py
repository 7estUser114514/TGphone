# Generated by Django 3.2.8 on 2021-10-15 03:43

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('phonechecker', '0015_alter_check_result'),
    ]

    operations = [
        migrations.AddField(
            model_name='upload',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='Timestamp'),
            preserve_default=False,
        ),
    ]
