from tastypie.authorization import Authorization
from tastypie.resources import Resource, ModelResource
from tastypie import fields
from clothingDB.models import Clothing, User, ThroughClothes

class ClothingResource(ModelResource):
	class Meta:
		queryset = Clothing.objects.all()
		resource_name = "clothings"
		authorization= Authorization()


class ThroughClothesResource(ModelResource):
	clothing = fields.ToOneField(ClothingResource,'clothing',full=True)
	class Meta:
		queryset = ThroughClothes.objects.all()
		authorization= Authorization()


class UserResource(ModelResource):
	clothes = fields.ToManyField(ThroughClothesResource,
            attribute=lambda bundle: bundle.obj.clothes.through.objects.filter(
                user=bundle.obj) or bundle.obj.clothes, full=True,  full_list=True)
	class Meta:
		queryset = User.objects.all()
		resource_name = 'user'
		authorization= Authorization()
