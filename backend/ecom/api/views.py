from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
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
    
    
 
  

    
        
    