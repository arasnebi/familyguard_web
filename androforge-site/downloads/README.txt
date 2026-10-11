androforge.online — downloads/ klasörü
=====================================

Bu klasör, web sitesindeki "İmzalı APK indir" düğmelerinin dosyalarını tutar.
Şu anda site bu klasördeki şu iki dosyayı bekler:

  1) FamilyGuard_cocuk_v1.0.12_release.apk      (çocuk cihazı uygulaması)
  2) FamilyGuard_ebeveyn_v1.2.0_release.apk     (ebeveyn uygulaması)

APK dosyalarını buraya bu adlarla kopyalamanız yeterlidir. Dosyalar
eklenmezse düğmeye basıldığında 404 hatası alınır.

KURULUM (Windows / GitHub Pages deposu)
---------------------------------------
1. APK dosyalarını, sürüm numaraları yukarıdakilerle birebir aynı olacak
   şekilde bu "downloads" klasörüne kopyalayın.
   Örnek:
     familyguard_web\downloads\FamilyGuard_cocuk_v1.0.12_release.apk
     familyguard_web\downloads\FamilyGuard_ebeveyn_v1.2.0_release.apk

2. Farklı bir sürüm yayınlarsanız iki yeri güncelleyin:
   - APK dosya adını bu klasörde değiştirin
   - assets\js\main.js içindeki RELEASES bloğunu güncelleyin:
       apkChild:  'downloads/FamilyGuard_cocuk_vX.Y.Z_release.apk'
       apkParent: 'downloads/FamilyGuard_ebeveyn_vX.Y.Z_release.apk'

3. SHA-256 doğrulaması için SHA256SUMS.txt dosyasını güncelleyin
   (aşağıdaki komutla yeniden üretin):

   Windows (PowerShell):
     Get-FileHash .\downloads\FamilyGuard_cocuk_v1.0.12_release.apk -Algorithm SHA256

   Linux / macOS:
     shasum -a 256 downloads/*.apk

NOTLAR
------
- GitHub Pages tek dosya için ~100 MB sınırı uygular. APK'lar bu sınırın
  altında kaldığı sürece sorun yoktur (çocuk ~54 MB, ebeveyn ~30 MB).
- Dosyalar .gitignore ile hariç tutulmuşsa Git'e eklemek için:
    git add -f downloads/*.apk
- Ebeveyn uygulaması Google Play'de yayına girdiğinde assets/js/main.js
  içindeki playParent alanına Play URL'sini yazın; o düğme otomatik olarak
  Play'e yönlenir (boş bırakılırsa imzalı APK'ya düşer).

İletişim: familyguard.destek@gmail.com
