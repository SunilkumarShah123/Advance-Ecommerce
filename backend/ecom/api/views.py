from collections import defaultdict
from decimal import Decimal
from time import strftime
from django.shortcuts import get_object_or_404,render
from django.contrib.auth.hashers import check_password, make_password#encrypt the plain password science normal created User models in model.py will store passowrd plain
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.db.models import Q, Count
from .models import *
from .serializers import *
import random #for randomly suffling food items and pick 9 product random and show in home page
from django.utils.timezone import timedelta, now
from django.db.models import Sum, F,DecimalField
from django.db.models.functions import Ord, TruncMonth,Coalesce,TruncWeek
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
def get_placed_orders(request, user_id):
    try:
        placed_orders = OrderAddress.objects.filter(user_id=user_id)

        unique_placed_orders = []
        seen = set()

        for order in placed_orders:
            if order.order_number not in seen:
                unique_placed_orders.append(order)
                seen.add(order.order_number)

        serializer = OrderAddressSerializer(unique_placed_orders, many=True)
        return Response(serializer.data, status=200)

    except Exception as e:
        print("Order Error:", e)
        return Response({"error": str(e)}, status=404)

@api_view(['GET'])
def get_single_order_detail(request, order_number):
    try:
        orders = Order.objects.filter(
            order_number=order_number,
            is_order_placed=True
        )
        print(orders.first())

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=200)

    except Exception as e:
        print("Order Error:", e)

        return Response({"error": str(e)}, status=404)

@api_view(['GET'])
def get_single_order_address_detail(request, order_number):
    try:
        order_address = OrderAddress.objects.filter(order_number=order_number).first()
        # print(order_address.order_time)
        if not order_address:
            return Response({"error": "Address not found"}, status=404)

        serializer = OrderAddressSerializer(order_address)
        return Response(serializer.data, status=200)

    except Exception as e:
        print("Order Error:", e)
        return Response({"error": str(e)}, status=404)

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

@api_view(['GET'])
def get_user_profile(request,user_id):
    try:
      user=User.objects.get(id=user_id)
      serializer=UserSerializer(user)
      return Response(serializer.data,status=200)
    except Exception as e:
        print("User Error:",e)
        return Response({"error":str(e)},status=404)

@api_view(['PUT'])
def update_user_profile(request,user_id):
    try:
      user=User.objects.get(id=user_id)
      serializer=UserSerializer(user,data=request.data,partial=True)
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data,status=201)
      return Response(serializer.errors,status=401)
    except Exception as e:
        print("User Error:",e)
        return Response({"error":str(e)},status=404)


@api_view(['POST'])
def change_password(request, user_id):
    try:
        user = User.objects.get(id=user_id)

        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not check_password(current_password, user.password):
            return Response({
                "error": "Current password is incorrect"
            }, status=400)

        user.password = make_password(new_password)
        user.save()

        return Response({
            "msg": "Password changed successfully"
        }, status=200)

    except User.DoesNotExist:
        return Response({
            "error": "User not found"
        }, status=404)

@api_view(['GET'])
def order_not_confirmed(request):
    try:
      orders=OrderAddress.objects.filter(order_final_status__isnull=True)
      serializer=OrderSummarySerializer(orders,many=True)
      return Response(serializer.data,status=200)
    except Exception as e:
        print("Order Error:",e)
        return Response({"error":str(e)},status=404)

@api_view(['GET'])
def order_confirmed(request):
    try:
      orders=OrderAddress.objects.filter(order_final_status="Order Confirmed")
      serializer=OrderSummarySerializer(orders,many=True)
      return Response(serializer.data,status=200)
    except Exception as e:
        print("Order Error:",e)
        return Response({"error":str(e)},status=404)

@api_view(['GET'])
def food_being_prepared(request):
    try:
      orders=OrderAddress.objects.filter(order_final_status="Food Being Prepared")
      serializer=OrderSummarySerializer(orders,many=True)
      return Response(serializer.data,status=200)
    except Exception as e:
        print("Order Error:",e)
        return Response({"error":str(e)},status=404)

