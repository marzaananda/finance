import React, { useState } from 'react'
import { db } from '../db'
import { formatCurrency } from '../utils'

const defaultForm = {
  tanggal: new Date().toISOString().slice(0,10),
  jenis: 'pengeluaran',
  kategori: 'Lainnya',
  nominal: '',
  catatan: ''
}

const kategoriMap = {
  pemasukan: ['Gaji', 'Bonus', 'Hadiah', 'Lainnya'],
  pengeluaran: ['Makan', 'Transport', 'Tagihan', 'Belanja', 'Hiburan', 'Lainnya']
}

export default function TransactionForm({ onSaved }) {
  const [form, setForm] = useState(defaultForm)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const nominal = Number(form.nominal)
    if (!nominal || nominal <= 0) return alert('Nominal harus > 0')
    await db.transaksi.add({ ...form, nominal })
    setForm(defaultForm)
    onSaved?.()
  }

  return (
    <form onSubmit={onSubmit} className="card p-4 grid gap-3">
      <h2 className="text-lg font-semibold">Tambah Transaksi</h2>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="grid gap-1">
          <span className="text-sm text-slate-400">Tanggal</span>
          <input type="date" name="tanggal" value={form.tanggal} onChange={onChange}
                 className="bg-slate-800 rounded-xl px-3 py-2 outline-none border border-slate-700" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-slate-400">Jenis</span>
          <select name="jenis" value={form.jenis} onChange={onChange}
                  className="bg-slate-800 rounded-xl px-3 py-2 outline-none border border-slate-700">
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-slate-400">Kategori</span>
          <select name="kategori" value={form.kategori} onChange={onChange}
                  className="bg-slate-800 rounded-xl px-3 py-2 outline-none border border-slate-700">
            {kategoriMap[form.jenis].map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-slate-400">Nominal</span>
          <input type="number" name="nominal" value={form.nominal} onChange={onChange}
                 placeholder="contoh: 150000"
                 className="bg-slate-800 rounded-xl px-3 py-2 outline-none border border-slate-700" />
          <span className="text-xs text-slate-500">{formatCurrency(Number(form.nominal || 0))}</span>
        </label>
      </div>
      <label className="grid gap-1">
        <span className="text-sm text-slate-400">Catatan</span>
        <input type="text" name="catatan" value={form.catatan} onChange={onChange}
               placeholder="opsional"
               className="bg-slate-800 rounded-xl px-3 py-2 outline-none border border-slate-700" />
      </label>

      <div className="flex gap-2">
        <button type="submit"
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 transition font-medium">
          Simpan
        </button>
        <button type="button" onClick={() => setForm(defaultForm)}
                className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
          Reset
        </button>
      </div>
    </form>
  )
}
