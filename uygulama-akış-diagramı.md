# Uygulama Akış Diyagramı

```mermaid
flowchart TD

    A[Uygulama Açılış] --> B{Oturum Var mı?}
    B -- Hayır --> C[Giriş Yap / Kayıt Ol]
    B -- Evet --> D[Ana Menü]

    %% Ana Menü
    D --> E[Satıcı Paneli]
    D --> F[Satıcı Listesi]
    D --> G[Satıcı Profili]
    D --> H[Ürün Ekle]
    D --> I[Satışlarım]
    D --> J[Ürün Detay]
    D --> K[Sepet & Ödeme]
    D --> L[Siparişler]
    D --> M[Sipariş Detay]
    D --> N[Mesajlar]
    D --> O[Kategoriler]
    D --> P[Arama]
    D --> Q[Favoriler]
    D --> R[Hesap]

    %% Hesap
    R --> R1[Hesap Ayarları]
    R --> R2[Profil Güncelle]
    R --> R3[Şifre Değiştir]
    R --> R4[Bildirimler]
    R --> R5[Cüzdan Yönetimi]

    %% Cüzdan Yönetimi
    R5 --> C1{Ödeme Yöntemi Seç}
    C1 --> C2[Kredi Kartı]
    C1 --> C3[Banka Kartı]
    C1 --> C4[Dijital Cüzdan]
    R5 --> C6[İşlem Geçmişi]
    R5 --> C7[Cüzdan Bakiye]
    R5 --> C8[Cüzdan Yükle]
    R5 --> C9[Cüzdan Çek]
    R5 --> C10{Para Çekme İsteği}
    C10 --> C11[Onaylandı]
    C10 --> C12[Reddedildi]

    %% Satıcı İşlemleri
    E --> S1[Satıcı Ol]
    E --> S2[Teklif Ver]
    E --> S3[Ürün Bilgisi Gir]
    E --> S4[Ürün Fotoğrafı Yükle]
    E --> S5[Fiyat Belirle]
    E --> S6{Stok Durumu}
    S6 --> S7[Stok Ekle]
    S6 --> S8[Stok Azalt]

    %% Ödeme İşlemleri
    K --> O1{Ödeme Onayı}
    O1 --> O2[Ödeme Başarılı]
    O1 --> O3[Ödeme Başarısız]
    K --> O4[Sipariş Onayla]
    K --> O5[Sipariş İptal]

    %% Mesajlar
    N --> M1[Mesaj Gönder]
    N --> M2[Mesaj Al]
    N --> M3[Sohbet]

    %% Favoriler
    Q --> F1[Favori Ekle]
    Q --> F2[Favori Kaldır]

    %% Genel
    X[Genel Seçimler: Evet / Hayır / Başarılı / Azaltıldı / Eklendi]