@api_view(['GET'])
def food_pickup(request):
    try:
      orders=OrderAddress.objects.filter(order_final_status="Food Pickup")
      serializer=OrderSummarySerializer(orders,many=True)
      return Response(serializer.data,status=200)
    except Exception as e:
        print("Order Error:",e)
        return Response({"error":str(e)},status=404)

@api_view(['GET'])
def food_delivered(request):
    try:
      orders=OrderAddress.objects.filter(order_final_status="Food Delivered")
      serializer=OrderSummarySerializer(orders,many=True)
      return Response(serializer.data,status=200)
    except Exception as e:
        print("Order Error:",e)
        return Response({"error":str(e)},status=404)

@api_view(['GET'])
def order_cancelled(request):
    try:
      orders=OrderAddress.objects.filter(order_final_status="Order Cancelled")
      serializer=OrderAddressSerializer(orders,many=True)
      return Response(serializer.data,status=200)
    except Exception as e:
        print("Order Error:",e)
        return Response({"error":str(e)},status=404)

@api_view(['GET'])
def all_orders(request):
    try:
      orders=OrderAddress.objects.all()
      serializer=OrderSummarySerializer(orders,many=True)
      return Response(serializer.data,status=200)
    except Exception as e:
        print("Order Error:",e)
        return Response({"error":str(e)},status=404)

@api_view(['POST'])
def orders_between_dates(request):
    try:
        from_date = request.data.get("from_date")
        to_date = request.data.get("to_date")
        status = request.data.get("status")

        orders = OrderAddress.objects.filter(order_time__date__range=[from_date, to_date])

        if status == 'not_confirmed':
            orders = orders.filter(order_final_status__isnull=True)

        elif status != 'all':
            orders = orders.filter(order_final_status=status)

        serializer = OrderSummarySerializer(orders, many=True)

        return Response(serializer.data)

    except Exception as e:
        print("Report Error:", e)
        return Response(
            {"error": str(e)},
            status=500
        )

@api_view(['POST'])
def orders_between_dates(request):
    try:
        from_date = request.data.get("from_date")
        to_date = request.data.get("to_date")
        status = request.data.get("status")

        orders = OrderAddress.objects.filter(order_time__date__range=[from_date, to_date])

        if status == 'Not Confirmed':
            orders = orders.filter(order_final_status__isnull=True)

        elif status != 'all':
            orders = orders.filter(order_final_status=status)

        serializer = OrderSummarySerializer(orders, many=True)

        return Response(serializer.data)

    except Exception as e:
        print("Report Error:", e)
        return Response(
            {"error": str(e)},
            status=500
        )

@api_view(['GET'])
def admin_detail_order_view(request,order_number):
    try:
        order_address=OrderAddress.objects.get(order_number=order_number)#at a time viewing single order address detail so used get
        order=Order.objects.filter(order_number=order_number)#their can be multiple record in one single order so used filter
        tracking=FoodTracking.objects.filter(order__order_number=order_number)#used filter because their can be seriese of state of tracking during prepration of single order
    except Exception as e:
        print("Fetching Error:", e)
        return Response(
            {"error": str(e)},
            status=500
        )
    return Response({
        "address":OrderDetailSerializer(order_address).data,
         "order":OrderedFoodDetailSerializer(order,many=True).data,
         "track":FoodOrderTrackingSerializer(tracking,many=True).data
    })
    
@api_view(['POST'])
def update_order_status(request):

    order_number = request.data.get("order_number")
    status = request.data.get("status")
    remark = request.data.get("remark")

    if not order_number or not status:
        return Response(
            {"error": "Order id and status are required"},
            status=400
        )

    try:
        order = Order.objects.filter(order_number=order_number)
             
        # create tracking record
        FoodTracking.objects.create(
            order=order.first(),
            status=status,
            remark=remark
        )

   
        # update final order status in address table
        OrderAddress.objects.filter(
            order_number=order_number
        ).update(order_final_status=status)
       
  
        return Response({
            "msg": "Order status updated successfully"
        })

    except Order.DoesNotExist:
        return Response({
            "error": "Order not found"
        }, status=404)

    except Exception as e:
        print("Update error:", e)

        return Response({
            "error": "Something went wrong"
        }, status=500)

