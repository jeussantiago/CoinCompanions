# Generated by Django 4.2 on 2023-08-17 04:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0008_expense_expensedetail'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='expense',
            name='participants',
        ),
    ]
