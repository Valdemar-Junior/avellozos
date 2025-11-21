import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSupabase } from '../lib/supabaseClient'
import PrintOS from '../components/PrintOS'
import type { Venda } from '../types'

type Row = {
  id: string
  created_at: string
  numero_lancamento: number
  tipo_operacao?: string
  nome_cliente: string
  cpf_cnpj?: string
  endereco_logradouro?: string
  endereco_numero?: string
  endereco_complemento?: string | null
  endereco_bairro?: string
  endereco_cidade?: string
  endereco_estado_uf?: string
  endereco_cep?: string
  itens_vendidos: any
  tipo_servico: string
  observacoes?: string
}

function splitObs(observacoes?: string) {
  const s = observacoes || ''
  const lojaMatch = s.match(/Loja:\s*(.*)/)
  const clienteMatch = s.match(/Cliente:\s*(.*)/)
  return {
    loja: lojaMatch?.[1] || '',
    cliente: clienteMatch?.[1] || ''
  }
}

export default function OsEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [row, setRow] = useState<Row | null>(null)
  const [tipoServico, setTipoServico] = useState('')
  const [obsLoja, setObsLoja] = useState('')
  const [obsCliente, setObsCliente] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const TABLE = (import.meta as any).env.VITE_SUPABASE_TABLE_OS || 'ordens_servico'

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error: err } = await getSupabase()
          .from(TABLE)
          .select('*')
          .eq('id', id)
          .single()
        if (err) throw new Error(err.message)
        const r = data as Row
        setRow(r)
        setTipoServico(r.tipo_servico || '')
        const parts = splitObs(r.observacoes)
        setObsLoja(parts.loja)
        setObsCliente(parts.cliente)
      } catch (e: any) {
        setError(e?.message || 'Falha ao carregar OS')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <div className="max-w-6xl mx-auto px-6 py-10">Carregando...</div>
  if (error) return <div className="max-w-6xl mx-auto px-6 py-10 text-red-300">{error}</div>
  if (!row) return <div className="max-w-6xl mx-auto px-6 py-10">OS não encontrada</div>

  const venda: Venda = {
    numero_lancamento: row.numero_lancamento,
    tipo_operacao: row.tipo_operacao || '',
    nome_cliente: row.nome_cliente,
    cpf_cnpj: row.cpf_cnpj || '',
    endereco_logradouro: row.endereco_logradouro || '',
    endereco_numero: row.endereco_numero || '',
    endereco_complemento: row.endereco_complemento || undefined,
    endereco_bairro: row.endereco_bairro || '',
    endereco_cidade: row.endereco_cidade || '',
    endereco_estado_uf: row.endereco_estado_uf || '',
    endereco_cep: row.endereco_cep || '',
    itens_vendidos: row.itens_vendidos || []
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-brand-400 mb-4">Editar OS</h1>

      <div className="card p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">Tipo de serviço</label>
            <select value={tipoServico} onChange={(e) => setTipoServico(e.target.value)} className="input">
              <option value="">Selecione</option>
              <option value="Revisão">Revisão</option>
              <option value="Garantia">Garantia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">Observação da loja</label>
            <textarea value={obsLoja} onChange={(e) => setObsLoja(e.target.value)} rows={4} className="input" />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-2">Observação do cliente</label>
          <textarea value={obsCliente} onChange={(e) => setObsCliente(e.target.value)} rows={3} className="input" />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="btn btn-primary"
            disabled={saving || !tipoServico}
            onClick={async () => {
              setSaving(true)
              setMsg(null)
              setError(null)
              try {
                const obs = `Loja: ${obsLoja || ''}\nCliente: ${obsCliente || ''}`
                const { error: upErr } = await getSupabase()
                  .from(TABLE)
                  .update({ tipo_servico: tipoServico, observacoes: obs })
                  .eq('id', row.id)
                if (upErr) throw new Error(upErr.message)
                setMsg('OS atualizada')
              } catch (e: any) {
                setError(e?.message || 'Falha ao atualizar')
              } finally {
                setSaving(false)
              }
            }}
          >Salvar alterações</button>
          <button className="btn btn-secondary" onClick={() => navigate('/os')}>Voltar</button>
          <PrintOS venda={venda} tipoServico={tipoServico} observacaoLoja={obsLoja} observacaoCliente={obsCliente} />
        </div>

        {msg && <div className="mt-3 text-green-300">{msg}</div>}
        {error && <div className="mt-3 text-red-300">{error}</div>}
      </div>
    </div>
  )
}