import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

export default function MonthlyLineChart({ dataPoints }) {
  // dataPoints: array of { label: '2025-08', income: 1000000, expense: 500000 }
  const labels = dataPoints.map(d => d.label)
  const income = dataPoints.map(d => d.income)
  const expense = dataPoints.map(d => d.expense)

  const data = {
    labels,
    datasets: [
      { 
        label: 'Pemasukan', 
        data: income,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      },
      { 
        label: 'Pengeluaran', 
        data: expense,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    interaction: { intersect: false, mode: 'index' },
    scales: {
      y: { ticks: { callback: (v) => (Number(v) / 1000) + 'k' } }
    }
  }

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  )
}
