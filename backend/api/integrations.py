from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert
import pandas as pd
import io
import math
from pydantic import BaseModel

from core.database import get_db
from models.customer import Customer
from core.auth import get_current_user

router = APIRouter()

class ConnectSourceRequest(BaseModel):
    source_type: str 
    credentials: dict

@router.post("/upload")
async def upload_customers(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Validate file extension
    if not (file.filename.endswith('.csv') or file.filename.endswith('.xlsx')):
        raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported")

    content = await file.read()
    
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
        else:
            df = pd.read_excel(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing file: {str(e)}")

    df.columns = df.columns.str.strip().str.lower()
    
    # Check if 'email' and 'name' exist
    if 'email' not in df.columns or 'name' not in df.columns:
        raise HTTPException(status_code=400, detail="File must contain 'name' and 'email' columns")

    # Replace NaN with None for database compatibility
    df = df.where(pd.notnull(df), None)

    records = df.to_dict('records')
    inserted_count = 0
    updated_count = 0

    for record in records:
        # Construct statement for postgres upsert (INSERT ON CONFLICT DO UPDATE)
        email = str(record.get('email', '')).strip()
        if not email:
            continue

        stmt = insert(Customer).values(
            name=str(record.get('name', 'Unknown')).strip(),
            email=email,
            phone=str(record.get('phone', '')) if record.get('phone') else None,
            total_spent=float(record.get('total_spent', 0)) if record.get('total_spent') else 0,
            order_count=int(record.get('order_count', 0)) if record.get('order_count') else 0,
        )

        # On conflict of email, update the fields
        update_dict = {
            c.name: c for c in stmt.excluded if c.name not in ['id', 'email', 'created_at']
        }
        
        upsert_stmt = stmt.on_conflict_do_update(
            index_elements=['email'],
            set_=update_dict
        )
        
        await db.execute(upsert_stmt)
        inserted_count += 1 

    await db.commit()

    return {"message": f"Successfully processed {inserted_count} records", "inserted": inserted_count}


@router.post("/connect")
async def connect_source(
    request: ConnectSourceRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    
    if request.source_type not in ['shopify', 'postgres', 'woocommerce']:
        raise HTTPException(status_code=400, detail="Unsupported source type")
        
    # Simulate credential validation
    if request.source_type == 'shopify':
        if 'shop_name' not in request.credentials or 'access_token' not in request.credentials:
            raise HTTPException(status_code=400, detail="Missing required credentials for Shopify")
            
    
    return {
        "status": "connected",
        "source_type": request.source_type,
        "message": f"Successfully connected to {request.source_type.title()}"
    }
