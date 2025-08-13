import React, { useEffect, useState } from 'react'
import { db } from '../db'
import { formatCurrency } from '../utils'
import MonthlyLineChart from './MonthlyLineChart'

const monthKey = (d) => d.slice(0,7)

export default function Summary({ refreshSignal }) {
  const [items, setItems] = useState([])

  const load = async () => {
    const all = await db.transaksi.toArray()
    setItems(all)
  }
  useEffect(() => { load() }, [refreshSignal])

  // aggregate per month
  const monthMap = {}
  for (const it of items) {
    const key = monthKey(it.tanggal)
    monthMap[key] = monthMap[key] || { income: 0, expense: 0 }
    if (it.jenis === 'pemasukan') monthMap[key].income += it.nominal
    else monthMap[key].expense += it.nominal
  }
  const series = Object.entries(monthMap)
    .sort((a,b)=>a[0]<b[0]? -1 : 1)
    .map(([label, v]) => ({ label, ...v }))

  const totalIncome = items.filter(i=>i.jenis==='pemasukan').reduce((a,b)=>a+b.nominal,0)
  const totalExpense = items.filter(i=>i.jenis==='pengeluaran').reduce((a,b)=>a+b.nominal,0)

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card p-4 grid gap-1">
        <span className="text-slate-400 text-sm">Total Pemasukan</span>
        <span className="text-2xl font-semibold">{formatCurrency(totalIncome)}</span>
      </div>
      <div className="card p-4 grid gap-1">
        <span className="text-slate-400 text-sm">Total Pengeluaran</span>
        <span className="text-2xl font-semibold">{formatCurrency(totalExpense)}</span>
      </div>
      <div className="card p-4 grid gap-1">
        <span className="text-slate-400 text-sm">Saldo</span>
        <span className="text-2xl font-semibold">{formatCurrency(totalIncome - totalExpense)}</span>
      </div>

      <div className="md:col-span-3 card p-4">
        <h3 className="text-lg font-semibold mb-3">Tren Bulanan</h3>
        <MonthlyLineChart dataPoints={series} />
      </div>
    </div>
  )
}
