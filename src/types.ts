export type ItemVendido = {
  sequencia_item: number
  codigo_produto: string
  nome_produto: string
  quantidade_vendida: number
  valor_unitario: number
}

export type Venda = {
  numero_lancamento: number
  tipo_operacao: string
  nome_cliente: string
  cpf_cnpj: string
  endereco_logradouro: string
  endereco_numero: string
  endereco_complemento?: string
  endereco_bairro: string
  endereco_cidade: string
  endereco_estado_uf: string
  endereco_cep: string
  itens_vendidos: ItemVendido[]
}