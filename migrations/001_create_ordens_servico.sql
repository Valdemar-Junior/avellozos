create table if not exists public.ordens_servico (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  numero_lancamento bigint not null,
  tipo_operacao text,
  nome_cliente text,
  cpf_cnpj text,
  endereco_logradouro text,
  endereco_numero text,
  endereco_complemento text,
  endereco_bairro text,
  endereco_cidade text,
  endereco_estado_uf text,
  endereco_cep text,
  itens_vendidos jsonb not null,
  tipo_servico text not null check (tipo_servico in ('Revisão','Garantia')),
  observacoes text
);

create index if not exists ordens_servico_numero_lancamento_idx on public.ordens_servico (numero_lancamento);

alter table public.ordens_servico enable row level security;

drop policy if exists ordens_servico_insert_anon on public.ordens_servico;
drop policy if exists ordens_servico_select_anon on public.ordens_servico;
drop policy if exists ordens_servico_update_anon on public.ordens_servico;
drop policy if exists ordens_servico_delete_anon on public.ordens_servico;

create policy ordens_servico_insert_anon on public.ordens_servico for insert to anon with check (true);
create policy ordens_servico_select_anon on public.ordens_servico for select to anon using (true);
create policy ordens_servico_update_anon on public.ordens_servico for update to anon using (true) with check (true);
create policy ordens_servico_delete_anon on public.ordens_servico for delete to anon using (true);