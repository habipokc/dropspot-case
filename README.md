# DropSpot – Sınırlı Stok ve Bekleme Listesi Platformu 

**Projeye Başlama Zamanı:** 05 Kasım 2025, 11:08

---

## 1. Proje Özeti ve Mimari Açıklama

DropSpot, sınırlı stoklu ürünlerin (drop) yayınlandığı, kullanıcıların bu droplara katılarak bekleme listesine girdiği ve hak talebinde bulunduğu bir Full Stack web uygulamasıdır. Proje, Alpaco'nun ürün geliştirme kültürünü yansıtan, modern teknolojiler ve en iyi endüstri pratikleri kullanılarak uçtan uca geliştirilmiştir.

**Temel Mimarisi:**
Proje, `backend` ve `frontend` servislerini içeren bir **monorepo** yapısındadır.
*   **Backend:** Modüler bir tasarıma sahip Python **FastAPI** uygulamasıdır. Sorumluluklar katmanlara ayrılmıştır: API endpoint'leri (`routers`), iş mantığı (`crud`), veritabanı modelleri (`models`) ve veri doğrulama şemaları (`schemas`). PostgreSQL veritabanı, Docker Compose ile yönetilmektedir.
*   **Frontend:** **Next.js** (App Router) kullanılarak geliştirilmiş modern bir React uygulamasıdır. Sunucu Taraflı Bileşenler (Server Components) sayesinde yüksek performans ve SEO uyumluluğu hedeflenmiştir. Arayüz için **Tailwind CSS**, global durum yönetimi için ise **Zustand** kullanılmıştır.

---

## 2. Veri Modeli ve API Endpoint Listesi

### Veri Modeli

*   `User`: Kullanıcıları temsil eder (id, email, rol).
*   `Drop`: Sınırlı stoklu ürünleri temsil eder (id, ad, stok, claim penceresi).
*   `WaitlistEntry`: Bir kullanıcının bir drop'un bekleme listesine katıldığını belirtir.
*   `Claim`: Bir kullanıcının bir drop için başarıyla hak talebinde bulunduğunu belirtir.

### Ana API Endpoint'leri

*   **Auth:**
    *   `POST /auth/signup`: Yeni kullanıcı kaydı.
    *   `POST /auth/login`: Kullanıcı girişi ve JWT token alımı.
    *   `GET /users/me`: Geçerli kullanıcı bilgilerini döndürür.
*   **Kullanıcı (Drops):**
    *   `GET /drops`: Tüm aktif dropları listeler.
    *   `GET /drops/{id}`: Tek bir drop'un detaylarını getirir.
    *   `POST /drops/{id}/join`: Bir drop'un bekleme listesine katılır.
    *   `POST /drops/{id}/leave`: Bekleme listesinden ayrılır.
    *   `POST /drops/{id}/claim`: Bir drop için hak talebinde bulunur.
*   **Admin:**
    *   `GET /admin/drops`: Tüm dropları listeler.
    *   `POST /admin/drops`: Yeni bir drop oluşturur.
    *   `PUT /admin/drops/{id}`: Mevcut bir drop'u günceller.
    *   `DELETE /admin/drops/{id}`: Bir drop'u ve bağlı tüm kayıtları siler.
    *   `POST /admin/drops/generate-description`: (Bonus) AI ile drop açıklaması üretir.

---

## 3. CRUD Modülü Açıklaması

Proje, `admin` rolüne sahip kullanıcılar için tam fonksiyonel bir CRUD (Create, Read, Update, Delete) yönetim paneli içerir. Bu panel üzerinden adminler:
*   Tüm dropları merkezi bir tabloda görüntüleyebilir.
*   Yeni droplar oluşturabilir.
*   Mevcut dropların tüm bilgilerini (ad, stok, tarihler) güncelleyebilir.
*   Bir drop'u, ona bağlı tüm bekleme listesi ve hak talebi kayıtlarıyla birlikte güvenli bir şekilde silebilir.

Admin paneli, rol tabanlı yetkilendirme ile korunmaktadır ve sadece `admin` rolüne sahip kullanıcılar tarafından erişilebilirdir.

---

## 4. Idempotency Yaklaşımı ve Transaction Yapısı

Veri bütünlüğü ve tutarlılığı, projenin en kritik önceliğidir.
*   **Idempotency:** API, bir kullanıcının aynı drop'a birden fazla kez katılmasına veya hak talebinde bulunmasına izin vermez. Bu kontroller hem kod seviyesinde (`400 Bad Request` hatalarıyla) hem de veritabanı seviyesinde (`UniqueConstraint`) sağlanır.
*   **Transaction ve Locking:** Projenin en hassas işlemi olan `/drops/{id}/claim` endpoint'i, "race condition" (yarış durumu) riskini ortadan kaldırmak için tasarlanmıştır. Bu işlem, SQLAlchemy'nin `with db.begin_nested()` bloğu ile atomik bir **transaction** içinde yürütülür ve `with_for_update()` ile ilgili drop satırına **satır seviyesinde kilit (pessimistic locking)** koyar. Bu sayede, aynı anda yapılan yüzlerce istek bile stoğu tutarlı bir şekilde eksiltir ve veri bütünlüğü %100 korunur.

