import Dexie from 'dexie'

export const db = new Dexie('keuangan_db')
db.version(1).stores({
  transaksi: '++id, tanggal, jenis, kategori, nominal' // index fields
})
