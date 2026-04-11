import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.database import SessionLocal, engine, Base
from models.car import Car
from models.review import Review
from models.user import User

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Tozalash
db.query(Review).delete()
db.query(Car).delete()
db.commit()

cars_data = [
    # --- CHEVROLET (UZBEKISTAN STAPLES) ---
    {
        "name": "Cobalt GX-Style", "brand": "Chevrolet", "category": "Sedan", "year": 2024, "price_per_day": 350000,
        "image_url": "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80", # White sedan
        "description": "O'zbekistondagi eng ommabop oilaviy sedan. Tejamkor va ishonchli."
    },
    {
        "name": "Gentra (Lacetti) L-Style", "brand": "Chevrolet", "category": "Sedan", "year": 2023, "price_per_day": 400000,
        "image_url": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80", # White luxury sedan look
        "description": "Yumshoq yurish va keng salon. Lyuks komplektatsiya."
    },
    {
        "name": "Damas Deluxe", "brand": "Chevrolet", "category": "Minivan", "year": 2024, "price_per_day": 250000,
        "image_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8df0?w=800&q=80", # White microvan look
        "description": "Kichik biznes va yuk tashish uchun ajralmas yordamchi."
    },
    {
        "name": "Malibu 2 XL Turbo", "brand": "Chevrolet", "category": "Premium", "year": 2023, "price_per_day": 800000,
        "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80", # Black business sedan
        "description": "Premium klassdagi biznes sedan. Tezlik va qulaylik uyg'unligi."
    },
    {
        "name": "Tracker 2 Redline", "brand": "Chevrolet", "category": "Krossover", "year": 2024, "price_per_day": 550000,
        "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80", # Modern red SUV
        "description": "Ixcham va zamonaviy krossover. Shahar ichida va tog'li yo'llarda qulay."
    },
    {
        "name": "Onix Premier", "brand": "Chevrolet", "category": "Sedan", "year": 2024, "price_per_day": 450000,
        "image_url": "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800&q=80", # Modern white sedan
        "description": "Yangi avlod sedani. Yuqori texnologiyalar va xavfsizlik."
    },
    {
        "name": "Tahoe Premier", "brand": "Chevrolet", "category": "SUV", "year": 2024, "price_per_day": 2500000,
        "image_url": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80", # Black Tahoe
        "description": "Haqiqiy yo'ltanlamas. VIP delegatsiyalar va oilaviy sayohatlar uchun."
    },
    {
        "name": "Equinox", "brand": "Chevrolet", "category": "SUV", "year": 2023, "price_per_day": 900000,
        "image_url": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80", # White SUV
        "description": "Krossoverlar ichida eng baquvvati. Shahardan tashqari yo'llar uchun."
    },

    # --- BYD (MODERN EV ERA) ---
    {
        "name": "BYD Song Plus EV", "brand": "BYD", "category": "Hala", "year": 2024, "price_per_day": 1200000,
        "image_url": "https://images.unsplash.com/photo-1662499116742-df2944b58c7e?w=800&q=80", # White EV SUV
        "description": "O'zbekistonda eng ommabop elektr krossover. 500 km+ masofa."
    },
    {
        "name": "BYD Chazor (Destroyer 05)", "brand": "BYD", "category": "PHEV", "year": 2023, "price_per_day": 650000,
        "image_url": "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800&q=80", # Modern hybrid sedan
        "description": "Gibrid texnologiyasi bilan yoqilg'ini maksimal tejash."
    },
    {
        "name": "BYD Han", "brand": "BYD", "category": "Premium", "year": 2024, "price_per_day": 2000000,
        "image_url": "https://images.unsplash.com/photo-1617788131775-f55e00315ce3?w=800&q=80", # Grey premium EV
        "description": "O'ta hashamatli elektr sedan. Tezlik va futurizm."
    },

    # --- KIA & HYUNDAI ---
    {
        "name": "Kia K5 GT-Line", "brand": "Kia", "category": "Sporty", "year": 2023, "price_per_day": 950000,
        "image_url": "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80", # Black sporty sedan
        "description": "Agressiv dizayn va sport rejimli kuchli motor."
    },
    {
        "name": "Kia Sportage", "brand": "Kia", "category": "SUV", "year": 2024, "price_per_day": 1100000,
        "image_url": "https://images.unsplash.com/photo-1615632462610-d8816c4987a0?w=800&q=80", # Modern white SUV
        "description": "Sifat va qulaylikni sevuvchilar uchun zamonaviy SUV."
    },
    {
        "name": "Kia Carnival VIP", "brand": "Kia", "category": "Minivan", "year": 2024, "price_per_day": 1800000,
        "image_url": "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80", # Premium black van
        "description": "7 kishilik VIP salon. Biznes uchrashuvlar uchun ideal."
    },
    {
        "name": "Hyundai Elantra", "brand": "Hyundai", "category": "Sedan", "year": 2023, "price_per_day": 600000,
        "image_url": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80", # White sleek sedan
        "description": "O'ziga xos dizayn va juda qulay boshqaruv."
    },
    {
        "name": "Hyundai Tucson", "brand": "Hyundai", "category": "SUV", "year": 2024, "price_per_day": 1050000,
        "image_url": "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80", # Grey SUV
        "description": "Ko'p qirrali krossover. Har qanday yo'l sharoitiga mos."
    },

    # --- PREMIUM & LUXURY (VIP) ---
    {
        "name": "Mercedes-Benz G-Class", "brand": "Mercedes", "category": "VIP", "year": 2023, "price_per_day": 6000000,
        "image_url": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80", # Black G-Wagon
        "description": "Afsonaviy Gelendvagen. Maksimal dabdaba va obro'."
    },
    {
        "name": "BMW X7 M-Package", "brand": "BMW", "category": "Luxury", "year": 2024, "price_per_day": 5500000,
        "image_url": "https://images.unsplash.com/photo-1556110080-ee8fc69a84a6?w=800&q=80", # Black luxury SUV
        "description": "Nemis muhandisligi durdonasi. 7 kishilik lyuks krossovers."
    },
    {
        "name": "Toyota Prado 150", "brand": "Toyota", "category": "Off-road", "year": 2023, "price_per_day": 1500000,
        "image_url": "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800&q=80", # White LC Prado
        "description": "Chidamlilik ramzi. Tog'li hududlar uchun eng yaxshi tanlov."
    },
    {
        "name": "Toyota Camry V75", "brand": "Toyota", "category": "Premium", "year": 2023, "price_per_day": 1100000,
        "image_url": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80", # Black Camry
        "description": "Afsonaviy kashfiyot. Ofis xodimlari va biznesmenlar ishongan mashina."
    },
    {
        "name": "Jetour Dashing", "brand": "Jetour", "category": "Future", "year": 2024, "price_per_day": 750000,
        "image_url": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80", # Futuristic grey SUV
        "description": "Yangi avlod dizayni va smart texnologiyalar."
    },
    {
        "name": "Chery Tiggo 7 Pro", "brand": "Chery", "category": "Krossover", "year": 2023, "price_per_day": 600000,
        "image_url": "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80", # White SUV
        "description": "Zamonaviy dizayn va boy jihozlanish."
    },
    {
        "name": "Tesla Model Y", "brand": "Tesla", "category": "EV", "year": 2024, "price_per_day": 2200000,
        "image_url": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80", # White Tesla Model Y
        "description": "Dunyodagi eng ko'p sotilayotgan elektromobil."
    },
    {
        "name": "Lada Vesta SW Cross", "brand": "Lada", "category": "Universal", "year": 2022, "price_per_day": 300000,
        "image_url": "https://images.unsplash.com/photo-1616422285623-13ff0167c95c?w=800&q=80", # White wagon
        "description": "Baland klirens va amaliy universal."
    },
    {
        "name": "Volkswagen ID.4 Crozz", "brand": "Volkswagen", "category": "EV", "year": 2024, "price_per_day": 1300000,
        "image_url": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80", # White EV SUV
        "description": "Nemis elektr muhandisligi. O'zbekistonda ommabop EV."
    }
]

for c in cars_data:
    db.add(Car(**c))
db.commit()

# Haqiqiy userlarni olish
user = db.query(User).filter(User.email == "user@smartcar.uz").first()
uid = user.id if user else 1
cars = db.query(Car).all()

# Har xil mashinalar uchun har xil sharhlar
review_texts = [
    "Mashina holati a'lo darajada! Hech qanday muammo bo'lmadi.",
    "Juda qulay va toza salon. Keyingi safar ham albatta shu yerdan olaman.",
    "Narxi va sifati mos keladi. AI tavsiyasi to'g'ri chiqdi.",
    "Adminlar juda muloyim va tezkor xizmat ko'rsatishdi.",
    "Oila uchun eng yaxshi tanlov bo'ldi. Rahmat!"
]

for i in range(15):
    car_idx = i % len(cars)
    text_idx = i % len(review_texts)
    db.add(Review(
        car_id=cars[car_idx].id, 
        user_id=uid, 
        user_name=f"Mijoz_{i+1}", 
        rating=4 + (i % 2), 
        comment=review_texts[text_idx]
    ))

db.commit()
db.close()
print(f"🚀 25 ta O'zbekistonga xos avtomobil va 15 ta sharh muvaffaqiyatli yuklandi!")
