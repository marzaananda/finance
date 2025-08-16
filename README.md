# Keuangan Pribadi — React + Vite + Tailwind + Dexie + PWA

Aplikasi keuangan pribadi **tanpa backend**, data tersimpan lokal di perangkat (IndexedDB), bisa **offline** dan **di-install** sebagai PWA.

## Fitur
- Tambah transaksi (pemasukan/pengeluaran) dengan tanggal, kategori, nominal, catatan
- Filter per bulan, cari, dan ringkasan (total, saldo)
- Grafik tren bulanan (Chart.js)
- Backup (export JSON) & Restore (import JSON)
- PWA: bisa install di HP dan berjalan offline
- UI gelap dengan Tailwind

## Cara Jalankan
```bash
# 1) Install dependency
npm install

# 2) Jalankan dev server
npm run dev
# Akses dari HP di jaringan yang sama melalui IP yang tercetak di terminal (contoh: http://192.168.1.xx:5173)

# 3) Build produksi (static files)
npm run build
npm run preview
````

## Catatan PWA
- Saat membuka di HP, pilih menu browser "Add to Home Screen" untuk install.
- Service Worker akan aktif setelah pertama kali load halaman.

## Struktur
```
src/
  components/
    MonthlyLineChart.jsx
    Summary.jsx
    TransactionForm.jsx
    TransactionList.jsx
  db.js
  utils.js
  App.jsx
  main.jsx
index.html
tailwind.config.js
postcss.config.js
vite.config.js
```

## Kustomisasi
- Kategori ada di `TransactionForm.jsx` (`kategoriMap`). Silakan ubah sesuai kebutuhan.
- Skema database di `db.js`. Jika berubah, tingkatkan `db.version(...)`.

