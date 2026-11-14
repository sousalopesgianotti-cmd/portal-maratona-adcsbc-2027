# 🏊‍♂️ Portal Comparativo & Planejamento de Maratona Aquática 2027 — ADCSBC

Single Page Application (SPA) esportiva de alta performance para planejamento da temporada 2027 da equipe de Maratona Aquática da **Associação Desportiva Classista São Bernardo do Campo (ADCSBC)**, sob comando técnico da **Técnica Zezé Moreira** e coordenação do **Prof. André Gianotti**.

---

## 🌊 Padrão Oficial dos Cards & Menu de Edição (Perfil Admin)

Cada card de maratona aquática agora segue rigorosamente o padrão de 8 campos estruturados:

1. **Nome do Circuito / Organizador:** Identificação em destaque do circuito e organizador.
2. **Responsável:** Contato oficial / responsável da organização (visível no card com badge esportivo).
3. **Locais das Etapas:** Cidades, praias e represas onde ocorrem as provas.
4. **Distâncias / Provas:** Pílulas visuais com todas as metragens (ex: *500m, 1km, 2.5km, 5km, Aquathlon*).
5. **Calendário Anual (Com Edição Dinâmica de Etapas):**
   - *Etapa 1 – data editável*
   - *Etapa 2 – data editável*
   - *Etapa 3 – data editável...*
   - Botão para adicionar, editar ou remover etapas dinamicamente.
6. **Entregas & Estrutura:** Detalhamento de kit atleta, segurança náutica, hidratação e reposição.
7. **Preços (Site x Equipe ADCSBC):** Comparativo financeiro oficial com destaque automático para a economia por atleta.
8. **Benefícios para Equipes:** Bloco exclusivo em destaque com espaço para tenda oficial da ADCSBC, descontos de lote e gratuidades para a comissão técnica.

---

## 🔒 Acesso do Administrador (Dono do Produto)
- Ao clicar no alternador de perfil no topo (botão **Atleta**), insira a senha:
  - **Senha Padrão:** `adcsbc2027`
- Com o modo Admin ativado:
  - Surge o botão **"Editar Card"** flutuante em cada card (na visão Grade e Kanban).
  - É possível criar novos circuitos pelo botão **"+ Novo Circuito"** na barra superior.
  - O modal de edição permite alterar qualquer um dos 8 campos e atualizar o card instantaneamente.
  - O painel de Analytics permite exportar relatórios em **Excel (CSV)** e **JSON**.

---

## 🚀 Como Acessar e Rodar

### Links Ativos do Servidor:
- **No seu computador:** [http://localhost:3000](http://localhost:3000)
- **No celular / tablet (mesma rede Wi-Fi):** [http://192.168.86.5:3000](http://192.168.86.5:3000)
