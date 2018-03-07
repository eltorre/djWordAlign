# Generated by Django 2.0.2 on 2018-03-07 17:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Alignment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('default', models.BooleanField(default=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SentencePair',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='SourceWord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', models.IntegerField()),
                ('word', models.CharField(max_length=200)),
                ('alignment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.Alignment')),
            ],
        ),
        migrations.CreateModel(
            name='TargetWord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', models.IntegerField()),
                ('word', models.CharField(max_length=200)),
                ('alignment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.Alignment')),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('date', models.DateTimeField(verbose_name='Creation date')),
            ],
        ),
        migrations.AddField(
            model_name='targetword',
            name='sentence_pair',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.Task'),
        ),
        migrations.AddField(
            model_name='sourceword',
            name='sentence_pair',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.Task'),
        ),
        migrations.AddField(
            model_name='sentencepair',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.Task'),
        ),
        migrations.AlterUniqueTogether(
            name='targetword',
            unique_together={('sentence_pair', 'position')},
        ),
        migrations.AlterUniqueTogether(
            name='sourceword',
            unique_together={('sentence_pair', 'position')},
        ),
        migrations.AlterUniqueTogether(
            name='sentencepair',
            unique_together={('task', 'order')},
        ),
    ]