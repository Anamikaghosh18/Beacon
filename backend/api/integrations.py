from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert
import pandas as pd
import io
from pydantic import BaseModel

from backend.core.database import get_db
from backend.models.customer import Customer
from backend.core.auth import get_current_user
from backend.services.segment_evaluator import refresh_all_segments, ensure_default_segments
from backend.services.segment_service import SegmentService

router = APIRouter()

COLUMN_ALIASES = {
    "email": "email",
    "e-mail": "email",
    "name": "name",
    "full_name": "name",
    "customer_name": "name",
    "phone": "phone",
    "phone_number": "phone",
    "mobile": "phone",
    "total_spent": "total_spent",
    "spend": "total_spent",
    "lifetime_value": "total_spent",
    "ltv": "total_spent",
    "amount": "total_spent",
    "revenue": "total_spent",
    "order_count": "order_count",
    "orders": "order_count",
    "purchases": "order_count",
    "external_id": "external_id",
    "customer_id": "external_id",
    "id": "external_id",
    "onesignal_id": "onesignal_id",
    "push_id": "onesignal_id",
}


class ConnectSourceRequest(BaseModel):
    source_type: str
    credentials: dict


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    renamed = {}
    for col in df.columns:
        key = col.strip().lower().replace(" ", "_")
        if key in COLUMN_ALIASES:
            renamed[col] = COLUMN_ALIASES[key]
    return df.rename(columns=renamed)


def _safe_float(val, default=0.0):
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return default
    try:
        return float(val)
    except (TypeError, ValueError):
        return default


def _safe_int(val, default=0):
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return default
    try:
        return int(float(val))
    except (TypeError, ValueError):
        return default


@router.post("/upload")
async def upload_customers(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if not (file.filename.endswith(".csv") or file.filename.endswith(".xlsx")):
        raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported")

    content = await file.read()

    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        else:
            df = pd.read_excel(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing file: {str(e)}")

    df = _normalize_columns(df)
    df.columns = df.columns.str.strip().str.lower()

    if "email" not in df.columns or "name" not in df.columns:
        raise HTTPException(
            status_code=400,
            detail="File must contain 'name' and 'email' columns (aliases: full_name, e-mail, etc.)",
        )

    df = df.where(pd.notnull(df), None)
    records = df.to_dict("records")
    processed = 0

    for record in records:
        email = str(record.get("email", "")).strip()
        if not email:
            continue

        phone = record.get("phone")
        if phone is not None:
            phone = str(phone).strip() or None

        external_id = record.get("external_id")
        if external_id is not None:
            external_id = str(external_id).strip() or None

        onesignal_id = record.get("onesignal_id")
        if onesignal_id is not None:
            onesignal_id = str(onesignal_id).strip() or None

        stmt = insert(Customer).values(
            name=str(record.get("name", "Unknown")).strip(),
            email=email,
            phone=phone,
            external_id=external_id,
            onesignal_id=onesignal_id,
            total_spent=_safe_float(record.get("total_spent")),
            order_count=_safe_int(record.get("order_count")),
        )

        update_dict = {
            c.name: c
            for c in stmt.excluded
            if c.name not in ["id", "email", "created_at"]
        }

        upsert_stmt = stmt.on_conflict_do_update(
            index_elements=["email"],
            set_=update_dict,
        )

        await db.execute(upsert_stmt)
        processed += 1

    await ensure_default_segments(db)
    await refresh_all_segments(db)
    await db.commit()

    return {
        "message": f"Successfully processed {processed} customer records",
        "processed": processed,
    }


@router.post("/connect")
async def connect_source(
    request: ConnectSourceRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if request.source_type not in ["shopify", "postgres", "woocommerce", "csv"]:
        raise HTTPException(status_code=400, detail="Unsupported source type")

    if request.source_type == "shopify":
        if "shop_name" not in request.credentials or "access_token" not in request.credentials:
            raise HTTPException(status_code=400, detail="Missing required credentials for Shopify")

    return {
        "status": "connected",
        "source_type": request.source_type,
        "message": (
            f"Connected to {request.source_type.title()}. "
            "Use CSV upload to import customer data, or configure a sync job."
        ),
    }
