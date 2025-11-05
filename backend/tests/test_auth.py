from fastapi.testclient import TestClient


def test_create_user_signup(client: TestClient):
    # 1. Signup endpoint'ine geçerli verilerle bir POST isteği gönder
    response = client.post(
        "/auth/signup",
        json={"email": "integration.test@example.com", "password": "testpassword"},
    )

    # 2. HTTP status kodunun 200 OK olduğunu doğrula
    assert response.status_code == 200

    # 3. Dönen JSON verisini al ve içeriğini kontrol et
    data = response.json()
    assert data["email"] == "integration.test@example.com"
    assert "id" in data
    assert "hashed_password" not in data  # Hassas verinin dönmediğinden emin ol

    # 4. Aynı kullanıcıyla tekrar kaydolmayı dene
    response = client.post(
        "/auth/signup",
        json={"email": "integration.test@example.com", "password": "testpassword"},
    )

    # 5. Bu sefer status kodunun 400 (Bad Request) olduğunu doğrula
    assert response.status_code == 400
    assert response.json() == {"detail": "Email already registered"}
