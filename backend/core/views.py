from django.shortcuts import render
from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db.models import Sum
from .models import Product, Category, Order, OrderItem, Address, Review, SavedItem, Profile
from .serializers import (
    ProductSerializer, CategorySerializer, OrderSerializer,
    AddressSerializer, ReviewSerializer, UserSerializer,
    RegisterSerializer, SavedItemSerializer
)

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        except Exception:
            return Response({"detail": "User not found"}, status=404)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        # Explicitly allow any access to list and retrieve
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavedItemViewSet(viewsets.ModelViewSet):
    serializer_class = SavedItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.request.query_params.get('product')
        if product_id:
            return Review.objects.filter(product_id=product_id)
        return Review.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        product_id = self.request.data.get('product')
        product = Product.objects.get(id=product_id)
        serializer.save(user=self.request.user, product=product)

class PurchasedProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Products from delivered orders that haven't been reviewed yet?
        # For now, just all purchased products
        purchased_ids = OrderItem.objects.filter(
            order__user=self.request.user
        ).values_list('product_id', flat=True).distinct()

        return Product.objects.filter(id__in=purchased_ids)

# --- Admin Views ---

class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminOrderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminAnalyticsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_revenue = Order.objects.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_orders = Order.objects.count()
        total_customers = User.objects.count()
        recent_orders = Order.objects.order_by('-created_at')[:5]

        recent_orders_data = OrderSerializer(recent_orders, many=True).data

        return Response({
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'total_customers': total_customers,
            'recent_orders': recent_orders_data
        })