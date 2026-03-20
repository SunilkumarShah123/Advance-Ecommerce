from rest_framework import serializers
from .models import *
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class FoodSerializer(serializers.ModelSerializer):
    category_name=serializers.CharField(source="category.category_name",read_only=True)
    class Meta:
        model = Food
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    food = FoodSerializer()
    order_time = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = "__all__"

    def get_order_time(self, obj):
        address = OrderAddress.objects.filter(order_number=obj.order_number).first()
        return address.order_time if address else None


class OrderAddressSerializer(serializers.ModelSerializer):
    order_final_status = serializers.SerializerMethodField()
    payment_mode = serializers.SerializerMethodField()

    class Meta:
        model = OrderAddress
        fields = ["order_number", "order_time", "order_final_status", "payment_mode"]

    def get_order_final_status(self, obj):
        return obj.order_final_status or "Waiting for the Order Confirmation"

    def get_payment_mode(self, obj):
        try:
            payment = PaymentDetail.objects.get(order_number=obj.order_number)
            return payment.payment_mode
        except PaymentDetail.DoesNotExist:
            return None

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class OrderSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderAddress
        fields = ["id","order_number","order_time"]

#sends order address detail + user detail 
class OrderDetailSerializer(serializers.ModelSerializer):
    first_name=serializers.CharField(source="user.first_name")
    last_name=serializers.CharField(source="user.last_name")
    email=serializers.CharField(source="user.email")
    mobile=serializers.CharField(source="user.mobile")

    class Meta:
        model = OrderAddress
        fields = ["order_number","order_time","order_final_status","address","first_name","last_name","email","mobile"]

#sends the detail of order foods in the order 
class OrderedFoodDetailSerializer(serializers.ModelSerializer):
    item_name=serializers.CharField(source="food.item_name")
    item_price=serializers.CharField(source="food.item_price")
    image=serializers.ImageField(source="food.image")
    
    class Meta:
        model = Order
        fields = ["item_name","item_price","image"]

#sends the detail of order foods in the order 
class FoodOrderTrackingSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = FoodTracking
        fields = '__all__'

class WishListSerializer(serializers.ModelSerializer):
    food_id=serializers.IntegerField(source="food.id")
    item_name=serializers.CharField(source="food.item_name")
    item_price=serializers.CharField(source="food.item_price")
    image=serializers.ImageField(source="food.image")
    description=serializers.CharField(source="food.item_description")
    is_available=serializers.BooleanField(source="food.is_available")

    class Meta:
        model = Wishlist
        fields = ["food_id","item_name","item_price","image","description","is_available"]

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    food_name = serializers.CharField(source="food.item_name", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "user",
            "user_id",
            "user_name",
            "rating",
            "comment",
            "created_at",
            "food",
            "food_name",
        ]

    def get_user_name(self, obj):
        if obj.user:
            full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
            return full_name if full_name else obj.user.username
        return "Unknown User"