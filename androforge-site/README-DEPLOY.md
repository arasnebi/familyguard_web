# androforge.online — Kurulum ve Yayın Kılavuzu

Bu paket, `androforge.online` sitesinin **düzeltilmiş ve eksiksiz** halidir.
GitHub Pages üzerinde çalışır; sunucu, veritabanı veya aylık ücret gerektirmez.

---

## 1. Bu pakette neler düzeltildi?

| Sorun | Durum |
|---|---|
| Site boş görünüyordu (siyah ekran, içerik yok) | ✅ **Çözüldü** — `assets/js/main.js` içine yanlışlıkla yapıştırılmış HTML bloğu JavaScript'i tamamen bozuyordu (SyntaxError). Blok kaldırıldı, dosya sıfırdan yazıldı. |
| `.reveal` animasyonlu bölümler JS hatası yüzünden görünmez kalıyordu | ✅ **Çözüldü** — CSS'e `html.js` güvenlik kapısı eklendi. Artık JS hata verse bile tüm içerik görünür kalır. |
| `index.html` içinde lightbox bloğu `</head>` ile `<body>` arasına yapışmıştı | ✅ **Çözüldü** — blok `</body>` öncesine taşındı, lightbox çalışır durumda. |
| "İmzalı APK indir" düğmeleri hiçbir şeye bağlı değildi | ✅ **Çözüldü** — main.js içindeki `RELEASES` ayarına bağlandı; `downloads/` klasörüne APK koymanız yeterli. |
| 6 ekran görüntüsü ve `og.png` 404 veriyordu | ✅ **Geçici görseller üretildi** — gerçek uygulama ekran görüntüleriyle aynı adlarla değiştirebilirsiniz (bkz. Bölüm 5). |
| İletişim formu sahte bir Formspree adresine (`/f/XXXXXXXX`) gönderiyordu | ✅ **Çözüldü** — form kimliği girilmediği sürece form otomatik olarak e-posta taslağına düşer; mesaj kaybolmaz (bkz. Bölüm 6). |

Yayın öncesi kontrol için: `KONTROL-RAPORU.md` dosyasına bakın.

---

## 2. Dosyaları kendi bilgisayarınıza kopyalama

1. Bu paketi (`androforge-site.zip`) açın.
2. İçindeki **tüm dosyaları** kendi depo klasörünüze kopyalayın:

   ```
   C:\Users\omert\OneDrive\masaüstü\familyguard_web\
   ```

   Klasör şöyle görünmeli:

   ```
   familyguard_web\
     index.html
     familyguard.html
     androforge.html
     abonelik.html
     iletisim.html
     yasal.html
     404.html
     CNAME
     robots.txt
     sitemap.xml
     .nojekyll
     README-DEPLOY.md
     KONTROL-RAPORU.md
     assets\
       css\style.css
       js\main.js
       img\favicon.svg
       img\og.png
       img\screens\fg-01-harita.png ... fg-06-ayarlar.png
     downloads\
       README.txt
       SHA256SUMS.txt
       (APK dosyalarını buraya ekleyeceksiniz — Bölüm 4)
   ```

> **`.nojekyll` dosyası önemlidir.** Dosya adı nokta ile başladığı için
> Windows Gezgini'nde görünmeyebilir. Silmeyin; GitHub Pages'in
> dosyaları olduğu gibi sunmasını sağlar.

---

## 3. Değişiklikleri GitHub'a gönderme

PowerShell'i açın ve sırayla çalıştırın:

```powershell
cd "C:\Users\omert\OneDrive\masaüstü\familyguard_web"

# Git kimliği (bir kez yeterli — daha önce aldığınız hatayı bu çözer)
git config --global user.name "omert"
git config --global user.email "familyguard.destek@gmail.com"

git add -A
git commit -m "Site duzeltmeleri: bos sayfa hatasi, ekran goruntuleri, indirme dugmeleri, iletisim formu"
git push
```

Push sonrası GitHub Actions/Pages 1–3 dakika içinde siteyi yeniler.
Değişiklikleri şu adreste görebilirsiniz: <https://www.androforge.online/>

> **Not:** `git push` çalışmıyorsa kişisel erişim anahtarı (token) gerekir:
> GitHub → Settings → Developer settings → Personal access tokens →
> Fine-grained tokens → repo erişimi `Contents: Read and write`.
> Parola sorulduğunda şifre değil bu token'ı girin.

---

## 4. APK dosyalarını siteye ekleme (indirme düğmeleri için şart)

1. Elinizdeki iki APK'yı `downloads\` klasörüne, **tam olarak şu adlarla** kopyalayın:

   ```
   familyguard_web\downloads\FamilyGuard_cocuk_v1.0.12_release.apk
   familyguard_web\downloads\FamilyGuard_ebeveyn_v1.2.0_release.apk
   ```

