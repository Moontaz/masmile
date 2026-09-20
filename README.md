# masmile

**masmile** adalah website deteksi senyum real-time berbasis browser. Project ini menggabungkan webcam, MediaPipe Face Landmarker, facial landmarks, Canvas overlay, analisis geometri mulut, dan animasi GSAP dalam sebuah pengalaman visual editorial.

Semua proses deteksi berjalan secara lokal di browser. Frame webcam tidak dikirim ke backend dan tidak ada database atau sistem akun yang diperlukan.

## Fitur utama

- Deteksi wajah real-time melalui webcam browser.
- Dukungan beberapa wajah dalam satu frame.
- Pemilihan wajah utama berdasarkan wajah dengan area bounding box terbesar.
- Bounding box wajah yang mengikuti pergerakan wajah dengan smoothing untuk mengurangi jitter.
- Visualisasi facial landmarks yang difokuskan pada area mata, hidung, rahang, dan mulut.
- Estimasi intensitas senyum dari `0` sampai `100` menggunakan geometri facial landmarks.
- Smoothing score agar angka tidak berubah secara kasar setiap frame.
- State deteksi yang jelas:
   - `Camera off`
   - `Initializing`
   - `No face`
   - `Face detected`
   - `Analyzing`
   - `Slight smile`
   - `Smiling`
   - `Big smile`
   - `Smile detected`
   - `Detection unavailable`
- Event `Smile detected` dengan cooldown agar tidak terpicu di setiap frame.
- Capture moment dari frame webcam saat ini.
- Modal hasil capture dengan pilihan:
   - Retake
   - Save image
   - Close dengan tombol atau `Escape`
- Session history yang menyimpan event selama sesi browser aktif.
- Statistik sesi:
   - Best smile
   - Average score
   - Total smile events
- Halaman editorial Home, Detector, About, dan custom 404.
- Interactive 3D card flip di hero: kartu berotasi mengikuti kursor dengan perspective transform dan efek glare (hanya pointer fine, otomatis nonaktif saat `prefers-reduced-motion`).
- Page entrance, route transition, scroll reveal, modal transition, custom cursor desktop, dan responsive mobile navigation menggunakan GSAP.
- Dukungan `prefers-reduced-motion`.
- Layout tajam tanpa rounded card atau pill UI.
- Privacy copy dan disclaimer bahwa skor adalah estimasi, bukan analisis ilmiah, medis, atau psikologis.

## Teknologi

