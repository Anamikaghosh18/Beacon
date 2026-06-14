from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

Base = declarative_base()

engine = None
AsyncSessionLocal = None


def init_db(database_url: str):
    global engine, AsyncSessionLocal

    if engine is not None:
        return

    engine = create_async_engine(
        database_url,
        echo=False,
    )

    AsyncSessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )


def _ensure_initialized():
    if engine is None:
        from backend.core.config import get_settings

        init_db(get_settings().DATABASE_URL)


_ensure_initialized()


async def get_db():
    _ensure_initialized()
    async with AsyncSessionLocal() as session:
        yield session