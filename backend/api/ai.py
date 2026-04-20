from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import re
from core.database import get_db
from models.car import Car
from models.booking import Booking
from models.document import Document
from models.user import User

router = APIRouter()

# ──────────────────────────────────────────────
#  Yordamchi: Buyruqdan mashina topish
# ──────────────────────────────────────────────
def find_car_in_cmd(cmd: str, db: Session):
    """Buyruq ichidan mashina nomini topadi."""
    cars = db.query(Car).all()
    for c in cars:
        if c.name.lower() in cmd or c.brand.lower() in cmd:
            return c
    return None

# ──────────────────────────────────────────────
#  Chatbot (foydalanuvchi uchun)
# ──────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def ai_chat(req: ChatRequest, db: Session = Depends(get_db)):
    msg = req.message.lower().strip()
    all_cars  = db.query(Car).all()
    avail     = [c for c in all_cars if c.is_available]

    # ── SALOMLASHISH ──────────────────────────────────────────
    GREET = ["salom", "assalom", "hi", "hello", "hey", "xayr", "yaxshimisiz"]
    if any(k in msg for k in GREET):
        return {"reply": "Assalomu alaykum! 👋 SmartCar AI yordamchisiman.\n\nSizga qanday yordam bera olaman?\n• 🚗 Mashina tanlash\n• 💰 Narxlar haqida\n• 📋 Bron qilish tartibi\n• 🔧 Texnik ma'lumotlar\n\nShunchaki so'rang!"}

    # ── XAYR / RAHMAT ─────────────────────────────────────────
    BYE = ["xayr", "ko'rishguncha", "rahmat", "tashakkur", "yaxshi bo'ling"]
    if any(k in msg for k in BYE):
        return {"reply": "Xayr! 😊 SmartCar'dan foydalanganingiz uchun rahmat. Yana keladigan bo'lsangiz, doim xizmatdamiz! 🚗"}

    # ── NECHA MASHINA BAR ─────────────────────────────────────
    COUNT = ["nechta", "qancha", "nechta mashina", "nechta avto", "soni", "jami"]
    if any(k in msg for k in COUNT):
        return {"reply": f"🚗 Hozirda bazamizda jami **{len(all_cars)} ta** avtomobil bor.\nUlardan **{len(avail)} tasi** hozir ijaraga mavjud, **{len(all_cars)-len(avail)} tasi** band."}

    # ── MAVJUD MASHINALAR ─────────────────────────────────────
    AVAIL = ["mavjud", "bo'sh", "ijaraga olsa bo'ladi", "qaysilari bor", "free", "available"]
    if any(k in msg for k in AVAIL):
        if not avail:
            return {"reply": "😔 Afsuski, hozirda barcha mashinalarimiz band. Tez orada yangilari qo'shiladi!"}
        sample = avail[:4]
        lines = "\n".join([f"  • {c.brand} {c.name} ({c.year}) — {c.price_per_day:,.0f} so'm/kun" for c in sample])
        more = f"\n  ...va yana {len(avail)-4} ta" if len(avail) > 4 else ""
        return {"reply": f"✅ Hozir ijaraga mavjud **{len(avail)} ta** avtomobil:\n{lines}{more}\n\nBatafsil katalog uchun /user/cars sahifasiga o'ting!"}

    # ── ENG ARZON ─────────────────────────────────────────────
    CHEAP = ["arzon", "ekonom", "budget", "tejamkor", "kam pul", "narxi past", "qimmat emas", "arzonga"]
    if any(k in msg for k in CHEAP):
        if not avail:
            return {"reply": "Hozirda bo'sh mashinalarimiz yo'q. Birozdan keyin qaytib ko'ring!"}
        top3 = sorted(avail, key=lambda x: x.price_per_day)[:3]
        lines = "\n".join([f"  {i+1}. {c.brand} {c.name} — **{c.price_per_day:,.0f} so'm/kun**" for i, c in enumerate(top3)])
        return {"reply": f"💰 Eng arzon 3 ta variant:\n{lines}\n\nBularning barchasi hozir bo'sh va tayyor!"}

    # ── ENG QIMMAT / PREMIUM ──────────────────────────────────
    PREM = ["premium", "qimmat", "lyuks", "luxury", "vip", "hashamat", "biznes", "eng yaxshi"]
    if any(k in msg for k in PREM):
        top3 = sorted(avail, key=lambda x: x.price_per_day, reverse=True)[:3]
        if not top3:
            return {"reply": "Premium mashinalarimiz hozirda band. Tez orada bo'shaydi!"}
        lines = "\n".join([f"  {i+1}. {c.brand} {c.name} — **{c.price_per_day:,.0f} so'm/kun** ⭐" for i, c in enumerate(top3)])
        return {"reply": f"👑 Premium sinfdagi eng zo'r mashinalarimiz:\n{lines}\n\nSifat va qulaylik kafolatlangan!"}

    # ── OILAVIY ───────────────────────────────────────────────
    FAMILY = ["oilaviy", "oila", "bola", "yirik", "katta salon", "kengroq", "7 kishilik", "minivan"]
    if any(k in msg for k in FAMILY):
        fam = [c for c in avail if c.category in ["Krossover", "SUV", "Minivan", "Off-road"]]
        if fam:
            c = fam[0]
            return {"reply": f"👨‍👩‍👧‍👦 Oilaviy sayohatlar uchun eng yaxshi tavsiyam:\n\n🚙 **{c.brand} {c.name}** ({c.year})\n💰 Kunlik: {c.price_per_day:,.0f} so'm\n📦 Keng salon, yuqori klirens\n\nBatafsil ma'lumot va bron uchun katalogga o'ting!"}
        return {"reply": "SUV va krossovеrlarimiz hozirda band. Lekin tez orada yangilari keladi!"}

    # ── SPORT / TEZ ───────────────────────────────────────────
    SPORT = ["sport", "tez", "uchuvchi", "gaz", "kuchli", "shiddatli", "racing", "turbo"]
    if any(k in msg for k in SPORT):
        sp = [c for c in avail if c.category in ["Premium", "Sporty", "Sport"]]
        if sp:
            c = sp[0]
            return {"reply": f"🏎️ Tezlik va adrenalinga oshiq bo'lsangiz:\n\n⚡ **{c.brand} {c.name}** ({c.year})\n💰 Kunlik: {c.price_per_day:,.0f} so'm\n\nBu mashina sizni hayajontantirishiga kafilman!"}
        return {"reply": "Sport mashinalarimiz hozir ijarada. Boshqa kategoriyalardan birini ko'rib chiqing!"}

    # ── ELEKTR / EV ───────────────────────────────────────────
    EV = ["elektr", "ev", "electric", "zaryadla", "eco", "hybrid", "gibrid", "byd", "tesla"]
    if any(k in msg for k in EV):
        ev_cars = [c for c in avail if c.category in ["EV", "PHEV", "Hybrid"] or c.brand in ["BYD", "Tesla", "Volkswagen"]]
        if ev_cars:
            c = ev_cars[0]
            return {"reply": f"⚡ Ekologik toza elektr avtomobillarimiz:\n\n🔋 **{c.brand} {c.name}** ({c.year})\n💰 Kunlik: {c.price_per_day:,.0f} so'm\n🌱 Benzin sarfi: 0 litr!\n\nKelajakni bugun boshdan kechiring!"}
        return {"reply": "Elektr mashinalarimiz hozir ijarada. Tez orada qaytib kelishadi!"}

    # ── NARX SO'RASH ──────────────────────────────────────────
    PRICE = ["narx", "pul", "qancha turadi", "necha so'm", "cost", "price", "tariflar", "kunlik"]
    if any(k in msg for k in PRICE):
        if not avail:
            return {"reply": "Hozirda bo'sh mashinalarimiz yo'q."}
        cheapest = sorted(avail, key=lambda x: x.price_per_day)
        mn, mx = cheapest[0], cheapest[-1]
        return {"reply": f"💵 Narxlar diapazoni:\n\n📉 Eng arzon: **{mn.price_per_day:,.0f} so'm/kun** ({mn.brand} {mn.name})\n📈 Eng qimmat: **{mx.price_per_day:,.0f} so'm/kun** ({mx.brand} {mx.name})\n\nO'rtacha: **{sum(c.price_per_day for c in avail)/len(avail):,.0f} so'm/kun**\n\nAniqlashtirilgan narxlar uchun katalogdan mashina tanlang!"}

    # ── BRON QILISH ───────────────────────────────────────────
    BOOK = ["bron", "qanday olsa bo'ladi", "bron qilish", "ijara", "olmoqchi", "book", "rezerv", "zakazla"]
    if any(k in msg for k in BOOK):
        return {"reply": "📋 Mashina bron qilish tartibi:\n\n1️⃣ Ro'yxatdan o'ting yoki tizimga kiring\n2️⃣ /user/cars sahifasidan mashina tanlang\n3️⃣ Sanalarni belgilang va «Bron» tugmani bosing\n4️⃣ To'lov qiling (Karta yoki naqd)\n5️⃣ Shartnoma elektron imzolanadi\n\n⏱️ Butun jarayon 5 daqiqa!"}

    # ── HUJJAT / TALAB ────────────────────────────────────────
    DOC = ["hujjat", "guvohnoma", "pasport", "id", "nima kerak", "talab", "shart", "kyc"]
    if any(k in msg for k in DOC):
        return {"reply": "📄 Ijara uchun talab qilinadigan hujjatlar:\n\n✅ Pasport (shaxsni tasdiqlovchi)\n✅ Xaydovchilik guvohnomasi (haydovchi uchun)\n✅ Hujjatlarni tizimga yuklang — 5 daqiqada tasdiqlash\n\nHujjatlar tasdiqlangach, istalgan mashinani bron qilishingiz mumkin!"}

    # ── TO'LOV ────────────────────────────────────────────────
    PAY = ["to'lov", "payme", "click", "karta", "naqd", "qanday to'lanadi", "payment"]
    if any(k in msg for k in PAY):
        return {"reply": "💳 To'lov usullari:\n\n💳 Plastik karta (Visa/Mastercard/UzCard)\n📱 PayMe va Click orqali\n💵 Naqd pul (ofisda)\n\nBarcha to'lovlar xavfsiz shifrlangan kanal orqali amalga oshiriladi!"}

    # ── YO'L / SHAHAR ─────────────────────────────────────────
    ROAD = ["toshkent", "samarqand", "buxoro", "farg'ona", "shahar", "xiva", "shahardagi", "yo'l", "safar", "trip"]
    if any(k in msg for k in ROAD):
        sedan = [c for c in avail if c.category in ["Sedan", "Comfort"]]
        if sedan:
            c = sedan[0]
            return {"reply": f"🗺️ Shaharlararo sayohat uchun zo'r tanlov:\n\n🚗 **{c.brand} {c.name}** — qulay, tejamkor va ishonchli!\n💰 Kunlik: {c.price_per_day:,.0f} so'm\n\nUzoq safarlar uchun ham ko'p kunlik ijara chegirmalarimiz bor!"}
        return {"reply": "Shaharlararo sayohat uchun mashinalarimiz hozir band. Birozdan keyin qaytib ko'ring!"}

    # ── TOG' / OFFROAD ────────────────────────────────────────
    OFF = ["tog'", "offroad", "off-road", "qiyalik", "tosh yo'l", "jeep", "prado", "suv"]
    if any(k in msg for k in OFF):
        off = [c for c in avail if c.category in ["Off-road", "SUV", "Krossover"]]
        if off:
            c = off[0]
            return {"reply": f"⛰️ Og'ir yo'llar uchun kuchli mashina:\n\n🏔️ **{c.brand} {c.name}** ({c.year})\n💰 Kunlik: {c.price_per_day:,.0f} so'm\n🔒 Yuqori klirens va 4WD — har qanday yo'lda ishonchli!\n\nBu mashina siz uchun!"}
        return {"reply": "Offroad mashinalarimiz hozir ijarada. Tez orada yangilari keladi!"}

    # ── YORDAM / IMKONIYATLAR ─────────────────────────────────
    HELP = ["yordam", "help", "nima qila olasan", "nima bilasan", "savol", "imkoniyat"]
    if any(k in msg for k in HELP):
        return {"reply": "🤖 Men quyidagi savollarga javob bera olaman:\n\n🚗 Mashina tanlab berish\n💰 Narxlar va chegirmalar\n📋 Bron qilish tartibi\n📄 Kerakli hujjatlar\n💳 To'lov usullari\n⛽ Elektr va gibrid mashinalar\n👨‍👩‍👧 Oilaviy avtomobillar\n🏎️ Sport mashinalar\n⛰️ Offroad mashinalar\n\nShunchaki so'rang, yordam beraman!"}

    # ── KATEGORIYA SO'RASH ────────────────────────────────────
    CAT = ["kategoriya", "tur", "sedan", "krossover", "minivan", "universal"]
    if any(k in msg for k in CAT):
        cats = {}
        for c in avail:
            cats[c.category] = cats.get(c.category, 0) + 1
        lines = "\n".join([f"  • {cat}: {cnt} ta" for cat, cnt in sorted(cats.items())])
        return {"reply": f"📊 Hozir mavjud kategoriyalar:\n{lines}\n\nQaysi kategoriya siz uchun qiziqarliroq?"}

    # ── BITTA MASHINA HAQIDA SO'RASH ──────────────────────────
    for c in all_cars:
        if c.name.lower() in msg or c.brand.lower() in msg:
            status = "✅ Hozir mavjud" if c.is_available else "❌ Hozir band"
            return {"reply": f"🚗 **{c.brand} {c.name}** ({c.year}) haqida:\n\n💰 Kunlik narx: **{c.price_per_day:,.0f} so'm**\n📁 Kategoriya: {c.category}\n📊 Holati: {status}\n\n{c.description or ''}\n\nBron qilish uchun katalogdan bu mashinani tanlang!"}

    # ── DEFAULT ───────────────────────────────────────────────
    tips = [
        "arzon mashinalar", "premium avtomobillar", "oilaviy mashina",
        "elektr mashina", "bron qilish tartibi", "to'lov usullari"
    ]
    import random
    tip = random.choice(tips)
    return {"reply": f"🤔 Savolingizni tushunmadim. Quyidagi mavzulardan birida savol bering:\n\n  • «{tip}» kabi yozib ko'ring\n  • Yoki konkret mashina nomini ayting\n\nYordam kerak bo'lsa «yordam» deb yozing! 😊"}




