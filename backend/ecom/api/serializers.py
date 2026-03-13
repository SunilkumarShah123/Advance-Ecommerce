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

