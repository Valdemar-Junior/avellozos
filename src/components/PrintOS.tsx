import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import type { Venda, ItemVendido } from '../types'

const logoUrl = '/logo.png'

interface PrintOSProps {
  venda: Venda
  tipoServico: string
  observacaoLoja: string
  observacaoCliente: string
}

export default function PrintOS({ venda, tipoServico, observacaoLoja, observacaoCliente }: PrintOSProps) {
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `OS_${venda.numero_lancamento}`,
    pageStyle: `
      @page { size: A4; margin: 12mm; }
      body { font-family: 'Inter', system-ui, sans-serif; color: #111827; background: #fff; font-size: 12px; }
      h1 { font-size: 20px; }
      h2 { font-size: 14px; }
      table { page-break-inside: avoid; }
      .print-block { break-inside: avoid; }
    `
  })

  return (
    <>
      <button
        onClick={() => handlePrint()}
        className="btn btn-secondary"
      >
        Imprimir OS
      </button>

      <div ref={componentRef} className="hidden print:block">
        <div className="p-6 bg-white text-gray-900 print-block">
          {/* Cabeçalho */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex justify-center">
              <img src={logoUrl} alt="Logo" className="h-24 w-24 object-contain" />
            </div>
            <div className="mt-2 text-right">
              <p className="text-sm text-gray-600">Ordem de Serviço</p>
              <p className="text-lg font-semibold">#{venda.numero_lancamento}</p>
            </div>
          </div>

          {/* Dados da Loja */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Dados da Loja</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">AVELLOZ ASSU</p>
                <p>Av. Senador João Câmara, 1236 – Dom Eliseu</p>
                <p>ASSÚ/RN</p>
              </div>
              <div>
                <p className="font-medium">Contato</p>
                <p>(84) 9 8683-9734</p>
                <p>avelloz@lojaodosmoveis.shop</p>
              </div>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Dados do Cliente</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">{venda.nome_cliente}</p>
                <p>CPF/CNPJ: {venda.cpf_cnpj}</p>
              </div>
              <div>
                <p className="font-medium">Endereço</p>
                <p>{venda.endereco_logradouro}, {venda.endereco_numero}</p>
                <p>{venda.endereco_bairro} - {venda.endereco_cidade}/{venda.endereco_estado_uf}</p>
                <p>CEP: {venda.endereco_cep}</p>
              </div>
            </div>
          </div>

          {/* Itens */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Itens da Venda</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2">Código</th>
                  <th className="text-left py-2">Produto</th>
                </tr>
              </thead>
              <tbody>
                {venda.itens_vendidos.map((item: ItemVendido) => (
                  <tr key={item.sequencia_item} className="border-b border-gray-200">
                    <td className="py-2">{item.codigo_produto}</td>
                    <td className="py-2">{item.nome_produto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Serviço */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Serviço</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Tipo de Serviço</p>
                <p>{tipoServico}</p>
              </div>
              <div>
                <p className="font-medium">Observação da loja</p>
                <p className="whitespace-pre-wrap">{observacaoLoja || '—'}</p>
              </div>
            </div>
            <div className="mt-3 text-sm">
              <p className="font-medium">Observação do cliente</p>
              <p className="whitespace-pre-wrap">{observacaoCliente || '—'}</p>
            </div>
          </div>

          {/* Assinatura */}
          <div className="mt-12">
            <div className="border-t border-gray-300 w-64 mx-auto pt-2 text-center text-sm">
              <p className="font-medium">Assinatura do Responsável</p>
              <p className="text-gray-600">AVELLOZ ASSU</p>
            </div>
          </div>

          {/* Rodapé */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Av. Senador João Câmara, 1236 – Dom Eliseu, ASSÚ/RN | CNPJ: 24.413.345/0001-35</p>
            <p>Emitido em {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>
    </>
  )
}