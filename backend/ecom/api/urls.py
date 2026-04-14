from django.urls import path
from .views import *

urlpatterns = [

    # =========================
    # Admin Authentication
    # =========================
    path('admin/login/', admin_login, name='admin_login'),


    # =========================
    # Admin Dashboard & Analytics
    # =========================
    path('admin/dashboard/', dashboard, name="dashboard"),
    path('admin/sales/monthly/', get_montly_sales_summary, name="monthly_sales_summary"),
    path('admin/sales/weekly/', get_weekly_sales_summary, name="weekly_sales_summary"),
    path('admin/top-selling-food/', get_top_sold_item, name="top_sold_food"),
    path('admin/new-users/weekly/', weekly_registered_user, name="weekly_registered_user"),


    # =========================
    # Category Management (Admin)
    # =========================
    path('admin/categories/', get_categories, name='get_categories'),
    path('admin/categories/add/', add_category, name='add_category'),
    path('admin/categories/<int:category_id>/', manipulate_category, name="manipulate_category"),


    # =========================
    # Food Management
    # =========================
    path('foods/', get_food_items, name='get_food_items'),
    path('foods/add/', add_food_item, name='add_food_item'),
    path('foods/<int:id>/', food_detail, name="food_detail"),
    path('foods/<int:food_id>/manage/', manipulate_food, name="manipulate_food"),
    path('foods/search/', food_search, name='food_search'),
    path('foods/random/', random_food, name="random_food"),


    # =========================
    # Order Management (Admin)
    # =========================
    path('admin/orders/', all_orders, name="all_orders"),
    path('admin/orders/not-confirmed/', order_not_confirmed, name='order_not_confirmed'),
    path('admin/orders/confirmed/', order_confirmed, name="order_confirmed"),
    path('admin/orders/preparing/', food_being_prepared, name="food_being_prepared"),
    path('admin/orders/pickup/', food_pickup, name="food_pickup"),
    path('admin/orders/delivered/', food_delivered, name="food_delivered"),
    path('admin/orders/cancelled/', order_cancelled, name="order_cancelled"),
    path('admin/orders/between-dates/', orders_between_dates, name="orders_between_dates"),
    path('admin/orders/<str:order_number>/', admin_detail_order_view, name="admin_order_detail"),
    path('admin/orders/update-status/', update_order_status, name="update_order_status"),
    path('admin/orders/search/', admin_order_search, name='admin_order_search'),


    # =========================
    # User Authentication
    # =========================
    path('auth/register/', user_register, name="user_register"),
    path('auth/login/', user_login, name="user_login"),


    # =========================
    # User Profile Management
    # =========================
    path('users/<int:user_id>/', get_user_profile, name="get_user_profile"),
    path('users/<int:user_id>/update/', update_user_profile, name="update_user_profile"),
    path('users/<int:user_id>/change-password/', change_password, name="change_password"),


    # =========================
    # User Management (Admin)
    # =========================
    path('admin/users/', get_users, name="get_users"),
    path('admin/users/<int:user_id>/', manipulate_user, name="manipulate_user"),


    # =========================
    # Cart Management
    # =========================
    path('cart/add/', add_to_cart, name="add_to_cart"),
    path('cart/<int:user_id>/', get_order_items, name="get_cart_items"),
    path('cart/update/', update_item_quantity, name="update_item_quantity"),
    path('cart/item/<int:item_id>/delete/', remove_item, name="remove_item"),
    path('cart/<int:user_id>/clear/', clear_cart, name="clear_cart"),


    # =========================
    # Order Management (User)
    # =========================
    path('orders/place/', place_order, name="place_order"),
    path('orders/<int:user_id>/', get_placed_orders, name="user_orders"),
    path('orders/<str:order_number>/', get_single_order_detail, name="order_detail"),
    path('orders/<str:order_number>/address/', get_single_order_address_detail, name="order_address_detail"),
    path('orders/<str:order_number>/invoice/', generate_invoices, name="generate_invoice"),
    path('orders/<str:order_number>/track/', track_order, name="track_order"),
    path('orders/<str:order_number>/cancel/', cancel_order, name="cancel_order"),


    # =========================
    # Wishlist Management
    # =========================
    path('wishlist/add/', add_to_wishlist, name="add_to_wishlist"),
    path('wishlist/remove/', remove_from_wishlist, name="remove_from_wishlist"),
    path('wishlist/<int:user_id>/', get_wish_list, name="get_wishlist"),


    # =========================
    # Review & Ratings
    # =========================
    path('reviews/<int:food_id>/', get_review_list, name="get_review_list"),
    path('reviews/<int:food_id>/add/', add_food_review, name="add_food_review"),
    path('reviews/<int:review_id>/edit/', manage_review, name='edit_review'),
    path('reviews/<int:review_id>/delete/', manage_review, name='delete_review'),
    path('reviews/<int:food_id>/rating-summary/', get_star_rating_summary, name="rating_summary"),
]