from pydantic import BaseModel

class ItemCreate(BaseModel):
    title: str
    description: str
    category: str
    type: str
    size: str
    condition: str
    point_value: int
