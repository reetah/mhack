from tastypie.authorization import Authorization
from tastypie.resources import Resource, ModelResource
from tastypie import fields
from clothingDB.models import Clothing

class ClothingResource(ModelResource):
	class Meta:
		queryset = Clothing.objects.all()
		resource_name = 'clothing'
		authorization= Authorization()