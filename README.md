# KMZ → Excel FTTH GIS Normalizer V4

Web application *client-side* modern dengan tema **Cyber Neon High-Precision** untuk mengekstrak seluruh item file KMZ/KML, mempertahankan data asli, dan menormalkan semantik aset FTTH (Tiang, ODP/DPFO, Kabel Fiber Optic, Joint Closure, Homepass, Boundary) secara otomatis.

---

## 🚀 Fitur Utama & Pembaruan V4

### 1. Rekapitulasi Material & Bill of Quantity (BOQ) Excel
- **Sheet `BOQ Summary`**: Rekapitulasi otomatis seluruh material dan aset per kategori (`POLE`, `DPFO`, `CABLE`, `JOINTBOX`, `HOME_PASS`, dll.), subtype spesifikasi, status jaringan, jumlah unit, dan **total panjang kabel (meter)**.
- **Urutan Kolom Rapi**: Kolom utama (`Normalized Type`, `Subtype`, `Network Status`, `Asset ID`, `Name`, `Cable Core`, `Cable Length`, `Coordinates`, `Folder`) otomatis ditempatkan di posisi paling depan.
- **Daftar Sheet Excel Lengkap**:
  1. `BOQ Summary` (Rekapitulasi Material & Aset)
  2. `Summary` (Metadata file & ringkasan statistik)
  3. `All Items` (Semua item ter-normalisasi lengkap)
  4. `Review` (Item Placemark yang membutuhkan review/konfirmasi)
  5. `Coordinates` (Daftar vertex latitude, longitude, altitude)
  6. `ExtendedData` (Atribut GIS KML)
  7. `Type Summary` (Rekapitulasi per tipe)
  8. `Status Summary` (Rekapitulasi per status)

### 2. Interactive GIS Map Preview (Tab Peta GIS - 100% Bebas API Key)
- **Visualisasi Geospasial Instan**: Menampilkan seluruh titik tiang (POLE), ODP (DPFO), jointbox, homepass, rute jalur kabel optik, serta batas area/boundary langsung di atas peta interaktif.
- **Bebas Kuota & API**: Menggunakan Leaflet.js dengan tile server terbuka (Carto Dark Matter, Carto Positron, Esri Satellite, OpenStreetMap) tanpa perlu API key atau kartu kredit.
- **Filter Layer Dinamis**: Checkbox untuk menampilkan/menyembunyikan layer tertentu (Tiang, ODP, Kabel, Jointbox, Homepass, Boundary).
- **Detail Teknis Popup**: Klik setiap objek untuk melihat detail atribut lengkap, koordinat lat/long, panjang kabel, kapasitas core, dan alasan mapping.
- **Tombol Fit Map**: Pusatkan peta otomatis ke seluruh cakupan aset proyek.

### 3. Quick Column Filter & Column Visibility Toggle
- **Filter Tipe & Status**: Menyaring data langsung berdasarkan tipe aset FTTH (`POLE`, `DPFO`, `CABLE`, dll.) dan status jaringan (`NEW`, `EXISTING`, `COVERAGE`, dll.).
- **Pilih Kolom Interaktif**: Dropdown dengan checkbox untuk menyembunyikan/menampilkan kolom tabel sesuai kebutuhan dengan preset *Semua*, *Penting*, dan *Ringkas*.
- **Pencarian Cepat**: Dilengkapi tombol clear search (`×`) instan.

### 4. Sticky Floating Action Bar (Holographic HUD Capsule)
- Bar mengambang otomatis muncul saat pengguna men-scroll tabel ribuan baris ke bawah.
- Menyediakan status jumlah baris terpilih, tombol fokus pencarian, tombol kembali ke baris teratas (*smooth scroll to top*), dan tombol cepat **Export Excel**.

### 5. Desain Cyber Neon (High-Precision Tech)
- Tampilan modern bertema *Cyber Neon* (Deep Obsidian `#06080d` + Electric Cyan `#00f0ff` + Matrix Emerald `#00ff9d` + Solar Amber `#ffb700`).
- Tipografi instrumen presisi tinggi menggunakan **Space Grotesk** dan **JetBrains Mono**.
- Mendukung mode **Dark Neon** dan **Daybreak Light**.

### 6. Pemrosesan 100% Client-Side & Privasi Terjamin
- Pemrosesan file `.kmz` (ZIP & XML KML) dan ekspor `.xlsx` diproses 100% di browser pengguna menggunakan JSZip dan SheetJS.
- Data tidak pernah dikirim ke server luar (privasi & keamanan data GIS terjamin).

---

## 🌐 Deploy ke Vercel

Aplikasi ini berbasis *pure static web* tanpa server backend, sudah dilengkapi `vercel.json` dan siap di-deploy langsung:

### Cara 1: Deploy via GitHub (Direkomendasikan)
1. Push repository ini ke GitHub.
2. Buka [Vercel Dashboard](https://vercel.com/dashboard) → **Add New... → Project**.
3. Pilih repository `kmz-extractor` lalu klik **Deploy**.

### Cara 2: Deploy via Vercel CLI
```bash
npx vercel --prod
```

---

## 💻 Menjalankan Secara Lokal

Cukup jalankan file `start.bat` atau gunakan Python HTTP server:
```bash
python -m http.server 8000
```
Buka browser di `http://localhost:8000`.