2. Doğrulama özetlerini güncelleyin (`downloads\SHA256SUMS.txt`):

   ```powershell
   Get-FileHash .\downloads\FamilyGuard_cocuk_v1.0.12_release.apk -Algorithm SHA256
   Get-FileHash .\downloads\FamilyGuard_ebeveyn_v1.2.0_release.apk -Algorithm SHA256
   ```

   Çıkan değer, sitede yayınladığınız APK'nın parmak izidir; kullanıcılar
   indirdikleri dosyayı bununla karşılaştırabilir. **Güven veren sitede bu
   adım önemlidir.**

3. Git'e ekleyip gönderin (`.gitignore` APK'ları dışlıyorsa `-f` şart):

   ```powershell
   git add -f downloads/*.apk downloads/SHA256SUMS.txt
   git commit -m "Imzali APK dosyalari ve SHA-256 ozetleri"
   git push
   ```

4. GitHub Pages tek dosya için **100 MB** sınırı koyar. APK'lar bu sınırın
   altında kaldığı sürece sorun yoktur. Sınırı aşarsanız dosyaları
   GitHub Releases'e yükleyip `main.js` içindeki `RELEASES` adreslerini
   tam URL ile değiştirin.

**Yeni sürüm çıktığında:** APK dosya adı + `assets\js\main.js` içindeki
`RELEASES` bloğu + `downloads\SHA256SUMS.txt` — üçünü birlikte güncelleyin.

---

## 5. Ekran görüntülerini gerçek uygulamayla değiştirme

Şu an 6 markalı **yer tutucu** görsel var (siteyi boş göstermemek için).
Gerçek ekran görüntülerinizle değiştirmek için aynı dosya adlarını kullanın:

```
assets\img\screens\fg-01-harita.png      (Canlı konum ekranı)
assets\img\screens\fg-02-eslesme.png     (Eşleştirme kodu ekranı)
assets\img\screens\fg-03-gecmis.png      (Konum geçmişi)
assets\img\screens\fg-04-cihazlar.png    (Cihazlar / izin durumu)
assets\img\screens\fg-05-bildirim.png    (Bildirimler)
assets\img\screens\fg-06-ayarlar.png     (Ayarlar)
assets\img\og.png                        (1200×630 sosyal medya görseli)
```

- Telefon ekran görüntüleri **dikey (portre)** olmalı; 1080×2400 ideal.
- `og.png` **1200×630** (yatay) olmalı — WhatsApp/X/LinkedIn önizlemesinde görünür.
- Dosya adlarını değiştirirseniz `index.html` içindeki `src="..."` yollarını
  ve `<meta property="og:image">` etiketini de güncellemeniz gerekir.

---

## 6. İletişim formunu tam çalışır hale getirme (opsiyonel)

Şu anda form, mesajı **e-posta taslağına** çevirir (Formspree kimliği
girilmediği için). Kullanıcı "Gönder"e bastığında kendi e-posta uygulaması
`familyguard.destek@gmail.com` adresine hazır mesajla açılır — mesaj kaybolmaz.

Sunucu üzerinden sessiz gönderim isterseniz:

1. <https://formspree.io> üzerinden ücretsiz bir form oluşturun (aylık 50 mesaj ücretsiz).
2. Size verilen `https://formspree.io/f/abcdwxyz` adresini kopyalayın.
3. `iletisim.html` dosyasında şu satırı bulun ve `XXXXXXXX` yerine kendi kimliğinizi yazın:

   ```html
   <form id="contact-form" class="form" action="https://formspree.io/f/XXXXXXXX" method="POST" novalidate>
   ```

4. `git add -A && git commit -m "Formspree baglantisi" && git push`

Form kimliği girildiği anda JavaScript otomatik olarak gerçek gönderime
geçer; e-posta yedeği devre dışı kalır.

---

## 7. DNS ve alan adı ayarları (NameCheap)

Mevcut durum: **`www.androforge.online` çalışıyor.** Apex (`androforge.online`)
adresinin de açılması için şunları yapın:

1. NameCheap → Domain List → `androforge.online` → **Advanced DNS**.
2. Şu kayıtları ekleyin (varsa eskisini düzenleyin):

   | Type | Host | Value | TTL |
   |---|---|---|---|
   | A Record | `@` | `185.199.108.153` | Automatic |
   | A Record | `@` | `185.199.109.153` | Automatic |
   | A Record | `@` | `185.199.110.153` | Automatic |
   | A Record | `@` | `185.199.111.153` | Automatic |
   | CNAME Record | `www` | `arasnebi.github.io.` | Automatic |

   (İsteğe bağlı, IPv6 için: `AAAA` → `@` → `2606:50c0:8000::153`,
   `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`)

