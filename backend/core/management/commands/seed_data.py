import os
import random
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from django.contrib.auth.models import User
from core.models import Product, Order, OrderItem, Address, Category, SavedItem, Review
from django.utils import timezone

class Command(BaseCommand):
    help = 'Seeds database using EXISTING local images from media/products'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting Local Media Seed...')

        # 1. Cleanup
        User.objects.exclude(is_superuser=True).delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        Review.objects.all().delete()
        Order.objects.all().delete()

        # 2. Categories
        categories_data = ['Laptops', 'Audio', 'Phones', 'Gaming', 'Accessories', 'Watches']
        categories = {}
        for name in categories_data:
            cat = Category.objects.create(name=name)
            categories[name] = cat

        # 3. Products Mapping (Name, Price, Category, Filename)
        # CORRECTION: Fixed sony_wh-1000xm5.jpg filename
        products_list = [
            ("AirPods Max", 85000, "Audio", "airpods_max.jpg"),
            ("Apple Watch Ultra", 120000, "Watches", "apple-watch-ultra.jpg"),
            ("Asus ROG Zephyrus", 250000, "Laptops", "asus-rog-zephyrus.jpg"),
            ("Bose QC 45", 45000, "Audio", "bose-qc-45.jpg"),
            ("Canon Camera", 150000, "Accessories", "canon_camera.jpg"),
            ("Dell XPS 15", 210000, "Laptops", "dell_xps_15.jpg"),
            ("DJI Mini Drone", 85000, "Accessories", "drone_mini.jpg"),
            ("Galaxy Watch 6", 45000, "Watches", "galaxy-watch-6.jpg"),
            ("Gaming Keyboard", 15000, "Gaming", "gaming_keyboard.jpg"),
            ("Gaming Mouse", 8000, "Gaming", "gaming_mouse.jpg"),
            ("Garmin Fenix 7", 95000, "Watches", "garmin-fenix-7.jpg"),
            ("Google Pixel 8", 110000, "Phones", "google_pixel_8.jpg"),
            ("HP Spectre x360", 185000, "Laptops", "hp-spectre-x360.jpg"),
            ("iPhone 15 Pro", 180000, "Phones", "iphone_15_pro.jpg"),
            ("JBL Flip 6", 12000, "Audio", "jbl-flip-6.jpg"),
            ("Keychron K2", 18000, "Gaming", "keychron-k2-keyboard.jpg"),
            ("Logitech MX Master", 14000, "Accessories", "logitech-mx-master.jpg"),
            ("MacBook Pro 16", 320000, "Laptops", "macbook_pro_16.jpg"),
            ("Marshall Major IV", 22000, "Audio", "marshall-major-iv.jpg"),
            ("Marshall Speaker", 35000, "Audio", "marshall_speaker.jpg"),
            ("Mechanical Watch", 45000, "Watches", "mechanical_watch.jpg"),
            ("Nintendo Switch OLED", 45000, "Gaming", "nintendo-switch-oled.jpg"),
            ("OnePlus 12", 120000, "Phones", "oneplus-12.jpg"),
            ("PS5 Slim", 75000, "Gaming", "ps5-slim.jpg"),
            ("PS5 Controller", 12000, "Gaming", "ps5_controller.jpg"),
            ("Samsung S24 Ultra", 195000, "Phones", "samsung_s24_ultra.jpg"),
            ("Sony WH-1000XM5", 45000, "Audio", "sony_wh-1000xm5.jpg"), # FIXED
            ("Xiaomi 14", 105000, "Phones", "xiaomi-14.jpg"),
        ]

        db_products = []

        for name, price, cat_name, filename in products_list:
            file_path = os.path.join(settings.MEDIA_ROOT, 'products', filename)

            if os.path.exists(file_path):
                prod = Product(
                    name=name,
                    description=f"Authentic {name}. Premium build quality. Includes 1 year warranty.",
                    price=price,
                    category=categories.get(cat_name, categories['Accessories']),
                    stock=random.randint(5, 50),
                    is_featured=random.choice([True, False])
                )

                with open(file_path, 'rb') as f:
                    prod.image.save(filename, File(f), save=True)

                db_products.append(prod)
                self.stdout.write(self.style.SUCCESS(f"Created: {name}"))
            else:
                self.stdout.write(self.style.WARNING(f"File missing: {filename} (Skipping)"))

        # 4. Create Users (15 Personas)
        personas = [
            ("alice", "Alice Admin"), ("bob", "Bob Builder"), ("charlie", "Charlie Chef"),
            ("diana", "Diana Doc"), ("eddie", "Eddie Eng"), ("fiona", "Fiona Fit"),
            ("greg", "Greg Gamer"), ("hannah", "Hannah HR"), ("ian", "Ian IT"),
            ("jane", "Jane Journo"), ("kevin", "Kevin King"), ("lisa", "Lisa Law"),
            ("mike", "Mike Mech"), ("nina", "Nina Nurse"), ("oscar", "Oscar Ops")
        ]

        for username, fullname in personas:
            if User.objects.filter(username=username).exists():
                continue

            fname, lname = fullname.split(' ')
            user = User.objects.create_user(
                username=username,
                email=f"{username}@nova.com",
                password='password123',
                first_name=fname,
                last_name=lname
            )

            Address.objects.create(
                user=user,
                full_name=fullname,
                label="home",
                street=f"{random.randint(1,100)} Moi Avenue",
                city="Nairobi",
                postal_code="00100",
                country="Kenya",
                phone=f"+2547{random.randint(10000000, 99999999)}",
                is_default=True
            )

            if db_products:
                for _ in range(random.randint(1, 3)):
                    order_items = random.sample(db_products, k=random.randint(1, 2))
                    total = sum([float(p.price) for p in order_items])

                    order = Order.objects.create(
                        user=user,
                        status='delivered',
                        total_amount=total,
                        shipping_address="Nairobi",
                        payment_method="mpesa",
                        created_at=timezone.now() - timezone.timedelta(days=random.randint(1, 60))
                    )

                    for item in order_items:
                        OrderItem.objects.create(order=order, product=item, quantity=1, price=item.price)

                        if random.choice([True, False]):
                            Review.objects.create(
                                user=user,
                                product=item,
                                rating=random.randint(4, 5),
                                comment=random.choice(["Excellent!", "Love it.", "Good value."])
                            )

        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@nova.com', 'admin123')

        self.stdout.write(self.style.SUCCESS('Seeding Complete!'))