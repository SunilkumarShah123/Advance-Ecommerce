
from django.urls import path
from .views import *
urlpatterns = [
    path('admin-login/',admin_login,name='admin_login'),
    path('add-category/',add_category,name='add_category'),
    path('get-categories/',get_categories,name='get_categories'),
    path('add-food-item/',add_food_item,name='add_food_item'),
    
]