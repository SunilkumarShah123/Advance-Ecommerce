from unicodedata import category
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.db.models import Q
from .models import *

from .serializers import *

@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None and user.is_staff:
        return Response(
            {"msg": "Admin Login Successfully", "username": username},
            status=200
        )
    else:
        return Response(
            {"msg": "Invalid login credentials"},
            status=401
        )

@api_view(['POST'])
def add_category(request):
    category_name = request.data.get('category_name')
    if category_name is not None:
      Category.objects.create(category_name=category_name)
      return Response({'msg':"categroy created successfully"},status=201)
    return Response({'msg':'invalid category'},status=401)
    
    
@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()   
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)
  

@api_view(['POST'])
def add_food_item(request):
    data = request.data

    try:
        Food.objects.create(
            category_id=data.get('category'), 
            item_name=data.get('item_name'),
            item_description=data.get('item_description'),
            item_quantity=data.get('item_quantity'),
            item_price=data.get('item_price'),
            image=request.FILES.get('image'),  
        )

        return Response({'message': 'Food item added successfully'}, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
def get_food_items(request):
    foods = Food.objects.all()   
    serializer =  FoodSerializer(foods, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def food_search(request):
    query_keyword=request.GET.get('q','')
    foods = Food.objects.filter(Q(item_name__icontains=query_keyword))  
    serializer =  FoodSerializer(foods, many=True)
    return Response(serializer.data)
        
    