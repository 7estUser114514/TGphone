# Generated by Django 3.2.8 on 2021-10-14 08:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('phonechecker', '0011_check_username'),
    ]

    operations = [
        migrations.CreateModel(
            name='MySql',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('db_name', models.CharField(max_length=100, verbose_name='DB Name')),
                ('db_username', models.CharField(max_length=100, verbose_name='DB Username')),
                ('db_password', models.CharField(max_length=100, verbose_name='DB Password')),
                ('db_host', models.CharField(max_length=100, verbose_name='DB Host')),
                ('db_port', models.IntegerField(default=3306, max_length=5, verbose_name='DB Port')),
                ('timestamp', models.DateTimeField(auto_now_add=True, verbose_name='Timestamp')),
            ],
            options={
                'verbose_name': 'mysql',
                'verbose_name_plural': 'mysqls',
            },
        ),
    ]
