from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    ProductViewSet, CategoryViewSet, OrderViewSet, AddressViewSet,
    ReviewViewSet, SavedItemViewSet, AdminUserViewSet, AdminOrderViewSet,
    AdminAnalyticsView, CurrentUserView, PurchasedProductsView, RegisterView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

# Router Config
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
    # Main API Router
    path('api/', include(router.urls)),

    # Authentication Endpoints (Restored)
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Login
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/users/me/', CurrentUserView.as_view(), name='current-user'),

    # Custom Views
    path('api/admin/analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('api/purchased-products/', PurchasedProductsView.as_view(), name='purchased-products'),

    path('api/auth-browsable/', include('rest_framework.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)