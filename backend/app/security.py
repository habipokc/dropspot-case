from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    """Girilen parolayla veritabanındaki hash'lenmiş parolayı karşılaştırır."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Girilen parolayı hash'ler."""
    return pwd_context.hash(password)
