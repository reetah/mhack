from django.conf.urls import patterns, include, url
from clothingDB.api import ClothingResource
from tastypie.api import Api



from django.contrib import admin

clothing_resource = ClothingResource()



urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'ootd.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    (r'^api/', include(clothing_resource.urls)),
)
