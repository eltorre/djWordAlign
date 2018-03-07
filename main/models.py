import datetime

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Alignment(models.Model):
	'''
	Alignment between zero or more source words and zero or more target words
	'''	
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	default = models.BooleanField(default=True)


class Task(models.Model):
	'''
	An alignment task composed of multiple sentence pairs
	'''
	name = models.CharField(max_length=200)
	date = models.DateTimeField("Creation date")

class SentencePair(models.Model):
	'''
	A sentence pair
	'''
	task = models.ForeignKey(Task, on_delete=models.CASCADE)
	order = models.IntegerField()
	class Meta:
		unique_together = ('task', 'order',)

class SourceWord(models.Model):
	'''
	Words of one of the sentences of a sentence pair
	'''
	sentence_pair = models.ForeignKey(Task, on_delete=models.CASCADE)
	position = models.IntegerField()
	word = models.CharField(max_length=200)
	alignment = models.ForeignKey(Alignment, on_delete=models.CASCADE)
	class Meta:
		unique_together = ('sentence_pair', 'position',)	

class TargetWord(models.Model):
	'''
	Words of one of the sentences of a sentence pair
	'''	
	sentence_pair = models.ForeignKey(Task, on_delete=models.CASCADE)
	position = models.IntegerField()
	word = models.CharField(max_length=200)
	alignment = models.ForeignKey(Alignment, on_delete=models.CASCADE)
	class Meta:
		unique_together = ('sentence_pair', 'position',)	

