from fastapi import APIRouter
from backend.schemas.item import ItemCreate

router = APIRouter()

# In-memory mock swap requests storage
swap_requests = [
    {
        "request_id": 1,
        "item_id": 1,
        "requesting_user": "mock_user",
        "message": "Interested in swapping this item!",
        "status": "pending"
    }
]

@router.post("/", status_code=201)
def create_item(item: ItemCreate):
    # Mocked item creation
    return {
        "id": 1,
        "name": item.name if hasattr(item, 'name') else "mock item",
        "description": getattr(item, 'description', 'mock description'),
        "owner_id": 1,
        "message": "Item created (mock)"
    }

@router.post("/{item_id}/swap_request", status_code=201)
def create_swap_request(item_id: int, request: dict):
    # Accepts a swap request for an item (mocked)
    swap_request = {
        "request_id": len(swap_requests) + 1,
        "item_id": item_id,
        "requesting_user": request.get("requesting_user", "demo_user"),
        "message": request.get("message", "I'd like to swap!"),
        "status": "pending"
    }
    swap_requests.append(swap_request)
    return swap_request

@router.get("/swap_requests")
def list_swap_requests():
    # Returns all mock swap requests
    return swap_requests

@router.post("/swap_requests/{request_id}/update_status")
def update_swap_status(request_id: int, update: dict):
    # Update the status of a swap request
    for req in swap_requests:
        if req["request_id"] == request_id:
            req["status"] = update.get("status", req["status"])
            return req
    return {"error": "Swap request not found"}
