# PetFrendly - Dijital Evcil Hayvan Uygulaması 🐾

PetFrendly, kullanıcıların kendi dijital dostlarını seçip onlarla ilgilenebileceği, oyunlar oynayarak gelişimlerini takip edebileceği modern ve eğlenceli bir **Tamagotchi** tarzı web uygulamasıdır.

## 🌟 Özellikler

- **Evcil Hayvan Seçimi:** Kedi, Köpek, Tavşan, Panda ve Hamster arasından favori dostunuzu seçin.
- **Bakım Sistemi:** Evcil hayvanınızın açlık ve mutluluk seviyelerini takip edin. Onu besleyerek (sürükle-bırak yemek sistemi) ve oyun oynayarak seviye atlatın.
- **TP ve Seviye Sistemi:** Etkileşimde bulundukça TP (Tecrübe Puanı) kazanın ve evcil hayvanınızı geliştirin.
- **Oyunlaştırma (Mini Oyunlar):**
  - **Labirent Koşucusu:** Petinizin yemeğini bulmasına yardım edin.
  - **Kule Yığma:** Blokları üst üste dizerek en yüksek kuleyi yapmaya çalışın.
  - **Evcil Hayvan Yapbozu:** Yenilenmiş özel tasarımıyla ekranın üstünde resmin tamamını görerek, alt kısımda parçaları birleştirin.

## 🚀 Nasıl Çalıştırılır?

Projeyi bilgisayarınızda çalıştırmak oldukça basittir:

### 1. Yöntem: Doğrudan Açma
Sadece `index.html` dosyasına çift tıklayarak herhangi bir tarayıcıda (Chrome, Edge, Firefox vb.) uygulamayı başlatabilirsiniz.

### 2. Yöntem: Yerel Sunucu (Tavsiye Edilen)
Daha akıcı bir deneyim için bir yerel sunucu kullanabilirsiniz:
- **VS Code kullanıyorsanız:** "Live Server" eklentisini kurup "Go Live" butonuna basın.
- **Python yüklüyse:** Terminale `python -m http.server` yazın.
- **Node.js yüklüyse:** `npx http-server` komutunu kullanın.

## 📱 Mobil Görüntüleme & Expo Go

Uygulamanızı telefonunuzda test etmek ve Expo Go tarzı bir QR kod deneyimi yaşamak isterseniz şu adımları izleyin:

### 1. Yerel Ağ Üzerinden Görüntüleme
1. Bilgisayarınızın **Yerel IP adresini** öğrenin (Terminale `ipconfig` yazarak!).
2. Telefonunuzun tarayıcısına `http://IP-ADRESINIZ:3000` yazarak bağlanın.

### 2. Yöntem: Expo Go ile Mobil Uygulama Olarak Açma (Yeni!)
Projeyi artık gerçek bir mobil uygulama gibi Expo Go üzerinden açabilirsiniz. Bunun için dosyalar hazırlandı:

1. **Bağımlılıkları Kurun:** Bilgisayarınızda Node.js yüklü olduğundan emin olun ve terminale şunu yazın:
   ```bash
   npm install
   ```
2. **Expo'yu Başlatın:**
   ```bash
   npx expo start
   ```
3. **Telefondan Bağlanın:**
   - Telefonunuza **Expo Go** uygulamasını (App Store/Play Store) indirin.
   - Terminalde çıkan **QR kodu** telefonunuzun kamerasıyla taratın.
   - Uygulama, sanki marketten inmiş bir uygulama gibi telefonunuzda açılacaktır!

*Not: Proje içerisindeki `App.js`, mevcut web kodlarınızı bir `WebView` içerisine sararak mobil uyumlu hale getirir.*

## 🛠️ Kullanılan Teknolojiler

- **HTML5:** Yapısal iskelet ve semantik içerik.
- **CSS3:** Modern cam efekti (glassmorphism), özel gradyanlar ve akıcı animasyonlar.
- **Vanilla JavaScript:** Oyun mantığı, sürükle-bırak etkileşimleri ve dinamik durum yönetimi.
- **Font Awesome:** Modern ikon setleri.
- **Google Fonts (Outfit & Nunito):** Premium tipografi.

petfreandly mobil uygulamamın youtube video linki:https://youtu.be/yGXd1iTNX9c

---
Geliştiren: [rabiaozbir7-netizen](https://github.com/rabiaozbir7-netizen)
