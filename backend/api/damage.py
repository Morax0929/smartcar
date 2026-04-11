from fastapi import APIRouter, File, UploadFile, Depends
from typing import List
import random
import time
from pydantic import BaseModel

router = APIRouter()

class DamageReport(BaseModel):
    confidence: float
    type: str # scratch, dent, glass_crack
    severity: str # minor, moderate, severe
    description: str

class DamageAnalysisResponse(BaseModel):
    status: str
    message: str
    damages_detected: int
    details: List[DamageReport]

@router.post("/analyze", response_model=DamageAnalysisResponse)
async def analyze_car_damage(file: UploadFile = File(...)):
    # Simulyatsiya qilingan kechikish (Go'yoki AI model ishlayapti)
    # 1 soniya kutish
    time.sleep(1)
    
    # Tasodifiy qilib zarar aniqlash ehtimolini 30% qilamiz
    has_damage = random.random() < 0.3
    
    if not has_damage:
        return {
            "status": "success",
            "message": "Hech qanday zarar aniqlanmadi. Avtomobil a'lo holatda.",
            "damages_detected": 0,
            "details": []
        }
        
    # Agar zarar bo'lsa, uni simulyatsiya qilamiz
    num_damages = random.randint(1, 2)
    damage_types = [
        ("scratch", "Tirnalgan joy", "minor"),
        ("dent", "Pachoqlangan joy", "moderate"),
        ("glass_crack", "Oynadagi yoriq", "severe")
    ]
    
    selected_damages = random.sample(damage_types, num_damages)
    
    details = []
    for dtype, desc, severity in selected_damages:
        details.append(
            DamageReport(
                confidence=round(random.uniform(0.75, 0.99), 2),
                type=dtype,
                severity=severity,
                description=f"AI tomonidan {desc.lower()} aniqlandi"
            )
        )
        
    return {
        "status": "warning",
        "message": f"Filtrdan o'tkazilganda {num_damages} ta potentsial zarar aniqlandi.",
        "damages_detected": num_damages,
        "details": details
    }
