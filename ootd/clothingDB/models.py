from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User


# Create your models here.
class Clothing(models.Model):
	name = models.CharField(max_length=200)
	category = models.CharField(max_length=200)
	generalType = models.CharField(max_length=200)
	subType = models.CharField(max_length=200)
	colour = models.CharField(max_length=200)
	weatherIndex = models.IntegerField(default=0)
	picURL = models.CharField(max_length=200)
	brand = models.CharField(max_length=200)
	url = models.CharField(max_length=200)

	def __unicode__(self):
		return self.name

#class ThroughClothes(models.Model):
#	clothing = models.ForeignKey('Clothing')
#	user = models.ForeignKey('User')
#	weight = models.IntegerField(null = True, blank = True)

#class User(models.Model):
#	name = models.CharField(max_length=200)
#	clothes = models.ManyToManyField(Clothing, through='ThroughClothes', null = True, blank = True)

#	def __unicode__(self):
#		return self.name		