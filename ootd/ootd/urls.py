from django.conf.urls import patterns, include, url
from clothingDB.api import UserResource, ClothingResource
from tastypie.api import Api



from django.contrib import admin

v1_api = Api(api_name='v1')
v1_api.register(UserResource())
v1_api.register(ClothingResource())



urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'ootd.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    (r'^api/', include(v1_api.urls)),

)
