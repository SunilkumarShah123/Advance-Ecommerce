
from django.urls import path
from .views import *
urlpatterns = [
    path('admin-login/',admin_login,name='admin_login'),
    path('add-category/',add_category,name='add_category'),
    path('get-categories/',get_categories,name='get_categories'),
    path('add-food-item/',add_food_item,name='add_food_item'),
    path('get-food-items/',get_food_items,name='get_food_items'),
    path('food-search/',food_search,name='food_search'),
    path('random-food/',random_food,name="random_food"),
    path('register/',user_register,name="user_register"),
    path('login/',user_login,name="user_login")
    
    
]