- [Next.js](https://nextjs.org/) 14 dengan App Router
- React 18
- TypeScript
- Tailwind CSS
- GSAP dan ScrollTrigger
- [MediaPipe Tasks Vision](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js)
- Web Camera API melalui `navigator.mediaDevices.getUserMedia()`
- HTML Canvas
- `requestAnimationFrame`

## Struktur project

```text
app/
  about/page.tsx              # Halaman About / How it works
  detector/page.tsx           # Route detector
  globals.css                # Design system dan responsive styles
  layout.tsx                 # Root layout, navigation, loader, transitions
  not-found.tsx              # Custom 404
  page.tsx                   # Homepage

components/
  animations/
    page-entrance.tsx
    scroll-reveal.tsx
  detector/
    capture-modal.tsx
    detection-status.tsx
    detector-app.tsx
    session-stats.tsx
  site/
    custom-cursor.tsx
    initial-loader.tsx
    navigation.tsx
    route-transition.tsx

data/
  config.ts                  # Threshold dan konfigurasi vision

hooks/
  use-camera.ts              # Lifecycle webcam dan permission state
  use-face-detection.ts      # MediaPipe initialization dan detection loop

lib/vision/
  render-overlay.ts           # Canvas bounding box dan landmarks
  smile-analysis.ts           # Estimasi smile dari geometri landmark
  types.ts                   # TypeScript types vision dan session
```

## Cara kerja deteksi

Alur utama aplikasi:

```text
Webcam
  ↓
MediaPipe Face Landmarker
  ↓
Normalized facial landmarks
  ↓
Face bounding box + Canvas overlay
  ↓
Mouth geometry analysis
  ↓
Smoothed smile intensity 0–100
  ↓
UI state + session event
```

### 1. Webcam

Kamera hanya diminta setelah user menekan **Start detection**. Stream diatur dengan atribut `playsInline`, `autoPlay`, dan `muted`. Semua track kamera dihentikan ketika detector dihentikan, component unmount, atau user berpindah route.

### 2. Face Landmarker

MediaPipe diinisialisasi secara lazy setelah kamera siap. Model menggunakan mode `VIDEO` dan dapat mendeteksi sampai empat wajah. Karena website dijalankan di browser, asset WASM dan model diambil saat runtime dari CDN:

- WASM: `cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm`
- Model: Google MediaPipe model storage

Koneksi internet diperlukan saat pertama kali model dan WASM belum tersedia di cache browser.

### 3. Primary face

Jika terdapat beberapa wajah, aplikasi memilih wajah dengan area bounding box terbesar sebagai primary face. Wajah lain tetap divisualisasikan secara restrained di Canvas, tetapi score utama dihitung dari primary face.

### 4. Bounding box dan Canvas

Detection loop berjalan dengan `requestAnimationFrame`. React tidak melakukan `setState` pada setiap frame. Canvas menyimpan dan menggambar:

- Corner bracket bounding box
- Landmark mata, hidung, dan area wajah
- Landmark mulut
- Label score pada primary face

Koordinat bounding box dihaluskan menggunakan interpolasi agar tetap responsif tanpa terlihat bergetar.

### 5. Smile estimation

Skor bukan hasil emotion recognition. Skor adalah heuristik geometri dari facial landmarks MediaPipe, menggunakan:

- Lebar mulut relatif terhadap lebar wajah
- Tinggi/bukaan mulut relatif terhadap wajah
- Kenaikan posisi sudut mulut

Sinyal tersebut dipetakan ke score `0–100` dan kemudian dihaluskan lagi secara temporal. Threshold awal yang digunakan:

```text
0–30      Neutral
30–60     Slight smile
60–80     Smiling
80–100    Big smile
```

Threshold ini adalah konfigurasi visual untuk pengalaman interaktif, bukan standar ilmiah.

## Routes

| Route                 | Deskripsi                                                                |
| --------------------- | ------------------------------------------------------------------------ |
| `/`                   | Homepage dan pengantar pengalaman                                        |
| `/detector`           | Fitur webcam, face detection, smile analysis, capture, dan session stats |
| `/about`              | Penjelasan singkat pipeline teknis dan privacy                           |
| Route tidak ditemukan | Custom animated 404                                                      |

## Menjalankan secara lokal

### Prasyarat

- Node.js 18.17 atau lebih baru
- npm 9 atau lebih baru
- Browser modern dengan dukungan webcam dan WebAssembly
- Webcam yang dapat diakses oleh browser

### Instalasi

```bash
npm install
npm run dev
```

Buka:

```text
http://localhost:3000
```

### Script yang tersedia

```bash
npm run dev        # Menjalankan development server
npm run lint       # Menjalankan Next.js ESLint
npm run typecheck  # Menjalankan TypeScript tanpa emit
npm run build      # Membuat production build
npm run start      # Menjalankan hasil production build
```

## Izin kamera dan HTTPS

Browser umumnya hanya mengizinkan webcam pada:

- `localhost`
- koneksi HTTPS

Untuk production, deploy menggunakan platform HTTPS seperti Vercel, Netlify, Cloudflare Pages, atau server lain yang menyediakan TLS.

Jika kamera tidak berjalan:

1. Pastikan permission kamera diberikan untuk domain yang sedang dibuka.
2. Pastikan tidak ada aplikasi lain yang sedang mengunci webcam.
3. Coba reload halaman setelah permission diubah.
4. Pastikan browser mendukung WebAssembly dan `getUserMedia()`.
5. Jika model tidak dapat dimuat, pastikan koneksi ke jsDelivr dan Google Storage tidak diblokir oleh firewall atau extension.

## Deployment ke GitHub dan Vercel

Project ini tidak membutuhkan environment variable untuk fitur utama. Setelah membuat repository GitHub, jalankan:

```bash
git init
git add .
git commit -m "Build real-time smile detector website"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Untuk deploy ke Vercel:

1. Import repository GitHub ke Vercel.
2. Pilih framework preset `Next.js`.
3. Gunakan `npm install` sebagai install command jika diminta.
4. Gunakan `npm run build` sebagai build command.
5. Deploy.
6. Buka URL HTTPS hasil deploy dan izinkan akses kamera.

Jangan commit file berikut ke GitHub:

- `node_modules/`
- `.next/`
- `.env*`
- log dan file hasil coverage
- file setting lokal editor

Semua sudah dicakup oleh `.gitignore`.

## Privacy dan batasan

Frame webcam diproses di browser. Project ini tidak memiliki backend untuk upload frame, tidak menyimpan biometric data, dan tidak mengirim captured photo ke server.

Captured image hanya dibuat sebagai data URL lokal untuk preview dan download yang dipicu user.

Smile score dipengaruhi oleh pencahayaan, sudut kamera, jarak ke kamera, kualitas webcam, posisi wajah, dan variasi bentuk wajah. Score tidak boleh dipahami sebagai:

- emotion recognition
- pengukuran psikologis
- pengukuran medis
- pengukuran ilmiah tervalidasi

## Performance notes

Architecture realtime sengaja dipisahkan dari React UI:

- Detection dan Canvas berjalan di `requestAnimationFrame`.
- Mutable values seperti score dan smoothing disimpan dalam refs.
- React state hanya menerima perubahan UI bermakna atau callback yang sudah di-throttle.
- GSAP digunakan untuk page/UI transition, bukan untuk mengontrol setiap frame computer vision.
- Camera tracks, animation frames, timers, GSAP contexts, dan event listener dibersihkan saat component unmount.

## Lisensi

Project ini dibuat sebagai creative frontend and computer-vision experiment. Tambahkan lisensi repository yang sesuai kebutuhan sebelum dipublikasikan secara resmi.
#   m a s m i l e 
 
 
