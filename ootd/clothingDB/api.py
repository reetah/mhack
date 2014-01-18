from tastypie.resources import ModelResource
from clothingDB.models import Clothing, User

class ClothingResource(ModelResource):
	class Meta:
		queryset = Clothing.objects.all()
		resource_name = 'clothing'

class UserResource(ModelResource):
	class Meta:
		queryset = User.objects.all()
		resource_name = 'user'