@api_view(['GET'])
def admin_order_search(request):
    query_keyword=request.GET.get('q','')
    try:
        orders =OrderAddress.objects.filter(Q(order_number__icontains=query_keyword))  
        serializer =  OrderSummarySerializer(orders, many=True)
        return Response(serializer.data,status=200)
    except Exception as e:
        print("Search Error",e)
        return Response({"error":str(e)},status=404)

@api_view(["GET", "PUT", "DELETE"])
def manipulate_category(request, category_id):
    try:
        category = Category.objects.get(id=category_id)

        if request.method == "GET":
            serializer = CategorySerializer(category)
            return Response(serializer.data, status=200)

        elif request.method == "PUT":
            serializer = CategorySerializer(category, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "Category Updated Successfully !!"}, status=200)
            else:
                return Response(serializer.errors, status=400)

        elif request.method == "DELETE":
            category.delete()
            return Response({"msg": "Category deleted successfully"}, status=200)

    except Category.DoesNotExist:
        return Response({"error": "Category Does Not Exists"}, status=404)

    except Exception as e:
        print("Manipulation Error", e)
        return Response({"error": str(e)}, status=500)

@api_view(["GET", "PUT", "DELETE"])
def manipulate_food(request, food_id):
    try:
        food = Food.objects.get(id=food_id)

        if request.method == "GET":
            serializer = FoodSerializer(food)
            return Response(serializer.data, status=200)

        elif request.method == "PUT":
            serializer = FoodSerializer(food, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "Food Item Updated Successfully !!"}, status=200)
            else:
                return Response(serializer.errors, status=400)

        elif request.method == "DELETE":
            food.delete()
            return Response({"msg": "Food Item deleted successfully"}, status=200)

    except Food.DoesNotExist:
        return Response({"error": "Food Item Does Not Exists"}, status=404)

    except Exception as e:
        print("Food Manipulation Error", e)
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def get_users(request):
    try:

        users = User.objects.all().order_by("-id")
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data, status=200)

    except Exception as e:
        print("Get Users Error:", e)
        return Response({"error": str(e)}, status=500)



