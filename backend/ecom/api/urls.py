from django.urls import path
from .views import *
urlpatterns = [
    path('admin-login/',admin_login,name='admin_login'),
    path('add-category/',add_category,name='add_category'),
]