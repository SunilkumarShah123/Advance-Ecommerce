from django.contrib import admin
from .models import User, Category, Food

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    # Displays these columns in the list view
    list_display = ('first_name', 'last_name', 'email', 'mobile', 'reg_date')
    # Adds a search bar for specific fields
    search_fields = ('email', 'first_name', 'last_name')
    # Adds a filter sidebar
    list_filter = ('reg_date',)
    # Makes specific fields read-only
    readonly_fields = ('reg_date',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_name', 'creation_date')
    search_fields = ('category_name',)
    list_filter = ('creation_date',)

@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ('item_name', 'category', 'item_price', 'item_quantity', 'is_available')
    # Allows you to filter food items by availability or category
    list_filter = ('is_available', 'category')
    search_fields = ('item_name', 'item_description')
    # Allows editing 'is_available' directly from the list view
    list_editable = ('is_available', 'item_price')