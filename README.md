# Cara Instalasi Proyek melalui Android Studio

Berikut adalah panduan langkah demi langkah untuk menginstal dan menjalankan proyek ini di Android Studio.

## Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut di komputer Anda:

1.  **Node.js dan npm:** Diperlukan untuk mengelola dependensi proyek web. Anda dapat mengunduhnya dari [nodejs.org](https://nodejs.org/).
2.  **Android Studio:** Lingkungan pengembangan terintegrasi (IDE) resmi untuk pengembangan aplikasi Android. Pastikan Anda juga menginstal Android SDK yang diperlukan melalui SDK Manager di Android Studio. Anda dapat mengunduhnya dari [developer.android.com/studio](https://developer.android.com/studio).
3.  **Git:** Diperlukan untuk mengkloning repositori ini.

## Langkah-langkah Instalasi

### Catatan untuk Pengguna Windows

- **Gunakan PowerShell atau Command Prompt:** Semua perintah di bawah ini harus dijalankan di terminal seperti PowerShell atau Command Prompt. Sebaiknya jalankan sebagai Administrator.
- **Masalah `npx` tidak dikenali:** Jika Anda mendapatkan galat seperti `npx is not recognized`, ini berarti Node.js tidak terinstal dengan benar di `PATH` sistem Anda.
    - **Solusi:** Instal ulang Node.js dari [nodejs.org](https://nodejs.org/). Selama instalasi, pastikan Anda mencentang kotak yang bertuliskan **"Automatically add to PATH"** atau opsi serupa.
    - Setelah instalasi, **tutup dan buka kembali** jendela terminal Anda agar perubahan `PATH` dapat diterapkan.

### 1. Kloning Repositori

Buka terminal atau command prompt Anda dan kloning repositori ini ke direktori lokal Anda menggunakan perintah berikut:

```bash
git clone <URL_REPOSITORI_ANDA>
cd <NAMA_DIREKTORI_PROYEK>
```

Ganti `<URL_REPOSITORI_ANDA>` dengan URL Git repositori dan `<NAMA_DIREKTORI_PROYEK>` dengan nama folder yang dihasilkan.

### 2. Instal Dependensi Proyek

Instal semua dependensi JavaScript yang diperlukan menggunakan npm:

```bash
npm install
```

Perintah ini akan mengunduh semua pustaka yang tercantum dalam file `package.json`.

### 3. Bangun Aset Web

Bangun versi produksi dari aset web (HTML, CSS, JavaScript). Ini akan membuat folder `dist` atau `build` yang akan digunakan oleh Capacitor.

```bash
npm run build
```

### 4. Sinkronkan dengan Proyek Android

Sinkronkan aset web yang telah Anda bangun dengan proyek Android asli menggunakan Capacitor CLI:

```bash
npx cap sync android
```

Perintah ini akan menyalin aset web ke dalam direktori proyek Android dan memperbarui dependensi apa pun yang diperlukan.

### 5. Buka di Android Studio

Buka proyek Android di Android Studio. Anda dapat melakukannya dengan mudah menggunakan perintah Capacitor berikut:

```bash
npx cap open android
```

Perintah ini akan secara otomatis meluncurkan Android Studio dan membuka folder `android` sebagai proyek.

### 6. Jalankan Aplikasi

Setelah proyek terbuka di Android Studio, tunggu hingga Gradle selesai menyinkronkan proyek. Kemudian, Anda dapat menjalankan aplikasi:

1.  Pilih perangkat (emulator atau perangkat fisik yang terhubung) dari daftar dropdown di bilah alat atas.
2.  Klik tombol **Run 'app'** (ikon putar hijau) atau pilih **Run > Run 'app'** dari menu.

Android Studio akan membangun file APK, menginstalnya di perangkat yang dipilih, dan meluncurkan aplikasi.

Selesai! Sekarang aplikasi Anda seharusnya berjalan di emulator atau perangkat Android Anda.
