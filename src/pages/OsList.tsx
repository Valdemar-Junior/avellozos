import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSupabase } from '../lib/supabaseClient'
import PrintOS from '../components/PrintOS'

type Row = {
  id: string
  created_at: string
  numero_lancamento: number
  nome_cliente: string
  tipo_servico: string
  itens_vendidos: any
  tipo_operacao?: string
  cpf_cnpj?: string
  endereco_logradouro?: string
  endereco_numero?: string
  endereco_complemento?: string | null
  endereco_bairro?: string
  endereco_cidade?: string
  endereco_estado_uf?: string
  endereco_cep?: string
  observacoes?: string
}

export default function OsList() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const TABLE = (import.meta as any).env.VITE_SUPABASE_TABLE_OS || 'ordens_servico'
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error: err } = await getSupabase()
          .from(TABLE)
          .select('*')
          .order('created_at', { ascending: false })
        if (err) throw new Error(err.message)
        setRows((data as any) || [])
      } catch (e: any) {
        setError(e?.message || 'Falha ao carregar OS')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    if (!q) return rows
    const t = q.toLowerCase()
    return rows.filter(r =>
      String(r.numero_lancamento).includes(q) ||
      (r.nome_cliente || '').toLowerCase().includes(t)
    )
  }, [rows, q])

  function splitObs(observacoes?: string) {
    const s = observacoes || ''
    const lojaMatch = s.match(/Loja:\s*(.*)/)
    const clienteMatch = s.match(/Cliente:\s*(.*)/)
    return { loja: lojaMatch?.[1] || '', cliente: clienteMatch?.[1] || '' }
  }

  function vendaFromRow(r: Row) {
    return {
      numero_lancamento: r.numero_lancamento,
      tipo_operacao: r.tipo_operacao || '',
      nome_cliente: r.nome_cliente,
      cpf_cnpj: r.cpf_cnpj || '',
      endereco_logradouro: r.endereco_logradouro || '',
      endereco_numero: r.endereco_numero || '',
      endereco_complemento: r.endereco_complemento || undefined,
      endereco_bairro: r.endereco_bairro || '',
      endereco_cidade: r.endereco_cidade || '',
      endereco_estado_uf: r.endereco_estado_uf || '',
      endereco_cep: r.endereco_cep || '',
      itens_vendidos: r.itens_vendidos || []
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">

      <div className="card p-4 mb-4">
        <input
          className="input"
          placeholder="Buscar por nº de lançamento ou cliente"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {error && <div className="card p-4 text-red-300 border-red-700">{error}</div>}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-300">
                <th className="text-left p-3">Criada</th>
                <th className="text-left p-3">Nº lançamento</th>
                <th className="text-left p-3">Cliente</th>
                <th className="text-left p-3">Serviço</th>
                <th className="text-right p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-4" colSpan={5}>Carregando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td className="p-4" colSpan={5}>Nenhuma OS encontrada</td></tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} className="border-b border-gray-700">
                    <td className="p-3">{new Date(r.created_at).toLocaleString('pt-BR')}</td>
                    <td className="p-3">{r.numero_lancamento}</td>
                    <td className="p-3">{r.nome_cliente}</td>
                    <td className="p-3">{r.tipo_servico}</td>
                    <td className="p-3 text-right">
                      <PrintOS venda={vendaFromRow(r) as any} tipoServico={r.tipo_servico} observacaoLoja={splitObs(r.observacoes).loja} observacaoCliente={splitObs(r.observacoes).cliente} />
                      <button className="btn btn-secondary ml-2 mr-2" onClick={() => navigate(`/os/${r.id}`)}>Editar</button>
                      <button className="btn" onClick={async () => {
                        if (!confirm('Excluir esta OS?')) return
                        const { error: delErr } = await getSupabase().from(TABLE).delete().eq('id', r.id)
                        if (delErr) { alert(delErr.message); return }
                        setRows(prev => prev.filter(x => x.id !== r.id))
                      }}>Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}