3. GitHub → depo → **Settings → Pages → Custom domain** alanına
   `www.androforge.online` yazıp **Save** (bu hâlihazırda ayarlıysa dokunmayın).
4. Aynı sayfada **Enforce HTTPS** kutusunu işaretleyin.
5. GitHub, doğru DNS kayıtları olduğunda apex ↔ www arasında **otomatik
   yönlendirme** yapar. Yani 4 A kaydını ekledikten sonra `androforge.online`
   adresi `www.androforge.online` adresine yönlenir.
6. DNS değişikliği 5 dakika – 24 saat arasında yayılır. Kontrol:

   ```powershell
   nslookup androforge.online
   nslookup www.androforge.online
   ```

> **Siteyi apex adreste (`androforge.online`) göstermek isterseniz:**
> GitHub Pages ayarında Custom domain alanına `androforge.online` yazmanız
> yeterlidir; bu durumda `www` otomatik olarak apex'e yönlenir. **Sıra
> önemlidir:** önce 4 A kaydını ekleyip DNS'in yayıldığını doğrulayın,
> sonra GitHub ayarını değiştirin. Aksi hâlde iki adres de geçici olarak
> açılmaz.

> **Uyarı:** Apex için NameCheap'in "URL Redirect Record" (eski yönlendirme)
> kaydı varsa silin; GitHub Pages ile çakışır.

---

## 8. Yayın sonrası kontrol listesi

- [ ] `https://www.androforge.online/` açılıyor ve içerik görünüyor (siyah boş ekran yok).
- [ ] Ana sayfadaki 6 ekran görüntüsü görünüyor, tıklayınca büyüyor (lightbox).
- [ ] `https://www.androforge.online/familyguard.html` → **İmzalı APK indir** düğmeleri dosyayı indiriyor.
- [ ] `https://www.androforge.online/downloads/SHA256SUMS.txt` açılıyor.
- [ ] `https://www.androforge.online/yasal.html` açılıyor (yasal uyarı sayfası).
- [ ] `https://www.androforge.online/iletisim.html` → form "Gönder" deyince e-posta taslağı açılıyor.
- [ ] Mobilde menü (☰) açılıp kapanıyor.
- [ ] Tema düğmesi (☀️/🌙) açık/koyu modu değiştiriyor.
- [ ] `https://www.androforge.online/robots.txt` ve `/sitemap.xml` erişilebilir.
- [ ] Google Search Console'a `sitemap.xml` eklendi (opsiyonel, SEO için iyi olur).

---

## 9. Yasal sorumluluk (kullanıcıya yönelik uyarılar)

Site şu korumaları **hâlihazırda içerir**:

- `yasal.html` — 10 maddelik Kullanım Koşulları ve Yasal Uyarı:
  yetkili kullanım zorunluluğu, sorumluluğun reddi, kabul edilemez kullanım,
  abonelik/ödeme, gizlilik, fikri mülkiyet.
- `androforge.html` — sayfanın en üstünde turuncu uyarı kutusu:
  "Sadece yetkili kullanım… Başkasına ait cihazlarda izinsiz kullanım suçtur.
  Tüm sorumluluk kullanıcıya aittir."
- `familyguard.html` — rıza ve aile içi kullanım çerçevesi.
- Her sayfanın alt bilgisinde **Yasal** bağlantısı bulunur.

**Yayın öncesi kontrol edin:** `familyguard.destek@gmail.com` adresinin
gerçekten sizin yönetiminizde ve düzenli bakılan bir kutu olduğundan emin olun;
yasal metinlerde bu adres sorumluluk ve iletişim kanalı olarak gösteriliyor.

---

## 10. Sorun giderme

| Belirti | Olası neden ve çözüm |
|---|---|
| Site hâlâ boş görünüyor | Tarayıcı önbelleği: **Ctrl + F5**. Sayfa kaynağını (Ctrl+U) açıp `main.js` yüklendiğini doğrulayın. |
| Ekran görüntüleri kırık ikon | Dosya adları büyük/küçük harf duyarlıdır (GitHub Pages Linux sunucusudur). Adları birebir kopyalayın. |
| APK düğmesi 404 | APK'lar `downloads/` klasöründe değil ya da adları farklı. Bölüm 4'e bakın. |
| `git push` reddedildi | Token gerekli, bkz. Bölüm 3. |
| "Enforce HTTPS" işaretlenemiyor | DNS yayılmamış. 24 saat bekleyip sayfayı yenileyin. |
| GitHub Pages build hatası | Depo ayarında yayın kaynağının **main / (root)** olduğundan emin olun (Settings → Pages → Source). |
| CNAME dosyası silindi | GitHub Pages ayarında özel alan adı kaydedildiğinde GitHub bu dosyayı kendisi yazar; elle eklemeniz gerekmez. |

---

**İletişim:** familyguard.destek@gmail.com · <https://androforge.online>
