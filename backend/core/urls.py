from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, CategoryViewSet, OrderViewSet, AddressViewSet,
    ReviewViewSet, SavedItemViewSet, AdminUserViewSet, AdminOrderViewSet,
    AdminAnalyticsView, CurrentUserView, PurchasedProductsView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'saved-items', SavedItemViewSet, basename='saved-item')
router.register(r'admin/customers', AdminUserViewSet, basename='admin-customers')
router.register(r'admin/orders', AdminOrderViewSet, basename='admin-orders')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/users/me/', CurrentUserView.as_view(), name='current-user'),
    path('admin/analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('purchased-products/', PurchasedProductsView.as_view(), name='purchased-products'),
]