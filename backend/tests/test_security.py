from app.security import get_password_hash, verify_password


def test_password_hashing_and_verification():
    password = "mysecretpassword"

    # 1. Parolayı hash'le
    hashed_password = get_password_hash(password)

    # 2. Hash'lenmiş parolanın orijinalinden farklı olduğunu doğrula
    assert hashed_password != password

    # 3. Doğru parola ile doğrulamanın True döndüğünü kontrol et
    assert verify_password(password, hashed_password) == True

    # 4. Yanlış parola ile doğrulamanın False döndüğünü kontrol et
    assert verify_password("wrongpassword", hashed_password) == False