# ──────────────────────────────────────────────
#  AI Agent (admin uchun)
# ──────────────────────────────────────────────
class AgentRequest(BaseModel):
    command: str

@router.post("/agent")
def ai_agent_command(req: AgentRequest, db: Session = Depends(get_db)):
    cmd = req.command.lower().strip()

    # ── 1. STATISTIKA ─────────────────────────────────────
    STAT_KEYS = ["statistika", "hisobot", "nechta", "jami", "umumiy", "stats", "report", "ko'rsat", "dashboard", "ma'lumot ber", "malumot ber", "qancha", "sanoq"]
    if any(k in cmd for k in STAT_KEYS):
        total_cars      = db.query(Car).count()
        available_cars  = db.query(Car).filter(Car.is_available == True).count()
        busy_cars       = total_cars - available_cars
        total_users     = db.query(User).count()
        total_bookings  = db.query(Booking).count()
        pending_books   = db.query(Booking).filter(Booking.status == "pending").count()
        confirmed_books = db.query(Booking).filter(Booking.status == "confirmed").count()
        cancelled_books = db.query(Booking).filter(Booking.status == "cancelled").count()
        pending_docs    = db.query(Document).filter(Document.status == "pending").count()
        verified_docs   = db.query(Document).filter(Document.status == "verified").count()

        msg = (
            f"📊 SmartCar AI Statistikasi:\n"
            f"🚗 Mashinalar: {total_cars} ta (mavjud: {available_cars}, band: {busy_cars})\n"
            f"👥 Foydalanuvchilar: {total_users} ta\n"
            f"📋 Bronlar: jami {total_bookings} ta "
            f"(kutilayotgan: {pending_books}, tasdiqlangan: {confirmed_books}, bekor: {cancelled_books})\n"
            f"📄 Hujjatlar: tekshirilmagan {pending_docs} ta, tasdiqlangan {verified_docs} ta"
        )
        return {"success": True, "message": msg}

    # ── 2. FOYDALANUVCHI MA'LUMOTLARI ────────────────────
    USER_KEYS = ["user", "foydalanuvchi", "mijoz", "ro'yxat", "royxat", "kimlar", "profil", "a'zolar", "azolar", "members", "userlar", "users"]
    if any(k in cmd for k in USER_KEYS):
        users = db.query(User).all()
        if not users:
            return {"success": True, "message": "Hozirda ro'yxatdan o'tgan foydalanuvchi yo'q."}
        lines = [f"👥 Jami {len(users)} ta foydalanuvchi:"]
        for u in users[:10]:  # maksimal 10 ta ko'rsatamiz
            lines.append(f"  • [{u.role.upper()}] {u.full_name} — {u.email} | Tel: {u.phone or 'yo\'q'}")
        if len(users) > 10:
            lines.append(f"  ... va yana {len(users)-10} ta foydalanuvchi.")
        return {"success": True, "message": "\n".join(lines)}

    # ── 3. MASHINA RO'YXATI ───────────────────────────────
    CAR_LIST_KEYS = ["mashinalar ro'yxati", "avtomobillar ro'yxati", "parkim", "fleet", "hammasini ko'rsat", "avtomobillar", "barcha mashinalar", "mashinalar soni", "cars list", "mashina listi"]
    if any(k in cmd for k in CAR_LIST_KEYS) and "narx" not in cmd:
        cars = db.query(Car).all()
        if not cars:
            return {"success": True, "message": "Bazada hech qanday mashina yo'q."}
        lines = [f"🚗 Jami {len(cars)} ta avtomobil:"]
        for c in cars:
            status = "✅ Mavjud" if c.is_available else "❌ Band"
            lines.append(
                f"  • {c.brand} {c.name} ({c.year}) — {c.price_per_day:,.0f} so'm/kun | {c.category} | {status}"
            )
        return {"success": True, "message": "\n".join(lines)}

    # ── 3.1. BAND MASHINALAR ────────────────────────────────
    BUSY_KEYS = ["band mashinalar", "ijaradagi mashinalar", "ijarada", "busy cars", "qaysilari band", "band bo'lgan"]
    if any(k in cmd for k in BUSY_KEYS):
        busy_cars = db.query(Car).filter(Car.is_available == False).all()
        if not busy_cars:
            return {"success": True, "message": "Hozirda hamma mashinalar bo'sh, band mashina yo'q."}
        lines = [f"❌ Hozirda band bo'lgan {len(busy_cars)} ta mashina:"]
        for c in busy_cars:
            lines.append(f"  • {c.brand} {c.name} ({c.year}) — {c.price_per_day:,.0f} so'm/kun | {c.category}")
        return {"success": True, "message": "\n".join(lines)}

    # ── 3.2. BO'SH MASHINALAR ────────────────────────────────
    FREE_KEYS = ["bo'sh mashinalar", "mavjud mashinalar", "available mashinalar", "ijaraga olsa bo'ladigan", "free cars", "qaysilari bor"]
    if any(k in cmd for k in FREE_KEYS):
        free_cars = db.query(Car).filter(Car.is_available == True).all()
        if not free_cars:
            return {"success": True, "message": "Hozirda bo'sh mashina yo'q, hammasi ijarada."}
        lines = [f"✅ Hozirda ijaraga mavjud {len(free_cars)} ta mashina:"]
        for c in free_cars:
            lines.append(f"  • {c.brand} {c.name} ({c.year}) — {c.price_per_day:,.0f} so'm/kun | {c.category}")
        return {"success": True, "message": "\n".join(lines)}

    # ── 3.3. SERVIS KERAK ────────────────────────────────────
    MAINT_KEYS = ["servis kerak", "ta'mirga kerak", "texnik ko'rik", "maintenance", "yurishi ko'p", "eskirgan mashinalar"]
    if any(k in cmd for k in MAINT_KEYS):
        cars = db.query(Car).all()
        need_service = [c for c in cars if (c.mileage - c.last_service_mileage) > 10000]
        if not need_service:
            return {"success": True, "message": "✅ Barcha mashinalar servisda, hamma yaxshi!"}
        lines = [f"⚠️ Servis/texnik ko'rikga muhtoj {len(need_service)} ta mashina:"]
        for c in need_service:
            km_diff = c.mileage - c.last_service_mileage
            lines.append(f"  • {c.brand} {c.name} — oxirgi servisdan {km_diff:,} km o'tgan ⚠️")
        return {"success": True, "message": "\n".join(lines)}

    # ── 4. AVTOMOBILNI TEKSHIRISH (TO'LIQ MA'LUMOT) ──────
    CHECK_KEYS = ["tekshir", "holati", "ma'lumot", "malumot", "status", "qarang", "haqida", "ko'rsat", "info", "detail"]
    if any(k in cmd for k in CHECK_KEYS):
        car = find_car_in_cmd(cmd, db)
        if not car:
            return {
                "success": False,
                "message": "Mashina nomi topilmadi. Masalan: 'Malibuni tekshir' yoki 'Nexia holati'."
            }
        status = "Mavjud ✅" if car.is_available else "Band / Ijarada ❌"
        service_km = car.mileage - car.last_service_mileage
        service_warn = " ⚠️ Servis kerak!" if service_km > 10000 else " ✅ Servis yaqinda amalga oshirilgan"
        msg = (
            f"🔍 {car.brand} {car.name} ({car.year}) haqida to'liq ma'lumot:\n"
            f"  📁 Kategoriya:    {car.category}\n"
            f"  💰 Kunlik narx:   {car.price_per_day:,.0f} so'm\n"
            f"  🏁 Umumiy yurish: {car.mileage:,} km\n"
            f"  🔧 Oxirgi servis: {car.last_service_mileage:,} km ({service_km:,} km oldin){service_warn}\n"
            f"  📊 Holati:        {status}"
        )
        return {"success": True, "message": msg}

    # ── 5. HUJJATLARNI TASDIQLASH ─────────────────────────
    # ── 4.5. HUJJATLAR RO'YXATI ──────────────────────────────
    DOC_LIST_KEYS = ["hujjatlar ro'yxati", "hujjatlar listi", "kyc ro'yxati", "docs list", "pending hujjatlar", "tekshirilmagan hujjatlar"]
    if any(k in cmd for k in DOC_LIST_KEYS) and not any(w in cmd for w in ["tasdiqla", "rad", "verify", "reject"]):
        docs = db.query(Document).all()
        if not docs:
            return {"success": True, "message": "Hujjatlar bazasi bo'sh."}
        pending = [d for d in docs if d.status == "pending"]
        verified = [d for d in docs if d.status == "verified"]
        rejected = [d for d in docs if d.status == "rejected"]
        lines = [
            f"📄 Jami {len(docs)} ta hujjat:",
            f"  ⏳ Kutilayotgan (pending): {len(pending)} ta",
            f"  ✅ Tasdiqlangan (verified): {len(verified)} ta",
            f"  ❌ Rad etilgan (rejected): {len(rejected)} ta",
        ]
        if pending:
            lines.append("\nKutilayotgan hujjatlar:")
            for d in pending[:5]:
                user = db.query(User).filter(User.id == d.user_id).first()
                uname = user.full_name if user else f"User#{d.user_id}"
                lines.append(f"  • [{d.doc_type}] {uname}")
            if len(pending) > 5:
                lines.append(f"  ... va yana {len(pending)-5} ta.")
        return {"success": True, "message": "\n".join(lines)}

    # ── 5. HUJJATLARNI TASDIQLASH ─────────────────────────
    VERIFY_KEYS = ["tasdiqla", "verify", "hujjat", "tasdiqlash", "kyc", "tasdiqlashin", "approve"]
    if any(k in cmd for k in VERIFY_KEYS):
        # Bitta foydalanuvchi uchunmi?
        users = db.query(User).all()
        target_user = None
        for u in users:
            if u.full_name.lower() in cmd or u.email.lower() in cmd:
                target_user = u
                break

        if target_user:
            docs = db.query(Document).filter(
                Document.user_id == target_user.id,
                Document.status == "pending"
            ).all()
            for d in docs:
                d.status = "verified"
            db.commit()
            return {
                "success": True,
                "message": f"✅ {target_user.full_name} foydalanuvchisining {len(docs)} ta hujjati tasdiqlandi."
            }
        else:
            # Hammani tasdiqlash
            docs = db.query(Document).filter(Document.status == "pending").all()
            count = len(docs)
            for d in docs:
                d.status = "verified"
            db.commit()
            return {"success": True, "message": f"✅ {count} ta kutilayotgan hujjat tasdiqlandi (verified)."}

    # ── 6. HUJJATNI RAD ETISH ───────────────────────────
    REJECT_KEYS = ["rad et", "reject", "o'chir hujjat", "hujjatni rad", "rad etsin", "hujjat rad", "ko'rib chiqilmadi"]
    if any(k in cmd for k in REJECT_KEYS):
        docs = db.query(Document).filter(Document.status == "pending").all()
        count = len(docs)
        for d in docs:
            d.status = "rejected"
        db.commit()
        return {"success": True, "message": f"❌ {count} ta hujjat rad etildi (rejected)."}

    # ── 7. BRONNI TASDIQLASH ──────────────────────────────
    # ── 6.5. BRONLAR RO'YXATI ─────────────────────────────────
    BOOK_LIST_KEYS = ["bronlar ro'yxati", "bronlar listi", "bookings", "bronlar", "barcha bronlar", "pending bronlar", "kutilayotgan bronlar"]
    if any(k in cmd for k in BOOK_LIST_KEYS) and not any(w in cmd for w in ["tasdiqla", "bekor", "cancel", "o'chir"]):
        bookings = db.query(Booking).all()
        if not bookings:
            return {"success": True, "message": "Hozirda hech qanday bron yo'q."}
        pending   = [b for b in bookings if b.status == "pending"]
        confirmed = [b for b in bookings if b.status == "confirmed"]
        cancelled = [b for b in bookings if b.status == "cancelled"]
        lines = [
            f"📋 Jami {len(bookings)} ta bron:",
            f"  ⏳ Kutilayotgan: {len(pending)} ta",
            f"  ✅ Tasdiqlangan: {len(confirmed)} ta",
            f"  🚫 Bekor qilingan: {len(cancelled)} ta",
        ]
        if pending:
            lines.append("\n⏳ Kutilayotgan bronlar:")
            for b in pending[:5]:
                car  = db.query(Car).filter(Car.id == b.car_id).first()
                user = db.query(User).filter(User.id == b.user_id).first()
                cname = f"{car.brand} {car.name}" if car else f"Car#{b.car_id}"
                uname = user.full_name if user else f"User#{b.user_id}"
                lines.append(f"  • {uname} → {cname} | {b.start_date} – {b.end_date}")
            if len(pending) > 5:
                lines.append(f"  ... va yana {len(pending)-5} ta.")
        return {"success": True, "message": "\n".join(lines)}

    # ── 7. BRONNI TASDIQLASH ──────────────────────────────
    CONFIRM_KEYS = ["bronni tasdiqla", "booking tasdiqla", "bronlarni tasdiqla", "joylashtirilsin", "bronni qabul qil", "bronni ko'rsat"]
    if any(k in cmd for k in CONFIRM_KEYS):
        bookings = db.query(Booking).filter(Booking.status == "pending").all()
        count = len(bookings)
        for b in bookings:
            b.status = "confirmed"
        db.commit()
        return {"success": True, "message": f"✅ {count} ta kutilayotgan bron tasdiqlandi (confirmed)."}

    # ── 8. BRONNI BEKOR QILISH ────────────────────────────
    CANCEL_KEYS = ["bekor qil", "otmen", "cancel", "bronni bekor", "o'chirish", "bekor qiling", "bronlarni o'chir", "bron bekor"]
    if any(k in cmd for k in CANCEL_KEYS):
        bookings = db.query(Booking).filter(Booking.status == "pending").all()
        count = len(bookings)
        for b in bookings:
            b.status = "cancelled"
        db.commit()
        return {"success": True, "message": f"🚫 {count} ta kutilayotgan bron bekor qilindi (cancelled)."}

    # ── 9. NARXNI KO'TARISH ───────────────────────────────
    RAISE_KEYS = ["narxni ko'tar", "narxni oshir", "narx oshir", "narx ko'tar", "qimmatlashtir", "balandlashtir", "narx orttir", "raise price", "price up", "narxini ko'tar", "narxini oshir"]
    if any(k in cmd for k in RAISE_KEYS):
        car = find_car_in_cmd(cmd, db)
        if not car:
            # Barcha mashinalar narxini oshirish
            match = re.search(r'(\d+)\s*(%|foiz)', cmd)
            if match:
                percent = int(match.group(1))
                cars = db.query(Car).all()
                for c in cars:
                    c.price_per_day = c.price_per_day * (1 + percent / 100)
                db.commit()
                return {"success": True, "message": f"🔺 Barcha {len(cars)} ta mashina narxi {percent}% ga oshirildi."}
            return {
                "success": False,
                "message": "Mashina nomi yoki foiz ko'rsatilmadi. Masalan: 'Malibu narxini 10% ko'tar'"
            }
        match = re.search(r'(\d+)\s*(%|foiz)', cmd)
        if match:
            percent = int(match.group(1))
            old_price = car.price_per_day
            car.price_per_day = old_price * (1 + percent / 100)
            db.commit()
            return {
                "success": True,
                "message": f"🔺 {car.brand} {car.name} narxi {percent}% oshirildi: {old_price:,.0f} → {car.price_per_day:,.0f} so'm"
            }
        return {"success": False, "message": "Foiz ko'rsatilmadi. Masalan: '10%' yoki '10 foiz'."}

    # ── 10. NARXNI TUSHIRISH ──────────────────────────────
    LOWER_KEYS = ["narxni tushir", "narx tushir", "narxni pasaytir", "arzonlashtir", "chegirma", "discount", "narxini tushir", "narxini pasaytir", "lower price", "price down", "kamlashtir"]
    if any(k in cmd for k in LOWER_KEYS):
        car = find_car_in_cmd(cmd, db)
        if not car:
            match = re.search(r'(\d+)\s*(%|foiz)', cmd)
            if match:
                percent = int(match.group(1))
                cars = db.query(Car).all()
                for c in cars:
                    c.price_per_day = c.price_per_day * (1 - percent / 100)
                db.commit()
                return {"success": True, "message": f"🔻 Barcha {len(cars)} ta mashina narxi {percent}% ga tushirildi."}
            return {
                "success": False,
                "message": "Mashina nomi yoki foiz ko'rsatilmadi. Masalan: 'Nexia narxini 15% arzonlashtir'"
            }
        match = re.search(r'(\d+)\s*(%|foiz)', cmd)
        if match:
            percent = int(match.group(1))
            old_price = car.price_per_day
            car.price_per_day = old_price * (1 - percent / 100)
            db.commit()
            return {
                "success": True,
                "message": f"🔻 {car.brand} {car.name} narxi {percent}% tushirildi: {old_price:,.0f} → {car.price_per_day:,.0f} so'm"
            }
        return {"success": False, "message": "Foiz ko'rsatilmadi. Masalan: '10%' yoki '10 foiz'."}

    # ── 11. ESKI "narxi" kalit so'zi (backward compat.) ──
    if "narxi" in cmd or "oshir" in cmd or "tushir" in cmd or "pasaytir" in cmd:
        car = find_car_in_cmd(cmd, db)
        if not car:
            return {"success": False, "message": "Mashina aniqlanmadi. Qaysi mashina narxini o'zgartirmoqchisiz?"}
        match = re.search(r'(\d+)\s*(%|foiz)', cmd)
        if match:
            percent = int(match.group(1))
            old_price = car.price_per_day
            if "oshir" in cmd or "ko'tar" in cmd:
                car.price_per_day = old_price * (1 + percent / 100)
                db.commit()
                return {"success": True, "message": f"🔺 {car.brand} {car.name}: {old_price:,.0f} → {car.price_per_day:,.0f} so'm (+{percent}%)"}
            else:
                car.price_per_day = old_price * (1 - percent / 100)
                db.commit()
                return {"success": True, "message": f"🔻 {car.brand} {car.name}: {old_price:,.0f} → {car.price_per_day:,.0f} so'm (-{percent}%)"}
        return {"success": False, "message": "Foiz ko'rsatilmadi. Masalan: '10%' yoki '10 foiz'."}

    # ── 12. MASHINANI IJARAGA OCHISH ──────────────────────
    OPEN_KEYS = ["ochib qo'y", "ochib qoy", "aktivlashtir", "ijaraga qo'y", "mavjud qil", "enable", "ijaraga qo'ysin", "ochib ber", "faollashtir", "open"]
    if any(k in cmd for k in OPEN_KEYS):
        car = find_car_in_cmd(cmd, db)
        if car:
            car.is_available = True
            db.commit()
            return {"success": True, "message": f"✅ {car.brand} {car.name} yana ijaraga ochildi (is_available=True)."}
        return {"success": False, "message": "Mashina nomi topilmadi."}

    # ── 13. MASHINANI IJARADAN YOPISH ─────────────────────
    CLOSE_KEYS = ["ijaradan olib tashla", "ochirib qoyish", "o'chirib qo'yish", "band qil", "yopish", "yop", "disable", "ijaradan yop", "deaktiv", "close", "mavjud emas qil"]
    if any(k in cmd for k in CLOSE_KEYS):
        car = find_car_in_cmd(cmd, db)
        if car:
            car.is_available = False
            db.commit()
            return {"success": True, "message": f"🔒 {car.brand} {car.name} vaqtincha ijaradan yopildi (is_available=False)."}
        return {"success": False, "message": "Mashina nomi topilmadi. Qaysi mashinani yopmoqchisiz?"}

    # ── 14. SERVIS YANGILASH ──────────────────────────────
    SERVICE_KEYS = ["servis bajarildi", "texnik ko'rik o'tdi", "ta'mirlash", "yurish yangilash", "km yangilash", "servis qilindi", "ta'mirlandi", "texnik amalga oshirildi"]
    if any(k in cmd for k in SERVICE_KEYS):
        car = find_car_in_cmd(cmd, db)
        if car:
            car.last_service_mileage = car.mileage
            db.commit()
            return {
                "success": True,
                "message": f"🔧 {car.brand} {car.name} servis ma'lumoti yangilandi. Joriy yurish: {car.mileage:,} km da servis amalga oshirildi."
            }
        return {"success": False, "message": "Mashina nomi topilmadi."}

    # ── 15. YORDAM ─────────────────────────────────────────
    HELP_KEYS = ["/help", "/yordam", "yordam", "help", "nima qila olasan", "buyruqlar", "imkoniyatlar", "nimalar qila olasan", "qanday buyruqlar", "funksiyalar", "komandalar", "commands"]
    if any(k in cmd for k in HELP_KEYS):
        msg = (
            "🤖 **SmartCar AI Agent Buyruqlari:**\n\n"
            "📊 **STATISTIKA:**\n"
            "  • `statistika` — umumiy hisobot va dashboard\n\n"
            "🚗 **MASHINALAR:**\n"
            "  • `mashinalar ro'yxati` — barcha mashinalarni ko'rsatish\n"
            "  • `bo'sh mashinalar` / `band mashinalar` — holatiga qarab filtrlash\n"
            "  • `[mashina nomi] holati` (masalan: *Malibu holati*) — bitta mashina infosi\n"
            "  • `[mashina]ni ochib qo'y` / `yopib qo'y` — ijaraga berish huquqini ochish/yopish\n"
            "  • `servis kerak` — texnik ko'rikka muhtoj mashinalar ro'yxati\n"
            "  • `[mashina] servis qilindi` — yurish masofasini (km) yangilash\n\n"
            "💰 **DINAMIK NARXLASH:**\n"
            "  • `[mashina] narxini [X]% ko'tar/tushir` — (masalan: *Nexia narxini 10% tushir*)\n"
            "  • `barcha mashinalar narxini [X]% oshir/arzonlashtir` — barcha narxlarni yangilash\n\n"
            "📋 **BRONLAR & IJARALAR:**\n"
            "  • `bronlar ro'yxati` — barcha kutilayotgan va joriy bronlar\n"
            "  • `bronlarni tasdiqla/bekor qil` — kutilayotgan bronlarni ommaviy boshqarish\n\n"
            "📄 **HUJJATLAR (KYC):**\n"
            "  • `hujjatlar ro'yxati` — foydalanuvchilar yuklagan hujjatlar\n"
            "  • `hujjatlarni tasdiqla/rad et` — tekshirilmagan hujjatlarni boshqarish\n\n"
            "👥 **FOYDALANUVCHILAR:**\n"
            "  • `foydalanuvchilar ro'yxati` — barcha faol mijozlarni ko'rsatish"
        )
        return {"success": True, "message": msg}

    # ── DEFAULT ────────────────────────────────────────────
    return {
        "success": False,
        "message": (
            "⚠️ Buyruq tushunilmadi. Barcha imkoniyatlarni ko'rish uchun yozing:\n"
            "👉 **/help** yozing."
        )
    }
