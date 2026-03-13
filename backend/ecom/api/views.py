from django.shortcuts import get_object_or_404,render
from django.contrib.auth.hashers import check_password, make_password#encrypt the plain password science normal created User models in model.py will store passowrd plain
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.db.models import Q
from .models import *
from django.contrib.auth.decorators import login_required
from .serializers import *
import random #for randomly suffling food items and pick 9 product random and show in home page
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


@api_view(['GET'])
def random_food(request):
    foods = list(Food.objects.all())  
    random.shuffle(foods)              
    select_nine_random_foods = foods[:9]
    serializer = FoodSerializer(select_nine_random_foods, many=True)
    return Response(serializer.data)
    
@api_view(['POST'])
def user_register(request):
    data = request.data

    first_name = data.get('first_name')
    last_name = data.get('last_name')
    phone = data.get('phone')
    email = data.get('email')
    password = data.get('password')

    # Check if email exists
    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "User email already exists. Try a different email."},
            status=400
        )

    # Check if phone exists (only if your User model has mobile field)
    if User.objects.filter(mobile=phone).exists():
        return Response(
            {"error": "Phone number already exists. Try a different phone."},
            status=400
        )

    # Create user
    user = User.objects.create(
        first_name=first_name,
        last_name=last_name,
        email=email,
        mobile=phone,
        password=make_password(password)
    )

    return Response(
        {"msg": "User created successfully"},
        status=201
    )


@api_view(['POST'])
def user_login(request):
    data = request.data
    identifier = data.get('identifier')
    password = data.get('password')

    try:
        user = User.objects.filter(
            Q(email__iexact=identifier) | Q(mobile=identifier)
        ).first()

        if user:
            if check_password(password, user.password):
                return Response(
                    {
                        "msg": f"{user.first_name}, has been logged in successfully",
                        "userId": user.id,
                        "userName": f"{user.first_name} {user.last_name}"
                    },
                    status=200
                )

        return Response(
            {"error": "Invalid User Credentials"},
            status=401
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=500
        )
    
@api_view(['GET'])
def food_detail(request,id):
    food=get_object_or_404(Food,id=id)
    serializer=FoodSerializer(food)
    return Response(serializer.data,status=200)

# get_or_create() searches using the fields passed directly as arguments.
# If we pass quantity=1 normally, Django will also include quantity in the lookup query.
# That means when quantity changes (e.g., 2,3,4), the lookup will fail and Django
# will create a new row instead of updating the existing cart item.

# To avoid duplicate rows, we put quantity inside 'defaults'.
# 'defaults' is only used when Django creates a new object.
# If the cart item already exists (same user and food), it will return that object
# and we can simply increase its quantity instead of creating another row.
@api_view(['POST'])
def add_to_cart(request):
    user_id = request.data.get('userId')
    food_id = request.data.get('foodId')

    try:
        order, created = Order.objects.get_or_create(
            user_id=user_id,
            food_id=food_id,
            is_order_placed=False,
            defaults={'quantity':1}
        )

        if not created:
            order.quantity += 1
            order.save()

        return Response({'msg':"Added to cart successfully"}, status=201)

    except Exception as e:
        return Response({"error":str(e)}, status=400)
    

@api_view(['GET'])
def get_order_items(request,user_id):
    order_items=Order.objects.filter(user_id=user_id,is_order_placed=False)
    serializer=OrderSerializer(order_items,many=True)
    return Response(serializer.data)

@api_view(['PUT'])
def update_item_quantity(request):
    item_id=request.data.get("item_id")
    new_quantity=request.data.get('new_quantity')
    try:
       order=Order.objects.get(id=item_id)
       order.quantity=new_quantity
       order.save()
       return Response({"msg":"item updated successfully"},status=200)
    except:
       return Response({"error":"error during updating item"},status=404)

@api_view(['DELETE'])
def remove_item(request,item_id):
    try:
       order=Order.objects.get(id=item_id)
       order.delete()
       return Response({"msg":"item deleted successfully"},status=200)
    except:
       return Response({"error":"error during deleting  item"},status=404)

@api_view(['DELETE'])
def clear_cart(request, user_id):
    try:
        orders = Order.objects.filter(
            user_id=user_id,
            is_order_placed=False
        )

        orders.delete()

        return Response(
            {"msg": "Items cleared successfully"},
            status=200
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=500
        )

# This function generates a random 9-digit order number.
# It checks whether the generated number already exists in the Order table.
# If the number does not exist, the condition becomes True and the function returns that number.
# If the number already exists, the condition becomes False and the loop runs again,
# generating a new random number until a unique order number is found.

def generate_unique_order_number():
    while True:
        num=str(random.randint(100000000,999999999))
        if not Order.objects.filter(order_number=num).exists():
            return num

@api_view(['POST'])
def place_order(request):
    user_id=request.data.get("userId")
    address=request.data.get("address")
    payment_mode=request.data.get("paymentMode")
    card_number=request.data.get("cardNumber")
    expiry=request.data.get("expiry")
    cvv=request.data.get("cvv")
    user=User.objects.get(id=user_id)
    

    try:
       order=Order.objects.filter(user_id=user_id,is_order_placed=False)
       order_number=generate_unique_order_number()
       order.update(order_number=order_number,is_order_placed=True)
       
       OrderAddress.objects.create(
        user_id=user_id,
        address=address,
        order_number=order_number
       )
       
       PaymentDetail.objects.create(
         user_id=user_id,
         order_number=order_number,
         payment_mode=payment_mode,
         card_no=card_number if payment_mode == "online" else None,
         expiry_date=expiry if payment_mode == "online" else None,
         cvv=cvv if payment_mode == "online" else None,
       )

       return Response({
        "msg":f"Order has been successfully placed for {user.first_name} with Order No. {order_number} "
       },status=201)
    except Exception as e:
       print("ORDER ERROR:", e)
       return Response({"error":str(e)},status=404)

@api_view(['GET'])
def get_orders(request,user_id):
    try:
      orders=Order.objects.filter(user_id=user_id)
      serializer=OrderSerializer(orders,many=True)
      return Response(serializer.data,status=200)
    except Exception as e:
        print("Order Error:",e)
        return Response({"error":str(e)},status=404)

@api_view(['GET'])
def get_single_order_detail(request,order_number):
    try:
      orders=Order.objects.get(order_number=order_number,is_order_placed=True)
      print(orders.food.image)
      serializer=OrderSerializer(orders)
      return Response(serializer.data,status=200)
    except Exception as e:
        print("Order Error:",e)
        return Response({"error":str(e)},status=404)

@api_view(['GET'])
def get_single_order_address_detail(request,order_number):
    try:
      order_address=OrderAddress.objects.get(order_number=order_number)
      serializer=OrderAddressSerializer(order_address)
      return Response(serializer.data,status=200)
    except Exception as e:
        print("Order Error:",e)
        return Response({"error":str(e)},status=404)

def generate_invoices(request, order_number):
    orders = Order.objects.filter(order_number=order_number, is_order_placed=True)
    order_address = OrderAddress.objects.get(order_number=order_number)

    grand_total = 0
    order_data = []

    for i in orders:
        total = i.food.item_price * i.quantity
        grand_total += total

        order_data.append({
            "food": i.food,
            "order_quantity": i.quantity,
            "total_price": total
        })

    context = {
        "order_number": order_number,
        "grand_total": grand_total,
        "address": order_address,
        "order_data": order_data
    }

    return render(request, "invoices.html", context)