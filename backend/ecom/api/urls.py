from django.urls import path
from .views import *

urlpatterns = [

    # =========================
    # Admin Authentication
    # =========================
    path('admin-login/', admin_login, name='admin_login'),


    # =========================
    # sy Management (Admin)
    # =========================
    path('add-category/', add_category, name='add_category'),
    path('get-categories/', get_categories, name='get_categories'),


    # =========================
    # Food Management
    # =========================
    path('add-food-item/', add_food_item, name='add_food_item'),
    path('get-food-items/', get_food_items, name='get_food_items'),
    path('food-search/', food_search, name='food_search'),
    path('random-food/', random_food, name="random_food"),
    path('food/<int:id>/', food_detail, name="food_detail"),


    # =========================
    # Order Management (Admin)
    # =========================
    path('not-confirmed-orders/', order_not_confirmed, name='order_not_confirmed'),
    path('orders/confirmed/', order_confirmed, name="order_confirmed"),
    path('orders/preparing/', food_being_prepared, name="food_being_prepared"),
    path('orders/pickup/', food_pickup, name="food_pickup"),
    path('orders/delivered/', food_delivered, name="food_delivered"),
    path('orders/cancelled/', order_cancelled, name="order_cancelled"),
    path('orders/all/', all_orders, name="all_orders"),
    path('orders-between-dates/', orders_between_dates, name="orders-between-dates"),
    path('admin/order-detail/<str:order_number>/', admin_detail_order_view, name="admin_detail_order_view"),
    path('admin/update-order-status/', update_order_status, name="update_order_status"),
    path('admin-search-order/',admin_order_search, name='admin_order_search'),


    # =========================
    # User Authentication
    # =========================
    path('register/', user_register, name="user_register"),
    path('login/', user_login, name="user_login"),

    
    # =========================
    # Cart Management
    # =========================
    path('cart/add/', add_to_cart, name="add_to_cart"),
    path('cart/<int:user_id>/', get_order_items, name="get_order_items"),
    path('cart/update-quantity/', update_item_quantity, name="update_item_quantity"),
    path('cart/delete-item/<int:item_id>/', remove_item, name="remove_item"),
    path('cart/clear-order/<int:user_id>/', clear_cart, name="clear_cart"),


    # =========================
    # Order Placement (User)
    # =========================
    path('place-order/', place_order, name="place_order"),
    path('my-orders/<int:user_id>/', get_placed_orders, name="get_orders"),
    path('single-order-detail/<str:order_number>/', get_single_order_detail, name="get_single_order_detail"),
    path('single-order-address-detail/<str:order_number>/', get_single_order_address_detail, name="get_single_order_address_detail"),
    path('invoices/<str:order_number>/', generate_invoices, name="generate_invoices"),


    # =========================
    # User Profile Management
    # =========================
    path('user/<int:user_id>/', get_user_profile, name="get_user_profile"),
    path('user/update/<int:user_id>/', update_user_profile, name="update_user_profile"),
    path('user/change-password/<int:user_id>/', change_password, name="change_password"),


    #manipulating category
    path("manipulate-category/<int:category_id>/",manipulate_category,name="manipulate_category"),
    path("manipulate-food/<int:food_id>/",manipulate_food,name="manipulate_food"),
    path("manage-users/", get_users),
    path("manipulate-users/<int:user_id>/", manipulate_user),
    path("dashboard/",dashboard,name="dashboard"),
    path("montly-sales-summary/",get_montly_sales_summary,name="get_monthly_sales_summary"),
    path("top-sold-food-item/",get_top_sold_item,name="get_top_sold_item"),
    path("weekly-sales-summary/",get_weekly_sales_summary,name="get_weekly_sales_summary"),
    path("weekly-registered-new-users/",weekly_registered_user,name="weekly_registered_user"),

    path("wishlist/add/",add_to_wishlist,name="add_to_wishlist"),
    path("wishlist/remove/",remove_from_wishlist,name="remove_from_wishlist"),
    path("get-wish-list/<int:user_id>/",get_wish_list,name="get_wish_list"),
    
    path("track-order/<str:order_number>/",track_order,name="track_order"),
    path('cancel-order/<str:order_number>/',cancel_order,name="cancel_order"),

]