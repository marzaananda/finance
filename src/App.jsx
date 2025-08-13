import React, { useState } from 'react'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import Summary from './components/Summary'
import { db } from './db'
import { downloadJSON } from './utils'

export default function App() {
  const [refresh, setRefresh] = useState(0)

  const doBackup = async () => {
    const transaksi = await db.transaksi.toArray()
    downloadJSON({ transaksi, exportedAt: new Date().toISOString() })
  }

  const onRestore = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    try {
      const data = JSON.parse(text)
      if (!Array.isArray(data.transaksi)) throw new Error('File tidak valid')
      if (!confirm('Impor data akan menimpa data yang sama ID-nya. Lanjutkan?')) return
      await db.transaction('rw', db.transaksi, async () => {
        for (const it of data.transaksi) {
          // add or update
          if (it.id) await db.transaksi.put(it)
          else await db.transaksi.add(it)
        }
      })
      setRefresh(r => r+1)
      alert('Restore selesai')
    } catch (err) {
      alert('Gagal impor: ' + err.message)
    } finally {
      e.target.value = ''
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <header className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <h1 className="text-2xl font-bold">Keuangan Pribadi</h1>
        <div className="flex gap-2">
          <button onClick={doBackup}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500">Backup</button>
          <label className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer">
            Restore
            <input type="file" accept="application/json" className="hidden" onChange={onRestore} />
          </label>
          <button onClick={() => setRefresh(r=>r+1)}
                  className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500">Refresh</button>
        </div>
      </header>

      <Summary refreshSignal={refresh} />
      <TransactionForm onSaved={() => setRefresh(r=>r+1)} />
      <TransactionList refreshSignal={refresh} />

      <footer className="text-center text-xs text-slate-500 py-6">
        Data tersimpan di perangkat kamu (IndexedDB). Aplikasi bisa dipasang sebagai PWA dan dipakai offline.
      </footer>
    </div>
  )
}
