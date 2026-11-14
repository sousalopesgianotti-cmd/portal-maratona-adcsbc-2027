# Documento de Design: Portal Interativo de Planejamento de Maratonas Aquáticas 2027 – ADCSBC

**Equipe:** ADC São Bernardo do Campo (ADCSBC)  
**Comissão Técnica:** Técnica Zezé Moreira & Prof. André Gianotti  
**Data:** Novembro de 2026 / Planejamento para 2027  
**Status:** Validado e Aprovado

---

## 1. Resumo do Entendimento (Understanding Summary)
1. **Objetivo:** Criar uma Single Page Application (SPA) esportiva de alta performance e 100% responsiva (foco mobile/tablet) para planejamento do calendário de competições de maratona aquática da equipe ADCSBC em 2027.
2. **Público-Alvo:**
   - **Atletas:** Consulta visual rápida de todos os circuitos, curtidas com contador instantâneo e cabine secreta de votação de prioridades (1º, 2º e 3º lugares).
   - **Gestão / Comissão Técnica:** Painel protegido por senha simples, com permissão total para criar/editar/reordenar circuitos (Kanban e Grid), analisar métricas da votação em tempo real e exportar relatórios (JSON/CSV).
3. **Identidade Visual:** Dark mode de alto contraste esportivo com preto fosco/grafite (`#0b1329` e `#0f172a`), Laranja ADCSBC (`#FF6B00`), Amarelo Neon/Lima (`#DFFF00`) e Azul Oceano (`#0284c7`).
4. **Persistência de Dados:** Camada de repositório desacoplada com `localStorage`, preparada para conexão futura com bancos de dados em nuvem (ex: Supabase/Firebase) sem necessidade de refatorar componentes visuais.
5. **Circuitos Pré-carregados:** 6 circuitos regionais tradicionais: Circuito Mares, Golfinho Eventos, Circuito Márcio Latuf, Gaivotas Eventos, Igor Eventos e TH5 Eventos.

---

## 2. Premissas e Requisitos Não-Funcionais (Assumptions & NFRs)
- **Performance:** Carregamento inicial em menos de 1 segundo, zero layout shifts, animações a 60fps em navegadores mobile (Chrome Android, Safari iOS).
- **Escala:** Suporte confortável para dezenas de circuitos e centenas de votos anônimos armazenados de forma limpa em cliente.
- **Segurança & Sigilo:** Votação da cédula secreta não armazena IP, nome ou dados de identificação do atleta. Modo Admin resguardado por autenticação local amigável (senha padrão configurável).
- **Confiabilidade:** Fallback automático para restaurar dados padrão caso o armazenamento local seja resetado ou esteja corrompido.

---

## 3. Registro de Decisões (Decision Log)

| Decisão | Alternativas Consideradas | Motivo da Escolha |
| :--- | :--- | :--- |
| **Arquitetura & Persistência** | LocalStorage acoplado vs. Backend na Nuvem imediato | SPA Client-Side com `storageService` desacoplado: velocidade de entrega imediata, sem custo de infra, com exportação/importação e pronto para nuvem. |
| **Visualização Principal** | Apenas Grid vertical vs. Apenas Kanban | Visão Híbrida com alternador: Grade de Cards fluida (ideal para smartphone) + Quadro Kanban por Status para comissão técnica. |
| **Mecânica de Votação** | Voto em escolha única vs. Menção simples | Pontuação Ponderada Olímpica/Borda (1º = 3 pts, 2º = 2 pts, 3º = 1 pt): reflete com fidelidade o consenso e as 2ª/3ª opções dos atletas. |
| **Stack de Desenvolvimento** | Standalone HTML único vs. Full-Stack com servidor | React + Vite + Tailwind CSS + Lucide Icons: modularidade, tipografia atlética limpa e facilidade de deploy em plataformas estáticas (Vercel, GitHub Pages). |

---

## 4. Arquitetura de Componentes e Estrutura de Arquivos

```
portal-maratona-adcsbc/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── index.css
    ├── main.jsx
    ├── App.jsx
    ├── data/
    │   └── initialCircuits.js
    ├── services/
    │   └── storageService.js
    └── components/
        ├── Header.jsx
        ├── FilterBar.jsx
        ├── CircuitCard.jsx
        ├── KanbanView.jsx
        ├── VotingModal.jsx
        ├── AnalyticsModal.jsx
        ├── CircuitModal.jsx
        ├── PasswordModal.jsx
        └── Toast.jsx
```

---

## 5. Modelo de Dados e Algoritmo de Ranking

### 5.1 Entidade de Circuito
```typescript
interface Circuit {
  id: string;
  name: string;
  waterType: 'Mar Aberto' | 'Represa' | 'Exclusivo Clube';
  status: 'Confirmado' | 'Aguardando Valores' | 'Em Estudo';
  location: string;
  distances: string[];
  stages: { name: string; date: string; info?: string }[];
  pricing: {
    publicPrice: number;
    teamPrice: number;
    notes?: string;
  };
  deliverables: { icon: string; label: string }[];
  likes: number;
  order: number;
}
```

### 5.2 Algoritmo de Pontuação Borda
Para cada circuito $C$:
$$\text{Pontuação}(C) = (V_1 \times 3) + (V_2 \times 2) + (V_3 \times 1)$$
Onde $V_1, V_2, V_3$ correspondem à contagem de vezes em que o circuito foi selecionado em 1º, 2º e 3º lugar respectivamente. O percentual de preferência é calculado sobre o total de pontos disputados.

---

## 6. Próximos Passos
Com o design aprovado, segue-se a etapa de configuração do projeto Vite/React, instalação do Tailwind CSS, criação dos dados mock e implementação incremental dos componentes.
