import { useState } from 'react'
import { Search, Save, User, Package, FileText } from 'lucide-react'
import clsx from 'clsx'
import PrintOS from '../components/PrintOS'
import type { Venda } from '../types'
import { getSupabase } from '../lib/supabaseClient'

export default function OsNew() {
  const [numeroLancamento, setNumeroLancamento] = useState('')
  const [venda, setVenda] = useState<Venda | null>(null)
  const [tipoServico, setTipoServico] = useState('')
  const [obsLoja, setObsLoja] = useState('')
  const [obsCliente, setObsCliente] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [rawPayload, setRawPayload] = useState<any>(null)

  async function buscarVenda() {
    setLoading(true)
    setError(null)
    setVenda(null)
    setRawPayload(null)
    try {
      const url = `https://n8n.lojaodosmoveis.shop/webhook/gera_os`
      const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_lancamento: Number(numeroLancamento) })
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`Erro ao buscar venda: ${res.status} ${text}`)
      }
      const data = await res.json()
      setRawPayload(data)
      if (Array.isArray(data)) {
        if (data.length > 0) {
          setVenda(data[0] as Venda)
        } else {
          setError('Venda não encontrada')
        }
        return
      }
      if (data && typeof data === 'object') {
        if ('data' in data && Array.isArray((data as any).data)) {
          const arr = (data as any).data
          if (arr.length > 0) {
            setVenda(arr[0] as Venda)
            return
          }
          setError('Venda não encontrada')
          return
        }
        if ('numero_lancamento' in data) {
          setVenda(data as Venda)
          return
        }
      }
      setError('Formato inesperado do retorno do webhook')
    } catch (e: any) {
      setError(e?.message || 'Falha ao comunicar com o webhook')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-brand-400 flex items-center gap-3">
            <FileText className="w-8 h-8" />
            Gerar Ordem de Serviço
          </h1>
          <p className="text-gray-400 mt-2">Pesquise a venda e crie a OS com estilo</p>
        </header>

        <section className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Número de lançamento</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={numeroLancamento}
                  onChange={(e) => setNumeroLancamento(e.target.value)}
                  placeholder="Digite o número"
                  className="input pl-10"
                />
              </div>
            </div>
            <button
              onClick={buscarVenda}
              disabled={!numeroLancamento || loading}
              className={clsx('btn btn-primary', loading && 'opacity-70')}
            >
              {loading ? 'Buscando...' : 'Buscar venda'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-900/20 border border-red-700 text-red-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Erro</span>
              </div>
              <p>{error}</p>
              {rawPayload && (
                <pre className="mt-3 text-xs bg-gray-900 p-3 rounded overflow-auto border border-gray-700">
                  {JSON.stringify(rawPayload, null, 2)}
                </pre>
              )}
            </div>
          )}
        </section>

        {venda && (
          <>
            <section className="card p-6 mb-6">
              <h2 className="text-xl font-semibold text-brand-400 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Dados da venda
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Operação</span>
                    <span className="font-medium">{venda.tipo_operacao}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nº lançamento</span>
                    <span className="font-medium">{venda.numero_lancamento}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cliente</span>
                    <span className="font-medium">{venda.nome_cliente}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">CPF/CNPJ</span>
                    <span className="font-medium">{venda.cpf_cnpj}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Endereço</span>
                    <span className="font-medium">{venda.endereco_logradouro}, {venda.endereco_numero}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Complemento</span>
                    <span className="font-medium">{venda.endereco_complemento || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bairro</span>
                    <span className="font-medium">{venda.endereco_bairro}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cidade/UF</span>
                    <span className="font-medium">{venda.endereco_cidade}/{venda.endereco_estado_uf}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">CEP</span>
                    <span className="font-medium">{venda.endereco_cep}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="card p-6 mb-6">
              <h2 className="text-xl font-semibold text-brand-400 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Itens vendidos
              </h2>
              <div className="space-y-3">
                {venda.itens_vendidos.map((item) => (
                  <div key={item.sequencia_item} className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="badge">Seq {item.sequencia_item}</span>
                        <span className="text-gray-400">Cód {item.codigo_produto}</span>
                      </div>
                      <span className="text-gray-400">Qtd {item.quantidade_vendida}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{item.nome_produto}</p>
                    <div className="flex justify-end">
                      <span className="font-semibold text-brand-400">R$ {item.valor_unitario.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card p-6">
              <h2 className="text-xl font-semibold text-brand-400 mb-4">Ordem de Serviço</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de serviço</label>
                  <select
                    value={tipoServico}
                    onChange={(e) => setTipoServico(e.target.value)}
                    className="input"
                  >
                    <option value="">Selecione</option>
                    <option value="Revisão">Revisão</option>
                    <option value="Garantia">Garantia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Observação da loja</label>
                  <textarea
                    value={obsLoja}
                    onChange={(e) => setObsLoja(e.target.value)}
                    rows={4}
                    className="input"
                    placeholder="Detalhes da loja"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Observação do cliente</label>
                <textarea
                  value={obsCliente}
                  onChange={(e) => setObsCliente(e.target.value)}
                  rows={3}
                  className="input"
                  placeholder="Detalhes do cliente"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={async () => {
                    if (!venda || !tipoServico) return
                    setSaving(true)
                    setSaveMessage(null)
                    setError(null)
                    try {
                      const row = {
                        numero_lancamento: venda.numero_lancamento,
                        tipo_operacao: venda.tipo_operacao,
                        nome_cliente: venda.nome_cliente,
                        cpf_cnpj: venda.cpf_cnpj,
                        endereco_logradouro: venda.endereco_logradouro,
                        endereco_numero: venda.endereco_numero,
                        endereco_complemento: venda.endereco_complemento ?? null,
                        endereco_bairro: venda.endereco_bairro,
                        endereco_cidade: venda.endereco_cidade,
                        endereco_estado_uf: venda.endereco_estado_uf,
                        endereco_cep: venda.endereco_cep,
                        itens_vendidos: venda.itens_vendidos,
                        tipo_servico: tipoServico,
                        observacoes: `Loja: ${obsLoja || ''}\nCliente: ${obsCliente || ''}`
                      }
                      const { error: insertError } = await getSupabase()
                        .from('ordens_servico')
                        .insert(row)
                      if (insertError) {
                        throw new Error(insertError.message)
                      }
                      setSaveMessage('OS salva com sucesso')
                    } catch (e: any) {
                      setError(e?.message || 'Falha ao salvar a OS')
                    } finally {
                      setSaving(false)
                    }
                  }}
                  disabled={!venda || !tipoServico || saving}
                  className={clsx('btn btn-primary', saving && 'opacity-70')}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar OS'}
                </button>
                {venda && tipoServico && (
                  <PrintOS venda={venda} tipoServico={tipoServico} observacaoLoja={obsLoja} observacaoCliente={obsCliente} />
                )}
              </div>

              {saveMessage && (
                <div className="mt-4 p-3 rounded-lg bg-green-900/20 border border-green-700 text-green-300">
                  {saveMessage}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}