---

## 5. Kurulum Adımları

### Backend

1.  Projenin kök dizininde bir `.env` dosyası oluşturun ve aşağıdaki değişkenleri doldurun:
    ```
    DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/dropspot_db"
    SECRET_KEY=...
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    GEMINI_API_KEY=...
    ```
2.  PostgreSQL veritabanını başlatmak için Docker'ı kullanın:
    ```bash
    docker-compose up -d
    ```
3.  Python sanal ortamını oluşturun ve bağımlılıkları yükleyin:
    ```bash
    cd backend
    python -m venv .venv
    source .venv/bin/activate  # veya Windows'ta `.venv\Scripts\activate`
    pip install -r requirements.txt
    ```
4.  Veritabanı tablolarını oluşturmak için Alembic migration'larını çalıştırın:
    ```bash
    alembic upgrade head
    ```
5.  Backend sunucusunu başlatın:
    ```bash
    uvicorn main:app --reload
    ```

### Frontend

1.  Bağımlılıkları yükleyin:
    ```bash
    cd frontend
    npm install
    ```
2.  Geliştirme sunucusunu başlatın:
    ```bash
    npm run dev
    ```
Uygulama artık `http://localhost:3000` adresinde çalışıyor olacaktır.

---

## 6. Ekran Görüntüleri

### Ana Sayfa (Kullanıcı Gözünden Drop Listesi)
Tüm kullanıcılar, aktif olan dropları bu kart yapısıyla ana sayfada görüntüleyebilir. Admin kullanıcılar için butonlar dinamik olarak değişir.
![Kullanıcı Drop Listesi](screenshots/01-user-drop-list.png)

### Admin Paneli (Drop Yönetim Tablosu)
Admin rolüne sahip kullanıcılar, tüm dropları bu merkezi panelden yönetebilir. Buradan düzenleme işlemi tetiklenebilir.
![Admin Paneli](screenshots/02-admin-panel.png)

### Drop Yönetim Sayfası 
Adminler mevcut dropları bu sayfada görüntüleyebilir. Yeni drop oluşturmaya geçebilir, var olan dropları düzenleyebilir ve silebilir.
![Drop Güncelleme Formu](screenshots/03-admin-edit-drop.png)

### Drop Oluşturma Sayfası (Bonus AI özelliği ile)
Adminler drop oluşturmak için bu sayfayı kullanır. AI ile üret butonuna basarak drop için açıklama metni üretebilir. 
![Drop Oluşturma Formu](screenshots/04-admin-create-drop.png)
---

## 7. Teknik Tercihler ve Kişisel Katkılar

*   **SQLAlchemy Transaction Yönetimi:** `db.commit()` ve `db.refresh()` sorumluluğunun bilinçli olarak `router` katmanına bırakılması, `crud` katmanını daha test edilebilir ve atomik hale getirmiştir. `claim` işlemindeki `flush`/`refresh`/`commit` sıralaması, veri bütünlüğünü sağlamak için titizlikle tasarlanmıştır.
*   **Rol Bazlı Arayüz:** Frontend, kullanıcının rolüne (`admin` veya `user`) göre dinamik olarak bileşenleri (butonlar, linkler) render eder. Bu, hem güvenliği hem de kullanıcı deneyimini artırır.
*   **Kalıcı Oturum (State Persistence):** Zustand'ın `persist` middleware'i ve `localStorage` kullanılarak, kullanıcı oturumu sayfa yenilendiğinde bile korunur, bu da kesintisiz bir deneyim sağlar.
*   **CI/CD Pipeline:** GitHub Actions ile kurulan otomasyon, `main` branch'ine gönderilen her kodun önce testlerden geçmesini zorunlu kılarak projenin stabilliğini sürekli olarak güvence altına alır.

---

## 8. Seed Üretimi ve Kullanımı

Projenin bekleme listesi sıralama mantığı, her adaya özgü olarak üretilen bir `seed` değerine dayanmaktadır. Bu, sıralama algoritmasının kopyalanamaz ve projeye özel olmasını sağlar.

*   **Üretilen Seed:** `895d010af242`
*   **Hesaplanan Katsayılar:** `A = 9`, `B = 15`, `C = 4`
*   **Kullanım:** Bu katsayılar, bir kullanıcı bekleme listesine katıldığında, kullanıcının hesap yaşı ve katılım zamanı gibi faktörlere dayalı olarak benzersiz bir `priority_score` hesaplayan formülde (`crud.py` içinde) kullanılır.

---

## 9. Bonus: AI Entegrasyonu

Admin paneline entegre edilen "AI ile Üret" özelliği, Google'ın **Gemini API**'sini kullanır. Admin, bir drop adı ve ilgili anahtar kelimeleri girdiğinde, bu özellik `gemini-2.5-flash` modeline bir istek göndererek ürün için kısa ve etkileyici bir pazarlama açıklaması üretir ve ilgili forma otomatik olarak doldurur. Bu, içerik oluşturma sürecini hızlandıran pratik bir özelliktir.