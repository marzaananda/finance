import React, { useEffect, useMemo, useState } from 'react'
import { db } from '../db'
import { formatCurrency } from '../utils'

export default function TransactionList({ refreshSignal }) {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [filterJenis, setFilterJenis] = useState('semua')
  const [bulan, setBulan] = useState(new Date().toISOString().slice(0,7))

  const load = async () => {
    const all = await db.transaksi.toArray()
    setItems(all.sort((a,b) => a.tanggal < b.tanggal ? 1 : -1))
  }

  useEffect(() => { load() }, [refreshSignal])

  const filtered = useMemo(() => {
    return items.filter(it => {
      const cocokBulan = it.tanggal.slice(0,7) === bulan
      const cocokJenis = filterJenis === 'semua' || it.jenis === filterJenis
      const cocokQuery = query === '' || (it.kategori + ' ' + (it.catatan||'')).toLowerCase().includes(query.toLowerCase())
      return cocokBulan && cocokJenis && cocokQuery
    })
  }, [items, query, filterJenis, bulan])

  const hapus = async (id) => {
    if (!confirm('Yakin hapus transaksi ini?')) return
    await db.transaksi.delete(id)
    await load()
  }

  const total = filtered.reduce((acc, it) => {
    if (it.jenis === 'pemasukan') acc.income += it.nominal
    else acc.expense += it.nominal
    return acc
  }, { income: 0, expense: 0 })

  return (
    <div className="card p-4 grid gap-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">Daftar Transaksi</h2>
        <div className="flex flex-wrap gap-2">
          <input className="bg-slate-800 rounded-xl px-3 py-2 border border-slate-700"
                 placeholder="Cari kategori/catatan"
                 value={query} onChange={e=>setQuery(e.target.value)} />
          <select className="bg-slate-800 rounded-xl px-3 py-2 border border-slate-700"
                  value={filterJenis} onChange={e=>setFilterJenis(e.target.value)}>
            <option value="semua">Semua</option>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
          <input type="month" className="bg-slate-800 rounded-xl px-3 py-2 border border-slate-700"
                 value={bulan} onChange={e=>setBulan(e.target.value)} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="text-left py-2">Tanggal</th>
              <th className="text-left py-2">Jenis</th>
              <th className="text-left py-2">Kategori</th>
              <th className="text-right py-2">Nominal</th>
              <th className="text-left py-2">Catatan</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(it => (
              <tr key={it.id} className="border-t border-slate-800">
                <td className="py-2">{it.tanggal}</td>
                <td className="py-2 capitalize">{it.jenis}</td>
                <td className="py-2">{it.kategori}</td>
                <td className="py-2 text-right">{formatCurrency(it.nominal)}</td>
                <td className="py-2">{it.catatan}</td>
                <td className="py-2">
                  <button onClick={()=>hapus(it.id)} className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="py-6 text-center text-slate-500">Belum ada data</td></tr>
            )}
          </tbody>
          <tfoot className="border-t border-slate-800">
            <tr>
              <td colSpan="3" className="py-2 font-semibold text-right">Total</td>
              <td className="py-2 text-right font-semibold">{formatCurrency(total.income - total.expense)}</td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