@api_view(["GET", "PUT", "DELETE"])
def manipulate_user(request, user_id):
    try:

        user = User.objects.get(id=user_id)

        if request.method == "GET":

            serializer = UserSerializer(user)
            return Response(serializer.data, status=200)


        elif request.method == "PUT":

            serializer = UserSerializer(user, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response({"msg": "User Updated Successfully"}, status=200)

            else:
                return Response(serializer.errors, status=400)


        elif request.method == "DELETE":

            user.delete()
            return Response({"msg": "User Deleted Successfully"}, status=200)


    except User.DoesNotExist:
        return Response({"error": "User Does Not Exist"}, status=404)

    except Exception as e:
        print("User Manipulation Error:", e)
        return Response({"error": str(e)}, status=500)



@api_view(['GET'])
def dashboard(request):

    current_date = now().date()

    # starting monday date of current week
    starting_day_date_of_week_before_current_date = current_date - timedelta(days=current_date.weekday())

    # starting day of current month
    starting_day_of_current_month = current_date.replace(day=1)

    # starting day and month of current year
    starting_day_and_month_of_current_year = current_date.replace(month=1, day=1)


    def total_sales_calculate(start_date):

        # values_list will return all the order_number values of order_number column
        # of different payment objects in paid_orders variable
        # and flat=True is used because by default values_list will return the list
        # but values in tuples which will be not iterable easily
        # to get values_list values in pure list we use flat=True
        paid_orders = PaymentDetail.objects.filter(
            payment_date__date__gte=start_date
        ).values_list("order_number", flat=True) #used extra __date__ to resolve utc and local time zone warning else payment_date__gte== will also work

        total_order_amount = Order.objects.filter(
            order_number__in=paid_orders  # filters order objects whose order number matches with the order numbers in the paid order list
        ).annotate(  # annotate is used to create new column
            total_purchased_price_per_each_order_number = F('quantity') * F("food__item_price")  
            # F is django.db object that perform arithmetic calculation between table column in database level
        ).aggregate(  # aggregate is also django.db function that contains Sum, Avg, Min, Max and which is performed in database column
            all_orders_sum_till_given_date=Sum("total_purchased_price_per_each_order_number")
        )["all_orders_sum_till_given_date"] or 0.0

        return round(total_order_amount,2) #used round because total can also contain 145.754544 so it cannot be properly shown to round will round that till ._ _ 2 decimal value


    data = {

        "total_orders": OrderAddress.objects.count(),

        "new_orders": OrderAddress.objects.filter(
            order_final_status__isnull=True
        ).count(),

        "confirmed_orders": OrderAddress.objects.filter(
            order_final_status="Order Confirmed"
        ).count(),

        "food_preparing": OrderAddress.objects.filter(
            order_final_status="Food Being Prepared"
        ).count(),

        "food_pickup": OrderAddress.objects.filter(
            order_final_status="Food Pickup"
        ).count(),

        "food_delivered": OrderAddress.objects.filter(
            order_final_status="Food Delivered"
        ).count(),

        "cancelled_orders": OrderAddress.objects.filter(
            order_final_status="Order Cancelled"
        ).count(),

        "total_users": User.objects.count(),

        "total_categories": Category.objects.count(),

        "total_reviews": Review.objects.count(),

        "total_wishlists": Wishlist.objects.count(),

        "week_sales": total_sales_calculate(starting_day_date_of_week_before_current_date),

        "month_sales": total_sales_calculate(starting_day_of_current_month),

        "year_sales": total_sales_calculate(starting_day_and_month_of_current_year),

        "today_sales": total_sales_calculate(current_date)

    }

    return Response(data)

@api_view(['GET'])
def get_montly_sales_summary(request):
    individual_order_calculation = Order.objects.filter(is_order_placed=True).values("order_number").annotate(
        total_price_of_each_order=Coalesce(
            Sum(F("quantity") * F("food__item_price")),
            Decimal("0.00")
        )
    )
    
    #above will return value like individual_order_calculation= [{"order_number":ORD1,"total_price":5500},{"order_number":ORD2,"total_price":6500},] since we are using values not value_list 
    #Note Values will group the mulitple repeating order in to different group  row and annotate will one by perform caluculation of each item in specific group and then sum will add the each group item calculation like total_group1=group1[item1]+group[item2] similary for another group also

    order_price_summary = {
        o["order_number"]: o["total_price_of_each_order"] for o in individual_order_calculation
    }

    #above  will return value like order_price_summary={ "ORD1":5500,"ORD2":6500}[Note:order price summary will contain unique order number with its calculate correponding total price value]

    order_number_with_its_corresponding_month = (
        OrderAddress.objects
        .filter(order_number__in=order_price_summary.keys())
        .annotate(month=TruncMonth('order_time'))
        .values('month', 'order_number')
    )
            
    ''' Get OrderAddress records whose order_number exists in order_price_map
    # TruncMonth extracts only the month part from order_time and then set the current date in date time to intial day i.e 01 day eg:[
    {'month': datetime.date(2026, 3, 1), 'order_number': 'ORD001'},
    {'month': datetime.date(2026, 4, 1), 'order_number': 'ORD002'}]
    Then return only the month and order_number fields '''

    month_with_its_corresponding_sales_value = defaultdict(lambda: Decimal("0.00")) #it refers to the dictionary that stores key as month of the order and value as total purchased price of the order

    for order in order_number_with_its_corresponding_month:
        month_label = order["month"].strftime("%b") #converted the numeric month to actual string month like "jan,feb"
        month_with_its_corresponding_sales_value[month_label] += order_price_summary.get(order["order_number"], Decimal("0.00")) #stored the month lable as key and value as the amount recieved after the += calculation
    
    result = [{"month": month, "sales": total} for month, total in month_with_its_corresponding_sales_value.items()] #created a list with dic containing different month with its respectifves sales values in key and value pair
    return Response(result)


@api_view(['GET'])
def get_top_sold_item(request):
    top_items=Order.objects.filter(is_order_placed=True).values("food__item_name").annotate(total_quantity=Sum("quantity")).order_by("-total_quantity")[:5]
    print(top_items)
    return Response(top_items)
  


@api_view(['GET'])
def get_weekly_sales_summary(request):

    individual_order_calculation = Order.objects.filter(is_order_placed=True).values("order_number").annotate(
        total_price_of_each_order=Coalesce(
            Sum(F("quantity") * F("food__item_price")),
            Decimal("0.00")
        )
    )

    order_price_summary = {
        o["order_number"]: o["total_price_of_each_order"] for o in individual_order_calculation
    }

    order_number_with_its_corresponding_week = (
        OrderAddress.objects
        .filter(order_number__in=order_price_summary.keys())
        .annotate(week=TruncWeek('order_time'))
        .values('week', 'order_number')
    )

    week_with_its_corresponding_sales_value = defaultdict(lambda: Decimal("0.00"))

    for order in order_number_with_its_corresponding_week:
        week_label = order["week"].strftime("Week %W")

        week_with_its_corresponding_sales_value[week_label] += order_price_summary.get(
            order["order_number"], Decimal("0.00")
        )

    result = [
        {"week": week, "sales": total}
        for week, total in week_with_its_corresponding_sales_value.items()
    ]

    return Response(result)


from django.db.models import Count
from django.db.models.functions import TruncWeek

@api_view(['GET'])
def weekly_registered_user(request):

    data = (
        User.objects
        .annotate(week=TruncWeek("reg_date"))
        .values("week")
        .annotate(user_count=Count("id"))
    )

    result = [
        {
            "week": i["week"].strftime("Week %W"),#fetch out the week then convert it to week 09 proper week count format since normmal data.week is contain data like 2026-o4-09
            "new_user": i["user_count"],
        }
        for i in data
    ]

    return Response(result)

@api_view(['POST'])
def add_to_wishlist(request):
    user_id = request.data.get('userId')
    food_id = request.data.get('foodId')

    try:
        if user_id is not None and food_id is not None:
            wishlist, created = Wishlist.objects.get_or_create(
                user_id=user_id,
                food_id=food_id
            )

            if created:
                return Response({'msg': "Added to wishlist"}, status=201)
            else:
                return Response({'msg': "Already in wishlist"}, status=200)

        return Response({'error': 'Invalid data'}, status=400)

    except Exception as e:
        return Response({'error': str(e)}, status=500)
        
@api_view(['POST'])  
def remove_from_wishlist(request):
    print("RAW BODY:", request.body)
    print("PARSED DATA:", request.data)
    user_id = request.data.get('userId')
    food_id = request.data.get('foodId')

    try:
        if user_id is not None and food_id is not None:
            Wishlist.objects.filter(
                user_id=user_id,
                food_id=food_id
            ).delete()

            return Response({'msg': 'Removed from wishlist'}, status=200)

        return Response({'error': 'Invalid data'}, status=400)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def get_wish_list(request,user_id):

    try:
        if user_id is not None:
         list=Wishlist.objects.filter(user_id=user_id)
         serializer=WishListSerializer(list,many=True)
         return Response(serializer.data,status=200)
    except Exception as e:
     return Response({'error':str(e)},status=404)
    
@api_view(['GET'])
def track_order(request,order_number):
    order=Order.objects.filter(order_number=order_number,is_order_placed=True).first()
    if not order:
       return Response({"error":"Orderd not found or not placed yet"},status=404)
    try:
        tracking_history=FoodTracking.objects.filter(order=order)
        serializers=FoodOrderTrackingSerializer(tracking_history,many=True)
        return Response(serializers.data,status=200)
    except Exception as e:
        print("Track Erro",e)
        return Response({"error":str(e)},status=404)

@api_view(['POST'])
def cancel_order(request,order_number):
    remark=request.data.get("remark")

    order_to_be_cancelled=Order.objects.filter(order_number=order_number).first()
    order_address=OrderAddress.objects.get(order_number=order_number)

    try:
        FoodTracking.objects.create(

              order=order_to_be_cancelled,
              remark=remark,
              status= "Order Cancelled",
              order_cancelled_by_user = True,

        )
        order_address.order_final_status="Order Cancelled"
        order_address.save()
        return Response({"msg":"Order Cancelled Successfully"},status=200)
    except Exception as e:
        print("Cancelling Error",e)
        return Response({"error":str(e)},status=404)