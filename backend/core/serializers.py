from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Avg
from .models import Product, Category, Order, OrderItem, Address, Review, SavedItem, Profile

class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.CharField(source='avatar_final', read_only=True)

    class Meta:
        model = Profile
        fields = ['avatar', 'bio', 'location']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    # Using serializer method field to be safe
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'profile', 'avatar')

    def get_avatar(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.avatar_final
        return None

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user_name', 'user_avatar', 'rating', 'comment', 'created_at', 'product']
        read_only_fields = ['user', 'product']

    def get_user_avatar(self, obj):
        if hasattr(obj.user, 'profile'):
            return obj.user.profile.avatar_final
        return None

class ProductSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source='category', read_only=True)
    image = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'
        extra_fields = ['category_details']

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return obj.image_url

    def get_rating(self, obj):
        return obj.reviews.aggregate(Avg('rating'))['rating__avg'] or 0

    def get_review_count(self, obj):
        return obj.reviews.count()

class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.CharField(source='product.image_final', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_name', 'product_image', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'total_amount', 'shipping_address', 'payment_method', 'items', 'created_at']
        read_only_fields = ['user', 'created_at', 'status']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'id', 'full_name', 'label', 'street',
            'city', 'postal_code', 'country',
            'phone', 'is_default'
        ]
        read_only_fields = ['user']

class SavedItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = SavedItem
        fields = ['id', 'product', 'product_details', 'created_at']
        read_only_fields = ['user', 'created_at']