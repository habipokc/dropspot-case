# DropSpot - Sınırlı Stok ve Bekleme Listesi Platformu

 DropSpot Case 

## Proje Özeti

DropSpot, özel ürünlerin veya etkinliklerin sınırlı stokla yayımlandığı, kullanıcıların bekleme listesine katılarak hak kazanmaya çalıştığı bir platformdur.

**Teknoloji Stack'i:**
*   **Backend:** Python, FastAPI, PostgreSQL
*   **Frontend:** Next.js, TypeScript, Tailwind CSS

---

## Seed Üretimi ve Kullanımı

Projenin bekleme listesi sıralama mantığı, her adaya özgü olarak üretilen bir `seed` değerine dayanmaktadır. Bu, sıralama algoritmasının kopyalanamaz ve projeye özel olmasını sağlar.

### Üretim Adımları

Seed, aşağıdaki üç bilginin birleştirilip SHA256 hash'inin alınmasıyla oluşturulmuştur:

*   **GitHub Remote URL:** `https://github.com/habipokc/dropspot-case.git`
*   **İlk Commit Zaman Damgası (Epoch):** `1762327896`
*   **Projeye Başlama Zamanı:** `202511051108`

### Proje Seed ve Katsayıları

*   **Üretilen Seed:** `895d010af242`
*   **Hesaplanan Katsayılar:**
    *   `A = 7 + (int('89', 16) % 5) = 9`
    *   `B = 13 + (int('5d', 16) % 7) = 15`
    *   `C = 3 + (int('01', 16) % 3) = 4`

Bu katsayılar, kullanıcıların `priority_score` değerini hesaplayan formülde kullanılacaktır.