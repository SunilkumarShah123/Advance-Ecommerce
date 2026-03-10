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
    food=FoodSerializer()
    class Meta:
        model = Order
        fields = '__all__'