
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
    path('login/',user_login,name="user_login"),
    path('food/<int:id>/',food_detail,name="food_detail"),
    path('cart/add/',add_to_cart,name="add_to_cart"),
    path('cart/<int:user_id>/',get_order_items,name="get_order_items"),
    path('cart/update-quantity/',update_item_quantity,name="update_item_quantity"),
    path('cart/delete-item/<int:item_id>/',remove_item,name="remove_item"),
    path('cart/clear-order/<int:user_id>/',clear_cart,name="clear_cart")

    
    
]