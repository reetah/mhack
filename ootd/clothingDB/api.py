from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from tastypie import fields
from clothingDB.models import Clothing, User

class ClothingResource(ModelResource):
	class Meta:
		queryset = Clothing.objects.all()
		resource_name = 'clothing'

class UserResource(ModelResource):
	clothes = fields.ManyToManyField(ClothingResource, 'clothing')
	class Meta:
		queryset = User.objects.all()
		resource_name = 'user'
		authorization= Authorization()
