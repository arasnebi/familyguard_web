# KONTROL-RAPORU — androforge.online düzeltmeleri (11 Ekim 2026)

Bu rapor, yerel test ortamında (localhost sunucusu + başsız Chromium)
yapılan uçtan uca kontrollerin sonuçlarını gösterir.

## 1. Kök neden ve düzeltme özeti

| # | Sorun | Kök neden | Uygulanan düzeltme | Sonuç |
|---|---|---|---|---|
| 1 | Site boş/siyah görünüyordu | `main.js` sonuna yapıştırılan HTML bloğu tüm JS'i SyntaxError ile öldürüyordu; IntersectionObserver hiç çalışmıyordu | `main.js` sıfırdan yazıldı (temiz IIFE) | ✅ Doğrulandı |
| 2 | İçerik JS hatasında kalıcı görünmez | `.reveal{opacity:0}` kuralı JS'e bağlıydı; yükleme sırası bozulunca içerik gizli kalıyordu | `<script>document.documentElement.classList.add('js')</script>` 7 sayfada head'e eklendi; CSS kuralları `html.js` kapısıyla yeniden yazıldı | ✅ Doğrulandı |
| 3 | **Yeni bulunan gizli hata:** `.reveal.in` kuralı `html.js .reveal` kuralını yenemiyordu (CSS özgüllük sırası) — site düzeltilmiş JS ile bile boş kalacaktı | `.reveal.in` (0,2,0) < `html.js .reveal` (0,2,1) | Kural `html.js .reveal.in{opacity:1;transform:none}` olarak yükseltildi (style.css satır 116) | ✅ Doğrulandı |
| 4 | Lightbox `</head>` ile `<body>` arasındaydı | HTML yapı hatası | `</body>` öncesine taşındı (index.html satır 244-247) | ✅ Doğrulandı |
| 5 | APK indirme düğmeleri ölüydü | `data-apk-*` özniteliklerine bağlanmış JS yoktu | `RELEASES` yapılandırması + href/download atama eklendi | ✅ Doğrulandı |
| 6 | 6 ekran görüntüsü + og.png 404 | Dosyalar yoktu | Markalı yer tutucu PNG'ler üretildi (1080×2400 + 1200×630) | ✅ Üretildi, gerçek görüntüyle değiştirilebilir |
| 7 | İletişim formu sahte Formspree adresine POST atıyordu | `action="https://formspree.io/f/XXXXXXXX"` | JS, kimlik girilmemişse formu `mailto:familyguard.destek@gmail.com` e-posta taslağına düşürüyor | ✅ Doğrulandı |
| 8 | Hero'daki emoji yer tutucu amatör görünüyordu | — | Çerçeveli gerçek ekran görüntüsüyle (fg-01) değiştirildi | ✅ Doğrulandı |

## 2. Tarayıcı içi doğrulama kanıtları (localhost:8080)

- `document.documentElement.classList` → `js` mevcut; `node --check assets/js/main.js` → sözdizimi OK.
- Ana sayfa hero bölümü: başlık, açıklama ve çerçeveli ekran görüntüsü **görünür**
  (`.hero__shot img` `naturalWidth>0` → görsel yüklendi).
- `.reveal` öğeleri: görünürlük için `.in` sınıfı ekleniyor, opacity 1'e geçiyor
  (CSS düzeltmesi sonrası tarayıcı kuralları: `html.js .reveal.in { opacity: 1 }` yüklendi).
- İndirme düğmeleri (familyguard.html):
  - çocuk → `downloads/FamilyGuard_cocuk_v1.0.12_release.apk` + `download` özniteliği ✅
  - ebeveyn → `downloads/FamilyGuard_ebeveyn_v1.2.0_release.apk` + `download` özniteliği ✅
  - Google Play düğmesi → imzalı APK'ya düşüyor + bilgilendirici `title` ✅
    (Play yayına girince `main.js` içindeki `playParent` alanına URL yazılacak)
- Lightbox: ekrana tıklayınca `#lightbox.open=true`, görsel yükleniyor, `aria-hidden=false`; ✕/Escape ile kapanıyor. ✅
- İletişim formu: geçerli veriyle submit → hata yok, yeşil bilgi mesajı görünüyor
  ("E-posta uygulamanız açılıyor…"), mailto taslağı oluşuyor. ✅
- Ekran görüntüleri: `fg-01..06` ve `og.png` HTTP 200 ile dönüyor. ✅
- `downloads/FamilyGuard_cocuk_v1.0.12_release.apk` → **404 (beklenen)**:
  APK dosyaları kullanıcı tarafından eklenecek; adımlar `README-DEPLOY.md` Bölüm 4'te.

## 3. Dosya listesi (paket içeriği)

```
index.html, familyguard.html, androforge.html, abonelik.html,
iletisim.html, yasal.html, 404.html
CNAME, robots.txt, sitemap.xml, .nojekyll
README-DEPLOY.md, KONTROL-RAPORU.md
assets/css/style.css
assets/js/main.js
assets/img/favicon.svg, assets/img/og.png
assets/img/screens/fg-01-harita.png … fg-06-ayarlar.png
downloads/README.txt, downloads/SHA256SUMS.txt
```

## 4. Sizin yapmanız gerekenler (özet)

1. Paketi `familyguard_web` klasörüne kopyalayın → `git add -A && git commit && git push`
   (ayrıntılı komutlar: `README-DEPLOY.md` Bölüm 3).
2. İmzalı APK'ları `downloads/` klasörüne ekleyin (Bölüm 4).
3. NameCheap'e apex için 4 A kaydı ekleyin (Bölüm 7) — `androforge.online` de açılsın.
4. Gerçek ekran görüntülerinizle yer tutucuları değiştirin (Bölüm 5).
5. Yayın sonrası kontrol listesini işaretleyin (Bölüm 8).