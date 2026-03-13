from django.contrib import admin
from .models import *

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'mobile', 'reg_date')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('reg_date',)
    readonly_fields = ('reg_date',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_name', 'creation_date')
    search_fields = ('category_name',)
    list_filter = ('creation_date',)

@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ('item_name', 'category', 'item_price', 'item_quantity', 'is_available')
    list_filter = ('is_available', 'category')
    search_fields = ('item_name', 'item_description')
    list_editable = ('is_available', 'item_price')

admin.site.register(Order)

@admin.register(OrderAddress)
class OrderAddressAdmin(admin.ModelAdmin):
    list_display = ("order_number", "user", "order_final_status", "order_time")
    list_filter = ("order_final_status", "order_time")
    search_fields = ("order_number", "user__first_name", "user__email")
    ordering = ("-order_time",)
    readonly_fields = ("order_time",)


@admin.register(FoodTracking)
class FoodTrackingAdmin(admin.ModelAdmin):
    list_display = ("order", "status", "remark", "status_date", "order_cancelled_by_user")
    list_filter = ("status", "status_date", "order_cancelled_by_user")
    search_fields = ("order__order_number", "status", "remark")
    ordering = ("-status_date",)
    readonly_fields = ("status_date",)

@admin.register(PaymentDetail)
class PaymentDetailAdmin(admin.ModelAdmin):
    list_display = ("order_number", "user", "payment_mode", "payment_date")
    list_filter = ("payment_mode", "payment_date")
    search_fields = ("order_number", "user__first_name", "user__email")
    ordering = ("-payment_date",)
    readonly_fields = ("payment_date",)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("food", "user", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("user__first_name", "food__item_name", "comment")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ("user", "food", "added_on")
    list_filter = ("added_on",)
    search_fields = ("user__first_name", "food__item_name")
    ordering = ("-added_on",)
    readonly_fields = ("added_on",)