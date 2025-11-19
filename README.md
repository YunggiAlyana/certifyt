# 🎓 CertifYT - YouTube Playlist Certificate Generator

**CertifYT** adalah aplikasi web yang mengubah *effort* belajar mandiri di YouTube menjadi bukti pencapaian yang valid. Cukup tempel link playlist, dan dapatkan sertifikat profesional dengan estimasi total durasi belajar.

👉 **Live Demo:** [https://certifyt.vercel.app](https://certifyt.vercel.app)

---

## ✨ Fitur Utama

Proyek ini dibangun untuk menyelesaikan masalah "belajar tapi tidak ada bukti" dengan pendekatan *engineering* yang serius:

* ⏱️ **Kalkulasi Total Durasi:** Menghitung total jam & menit dari seluruh video dalam playlist (bukan sekadar jumlah video).
* 🔗 **Verifikasi QR Code:** Setiap sertifikat memiliki QR Code unik yang dapat discan untuk memverifikasi keasliannya.
* 🖨️ **Cetak PDF Otomatis:** Menggunakan teknik *CSS Print* canggih untuk menghasilkan layout A4 Landscape yang sempurna saat dicetak/disimpan sebagai PDF.
* 💼 **Integrasi LinkedIn:** Tombol 1-klik untuk menambahkan sertifikat langsung ke profil LinkedIn (Licenses & Certifications).
* 🛡️ **Database Terpusat:** Data sertifikat disimpan aman di Supabase (PostgreSQL).

---

## 🛠️ Tech Stack

Aplikasi ini dibangun dengan teknologi *modern web* terkini:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
* **API:** YouTube Data API v3
* **Libraries:** `qrcode`, `googleapis`
* **Deployment:** Vercel

---

## 🚀 Cara Menjalankan di Lokal

Ikuti langkah ini untuk menjalankan proyek di komputer Anda:

1.  **Clone repository:**
    ```bash
    git clone [https://github.com/YunggiAlyana/certifyt.git](https://github.com/YunggiAlyana/certifyt.git)
    cd certifyt
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Buat file `.env.local` dan isi dengan kredensial Anda:
    ```env
    # Google Cloud Console (YouTube Data API v3)
    GOOGLE_API_KEY="AIzaSy..."

    # Supabase Database
    NEXT_PUBLIC_SUPABASE_URL="[https://your-project.supabase.co](https://your-project.supabase.co)"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJh..."
    ```

4.  **Jalankan Server:**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000).

---

## 💡 Acknowledgements & Inspirasi

Ide awal proyek ini terinspirasi dari konten TikTok kreator **@dimasmiftah** ([Tonton Videonya di Sini](https://vt.tiktok.com/ZSf8m2evw/)) yang mendemonstrasikan konsep dasar generator sertifikat.

**CertifYT** adalah pengembangan lebih lanjut dari ide tersebut dengan fokus pada skalabilitas dan fitur profesional, seperti:
1.  Perhitungan **Real Total Duration** (mengambil durasi tiap video via API).
2.  Sistem **Verifikasi QR Code** yang terintegrasi.
3.  Layout sertifikat yang **Print-Friendly (PDF)**.
4.  Integrasi langsung ke **LinkedIn**.

---

Made with ☕ and 💻 by **[Yunggi Alyana]**