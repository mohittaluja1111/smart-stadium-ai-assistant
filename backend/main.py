from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import time

app = FastAPI(title="Smart Stadium AI API")

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------
# DATA MODELS
# -----------------
class ChatRequest(BaseModel):
    message: str

# -----------------
# ENDPOINTS
# -----------------

@app.get("/api/dashboard")
def get_dashboard_stats():
    """ Returns overall stadium statistics """
    return {
        "total_attendance": random.randint(45000, 50000),
        "capacity": 60000,
        "avg_wait_time": random.randint(5, 25),
        "active_incidents": random.randint(0, 3),
        "crowd_risk_score": random.randint(30, 85)
    }

@app.get("/api/map")
def get_map_data():
    """ Returns simulated mapped crowd points for the stadium """
    # Simulating standard layout zones with a small jitter
    points = []
    zones = ["North Gate", "South Gate", "East Concourse", "West Concourse", "Food Court", "Merch Store"]
    
    for i in range(40):
        points.append({
            "id": i,
            "zone": random.choice(zones),
            # Mock coords mapped to CSS top/left percentages roughly
            "x": random.randint(10, 90),
            "y": random.randint(10, 90),
            "density": random.choice(["Low", "Medium", "High"])
        })
    return {"points": points}

@app.post("/api/chat")
def chat_with_assistant(req: ChatRequest):
    """ Simulated AI assistant matching query """
    q = req.message.lower()
    
    if "food" in q or "hungry" in q:
        reply = "The main Food Court on the West Concourse currently has a low wait time of 5 minutes. Would you like directions?"
    elif "parking" in q:
        reply = "Parking Lot B still has about 120 spots available and traffic is light right now."
    elif "bathroom" in q or "washroom" in q or "restroom" in q:
        reply = "The closest available restroom is located near Gate 4. Current wait time is under 2 minutes."
    elif "gate" in q or "entry" in q:
        reply = "The South Gate is experiencing heavy traffic right now. We recommend proceeding to the East Gate for faster entry."
    else:
        reply = "I'm your Smart Stadium Assistant! You can ask me about food wait times, parking availability, gate entry, or directions."
    
    return {
        "reply": reply,
        "timestamp": time.time()
    }

@app.get("/api/admin")
def get_admin_metrics():
    """ Returns historical data for charts """
    history = []
    for i in range(10):
        history.append({
            "time": f"T-{10-i}h",
            "attendance": random.randint(20000, 50000)
        })
    
    zone_distribution = [
        {"name": "Gates", "value": random.randint(300, 1000)},
        {"name": "Concourse", "value": random.randint(500, 2000)},
        {"name": "Seats", "value": random.randint(20000, 40000)},
        {"name": "Facilities", "value": random.randint(200, 800)}
    ]
        
    return {
        "history": history,
        "zone_distribution": zone_distribution
    }

@app.get("/crowd")
def get_crowd_density():
    """ Returns randomized crowd density for zones A, B, C, D """
    densities = ["low", "medium", "high"]
    return {zone: random.choice(densities) for zone in ["A", "B", "C", "D"]}

@app.get("/wait-time")
def get_wait_time():
    """ Returns dynamic wait times for food stalls and washrooms """
    return {
        "food": random.randint(2, 25),
        "washroom": random.randint(1, 10)
    }

@app.get("/suggestion")
def get_suggestion():
    """ Returns the best gate to enter and a recommended path """
    best_gate = random.choice(["Gate 1", "Gate 2", "Gate 3", "Gate 4"])
    return {
        "best_gate": best_gate,
        "recommended_path": f"Head through the South Plaza and proceed directly to {best_gate} for the fastest entry."
    }

@app.get("/alerts")
def get_alerts():
    """ Returns standard alerts like overcrowded gates or high wait times """
    potential_alerts = [
        "Gate 2 overcrowded",
        "Food stall A high wait time"
    ]
    return {
        "alerts": [random.choice(potential_alerts)]
    }

@app.get("/")
def read_root():
    """ Health check for the root API path """
    return {"message": "Smart Stadium API running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
