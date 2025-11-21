import { useState } from 'react'
import OsList from './OsList'
import OsNew from './OsNew'

export default function Home() {
  const [tab, setTab] = useState<'lista' | 'nova'>('lista')
  return (
    <div className="min-h-screen app-bg text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-white rounded-xl p-2 shadow">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-brand-400 text-center">Ordem de Serviço</h1>
          </div>
        </header>

        <div className="mb-6 flex items-center justify-center gap-3">
          <button className={`btn ${tab === 'lista' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('lista')}>Ver OS</button>
          <button className={`btn ${tab === 'nova' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('nova')}>Nova OS</button>
        </div>

        {tab === 'lista' ? <OsList /> : <OsNew />}
      </div>
    </div>
  )
}