import random
import requests
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import Product, Category, Order, OrderItem, Address, Review
from django.core.files.base import ContentFile
from django.utils.text import slugify
from faker import Faker
from django.utils import timezone

fake = Faker()

class Command(BaseCommand):
    help = 'Seeds database with Fixed Users and Real Products'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting Data Population...')

        # 1. CLEANUP (Wipe everything to start fresh)
        self.stdout.write('Wiping old data...')
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        Review.objects.all().delete()
        Address.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        User.objects.all().delete() # Delete ALL users to ensure clean slate

        # 2. CREATE CATEGORIES
        cats_config = [
            {'name': 'Laptops', 'img': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'},
            {'name': 'Smartphones', 'img': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'},
            {'name': 'Audio', 'img': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'},
            {'name': 'Accessories', 'img': 'https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=800&q=80'},
            {'name': 'Wearables', 'img': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'},
            {'name': 'Gaming', 'img': 'https://images.unsplash.com/photo-1593305841991-05c29736ce37?w=800&q=80'},
        ]

        categories = {}
        for c in cats_config:
            cat = Category.objects.create(name=c['name'])
            categories[c['name']] = cat

        self.stdout.write(f'Created {len(categories)} categories.')

        # 3. CREATE FIXED TEST USERS
        fixed_users = [
            {'user': 'client1', 'email': 'client1@nova.com', 'pass': 'password123', 'f': 'John', 'l': 'Kamau', 'staff': False},
            {'user': 'client2', 'email': 'client2@nova.com', 'pass': 'password123', 'f': 'Alice', 'l': 'Wanjiku', 'staff': False},
            {'user': 'client3', 'email': 'client3@nova.com', 'pass': 'password123', 'f': 'Bob', 'l': 'Ochieng', 'staff': False},
            {'user': 'client4', 'email': 'client4@nova.com', 'pass': 'password123', 'f': 'Sarah', 'l': 'Chebet', 'staff': False},
            {'user': 'admin', 'email': 'admin@nova.com', 'pass': 'admin123', 'f': 'Super', 'l': 'Admin', 'staff': True},
        ]

        created_users = []
        for u in fixed_users:
            user = User.objects.create_user(
                username=u['user'],
                email=u['email'],
                password=u['pass'],
                first_name=u['f'],
                last_name=u['l'],
                is_staff=u['staff'],
                is_superuser=u['staff']
            )
            created_users.append(user)

            # Add Address
            Address.objects.create(
                user=user,
                street=f"{random.randint(1,100)} {fake.street_name()}",
                city='Nairobi',
                phone=f"+2547{random.randint(10000000, 99999999)}",
                is_default=True
            )

        self.stdout.write(f'Created {len(created_users)} fixed users.')

        # 4. CREATE PRODUCTS
        def get_image_content(url):
            try:
                res = requests.get(url, timeout=15) # Increased timeout
                if res.status_code == 200:
                    return ContentFile(res.content)
            except Exception as e:
                print(f"Failed to download {url}: {e}")
            return None

        product_templates = [
            ('MacBook Pro M3', 'Laptops', 250000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80'),
            ('Dell XPS 15', 'Laptops', 210000, 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800&q=80'),
            ('iPhone 15 Pro Max', 'Smartphones', 205000, 'https://images.unsplash.com/photo-1695048180490-096876fe83c9?w=800&q=80'),
            ('Samsung S24 Ultra', 'Smartphones', 190000, 'https://images.unsplash.com/photo-1610945265078-d86f3d297df5?w=800&q=80'),
            ('Sony WH-1000XM5', 'Audio', 55000, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80'),
            ('AirPods Pro 2', 'Audio', 35000, 'https://images.unsplash.com/photo-1603351154351-5cf2330815f1?w=800&q=80'),
            ('JBL Flip 6', 'Audio', 15000, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'),
            ('Apple Watch Ultra', 'Wearables', 130000, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80'),
            ('PS5 Slim', 'Gaming', 75000, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80'),
            ('Logitech MX Master', 'Accessories', 14000, 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=800&q=80'),
        ]

        # Generate 40 products
        all_products = []
        for i in range(40):
            template = product_templates[i % len(product_templates)]
            name = template[0] if i < len(product_templates) else f"{template[0]} (Ver. {i})"

            p = Product(
                name=name,
                category=categories[template[1]],
                price=template[2],
                description=fake.paragraph(nb_sentences=3),
                stock=random.randint(2, 50),
                is_featured=random.choice([True, False])
            )

            self.stdout.write(f"Downloading image for {name}...")
            img_content = get_image_content(template[3])

            if img_content:
                p.image.save(f"{slugify(name)}.jpg", img_content, save=True)
            else:
                p.save() # Save without image if fails

            all_products.append(p)

        self.stdout.write(f'Created {len(all_products)} products.')

        # 5. ORDERS
        self.stdout.write('Creating orders...')
        for _ in range(50):
            u = random.choice(created_users)
            o = Order.objects.create(
                user=u,
                status=random.choice(['pending', 'shipped', 'delivered']),
                total_amount=0,
                shipping_address="Nairobi Test Address",
                phone_number="+254700000000",
                created_at=timezone.now()
            )

            total = 0
            for _ in range(random.randint(1, 3)):
                prod = random.choice(all_products)
                OrderItem.objects.create(order=o, product=prod, quantity=1, price=prod.price)
                total += prod.price

            o.total_amount = total
            o.save()

        self.stdout.write(self.style.SUCCESS('Data Seeding Completed!'))