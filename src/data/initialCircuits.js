/**
 * Dados Iniciais Pré-Carregados para o Planejamento de Maratonas Aquáticas 2027
 * Equipe: ADC SBC - Associação Desportiva Classista São Bernardo do Campo
 * Comissão Técnica: Zezé Moreira e Prof. André Gianotti
 * 
 * Padrão Estrutural Oficial (8 Campos):
 * 1. Nome do Circuito / Organizador
 * 2. Responsável
 * 3. Locais das Etapas
 * 4. Distâncias / Provas
 * 5. Calendário Anual (Etapas com datas editáveis)
 * 6. Entregas & Estrutura
 * 7. Preços (Site x Equipe ADCSBC)
 * 8. Benefícios para Equipes
 */

export const INITIAL_CIRCUITS = [
  {
    id: "circuito-mares-2027",
    name: "Circuito Mares",
    organizer: "Interativa Esportes",
    responsible: "Fabrício (Interativa Esportes) • Contato Oficial",
    stageLocations: "Ubatuba (Praia da Enseada e Praia Grande), Ilhabela e São Sebastião - SP",
    waterType: "Mar Aberto",
    status: "Confirmado",
    location: "Ubatuba / Litoral Norte - SP",
    coverImage: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80",
    distances: ["500m", "1km", "2.5km", "5km", "Aquathlon", "Corrida"],
    stages: [
      { name: "Etapa 1", date: "Fev/2027", info: "Praia da Enseada - Ubatuba (Abertura)" },
      { name: "Etapa 2", date: "Abr/2027", info: "Ilhabela / São Sebastião" },
      { name: "Etapa 3", date: "Jun/2027", info: "Ubatuba (Praia Grande)" },
      { name: "Etapa 4", date: "Set/2027", info: "Litoral Norte" },
      { name: "Etapa 5", date: "Nov/2027", info: "Final de Temporada" }
    ],
    deliverablesText: "Kit Atleta Pro (Camiseta tecnológica UV + Touca de silicone personalizada), suporte marítimo com botes a motor, caiaques e jet-skis, hidratação/frutas na chegada, cronometragem chip descartável e medalha pesada por etapa.",
    deliverables: [
      { icon: "shirt", label: "Kit Pro (Camiseta UV + Touca Silicone)" },
      { icon: "shield", label: "Segurança total (botes, caiaques e jet-skis)" },
      { icon: "award", label: "Medalha Finisher pesada e pódio por categoria" },
      { icon: "coffee", label: "Tenda com hidratação e reposição energética" }
    ],
    pricing: {
      sitePrice: 399.00,
      publicPrice: 399.00,
      teamPrice: 320.00,
      notes: "Preço no site oficial: R$ 399,00 + taxa. Pacote negociado com R$ 79,00 de desconto por atleta."
    },
    teamBenefits: "Desconto especial de R$ 79/atleta para grupo ADCSBC acima de 15 inscritos, espaço garantido para a tenda oficial da equipe na areia e isenção de taxa para a comissão técnica.",
    logistics: "Distância SBC: ~240 km (~3h30). Excelente infraestrutura hoteleira.",
    likes: 18,
    order: 1
  },
  {
    id: "golfinho-eventos-2027",
    name: "Golfinho Eventos - Represa Jurumirim",
    organizer: "Golfinho Eventos & Turismo",
    responsible: "Coordenação Golfinho Eventos • Atendimento Equipes",
    stageLocations: "Itaí / Avaré - SP (Represa de Jurumirim - Águas Claras)",
    waterType: "Represa",
    status: "Confirmado",
    location: "Itaí / Avaré - SP",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    distances: ["500m", "1km", "2km", "Aquathlon"],
    stages: [
      { name: "Etapa 1", date: "Mar/2027", info: "Festival Represa de Jurumirim (Águas Cristalinas)" }
    ],
    deliverablesText: "Água doce calma sem ondas, estrutura completa de camping e pousadas parceiras, kit essencial com touca e camiseta, barco de apoio da capitania e churrasco de integração da equipe.",
    deliverables: [
      { icon: "waves", label: "Água doce plana e limpa, ideal para recordes pessoais" },
      { icon: "bus", label: "Integração total da equipe (caravana ADCSBC ~300km / 4h)" },
      { icon: "tent", label: "Área de camping e pousadas à beira da represa" },
      { icon: "shirt", label: "Kit essencial com medalha finisher" }
    ],
    pricing: {
      sitePrice: 150.00,
      publicPrice: 150.00,
      teamPrice: 120.00,
      notes: "Melhor custo-benefício da temporada. Viagem em caravana/van fretada."
    },
    teamBenefits: "Inscrição com valor popular (R$ 120,00), reserva de área coletiva para churrasco e confraternização da equipe ADCSBC e suporte para acomodação em grupo.",
    logistics: "Distância SBC: ~300 km (~4h). Viagem de integração muito elogiada pelos atletas.",
    likes: 12,
    order: 2
  },
  {
    id: "marcio-latuf-2027",
    name: "Circuito Ilha das Palmas - Márcio Latuf",
    organizer: "Clube de Regatas Ilha das Palmas & Latuf Assessoria",
    responsible: "Prof. Márcio Latuf & Técnica Zezé Moreira",
    stageLocations: "Guarujá / Santos - SP (Complexo Náutico da Ilha das Palmas)",
    waterType: "Exclusivo Clube",
    status: "Confirmado",
    location: "Guarujá / Santos - SP",
    coverImage: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    distances: ["1km", "2.5km", "4km", "Revezamento 4x500m"],
    stages: [
      { name: "Etapa 1", date: "01 ou 08/Mai/2027", info: "Travessia de Outono e Clínica Técnica" },
      { name: "Etapa 2", date: "30/Out/2027", info: "Travessia da Primavera com Jantar de Gala" }
    ],
    deliverablesText: "Traslado exclusivo em escuna privativa para a Ilha das Palmas, clínica técnica e mentoria direta com Zezé Moreira e Márcio Latuf, jantar completo comemorativo no clube e medalha comemorativa banhada.",
    deliverables: [
      { icon: "ship", label: "Embarque em escuna privativa exclusiva para a equipe" },
      { icon: "utensils", label: "Jantar completo de confraternização no salão do clube" },
      { icon: "star", label: "Clínica técnica com os técnicos Zezé Moreira e Márcio Latuf" },
      { icon: "lock", label: "Estrutura náutica fechada de altíssimo padrão e segurança" }
    ],
    pricing: {
      sitePrice: 280.00,
      publicPrice: 280.00,
      teamPrice: 220.00,
      notes: "Pacote VIP all-inclusive: prova + traslado marítimo + jantar comemorativo."
    },
    teamBenefits: "Condição VIP exclusiva com jantar e escuna privativa inclusos no pacote, acesso às instalações do clube para acompanhantes e mentoria técnica conjunta com lendas da maratona aquática.",
    logistics: "Distância SBC: ~75 km (~1h15 via Anchieta/Imigrantes). Acesso rápido no litoral.",
    likes: 27,
    order: 3
  },
  {
    id: "gaivotas-eventos-2027",
    name: "Circuito Gaivotas Eventos",
    organizer: "Gaivotas Eventos Esportivos",
    responsible: "Diretoria Técnica Gaivotas Eventos • Linha Direta ADCSBC",
    stageLocations: "Guarujá - SP (Forte dos Andradas, Praia do Tombo, Guaiúba e Enseada)",
    waterType: "Mar Aberto",
    status: "Confirmado",
    location: "Guarujá - SP (Forte dos Andradas)",
    coverImage: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80",
    distances: ["750m", "1.5km", "3km", "5km"],
    stages: [
      { name: "Etapa 1", date: "Jan/2027", info: "Praia do Guaiúba / Forte dos Andradas" },
      { name: "Etapa 2", date: "Mar/2027", info: "Praia do Tombo" },
      { name: "Etapa 3", date: "Mai/2027", info: "Praia da Enseada Guarujá" },
      { name: "Etapa 4", date: "Ago/2027", info: "Forte dos Andradas" },
      { name: "Etapa 5", date: "Out/2027", info: "Prainha Branca" },
      { name: "Etapa 6", date: "Dez/2027", info: "Forte dos Andradas (Premiação Final)" }
    ],
    deliverablesText: "Circuito tradicionalíssimo com 6 etapas, estrutura com tenda oficial da ADCSBC em todas as provas, chip de cronometragem eletrônica, premiação no pódio geral e por categorias, defesa do troféu de Campeões Gerais 2026.",
    deliverables: [
      { icon: "trophy", label: "Defesa de Título: ADCSBC é a atual Campeã Geral da Temporada 2026!" },
      { icon: "flag", label: "Tenda oficial da equipe montada na areia em todas as 6 etapas" },
      { icon: "clock", label: "Cronometragem por chip descartável e resultado instantâneo" },
      { icon: "award", label: "Troféus especiais de equipe para a comissão técnica Zezé Moreira" }
    ],
    pricing: {
      sitePrice: 220.00,
      publicPrice: 220.00,
      teamPrice: 180.00,
      notes: "Tarifa preferencial de equipe campeã 2026 com desconto em todas as etapas."
    },
    teamBenefits: "Condição de equipe campeã geral com desconto garantido, localização privilegiada para montagem da tenda ADCSBC, pontuação dobrada para ranking de equipes e facilidade logística de bate-e-volta.",
    logistics: "Distância SBC: ~80 km (~1h20). Bate-e-volta fácil e econômico.",
    likes: 31,
    order: 4
  },
  {
    id: "igor-eventos-2027",
    name: "Igor Eventos - Circuito Paulista",
    organizer: "Igor Eventos Aquáticos",
    responsible: "Igor de Souza & Equipe de Organização",
    stageLocations: "Paraibuna, Igaratá, Ilhabela, São Sebastião, Wet'n Wild e Billings - SP",
    waterType: "Represa",
    status: "Aguardando Valores",
    location: "Múltiplas Cidades / Interior e Litoral - SP",
    coverImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    distances: ["600m", "1.2km", "2km", "4km"],
    stages: [
      { name: "Etapa 1", date: "Jan/2027", info: "Paraibuna (Represa)" },
      { name: "Etapa 2", date: "Mar/2027", info: "Igaratá" },
      { name: "Etapa 3", date: "Mai/2027", info: "Nazaré Paulista" },
      { name: "Etapa 4", date: "Jul/2027", info: "Ilhabela (Mar Aberto)" },
      { name: "Etapa 5", date: "Set/2027", info: "São Sebastião" },
      { name: "Etapa 6", date: "Nov/2027", info: "Wet'n Wild / Final de Temporada" }
    ],
    deliverablesText: "Maior calendário do estado com 11 etapas distribuídas, diversidade geográfica (represas calmas, mar aberto e parque aquático), medalhas colecionáveis que se encaixam e premiações para estreantes.",
    deliverables: [
      { icon: "calendar", label: "Calendário mais extenso do estado com 11 etapas distribuídas" },
      { icon: "compass", label: "Variedade geográfica: represas calmas, mar aberto e parque aquático" },
      { icon: "users", label: "Ambiente acolhedor, ideal para estreantes e nadadores masters" },
      { icon: "award", label: "Medalhas colecionáveis que se encaixam formando o mapa de SP" }
    ],
    pricing: {
      sitePrice: 210.00,
      publicPrice: 210.00,
      teamPrice: 170.00,
      notes: "Valores prévios de referência para o lote 2027. Aguardando tabela final de federação."
    },
    teamBenefits: "Opção de pacote com desconto progressivo para atletas que fizerem mais de 3 etapas no ano, inscrição gratuita para o treinador e pontuação de equipe.",
    logistics: "Distâncias variadas (de 50km a 150km de SBC). Facilidade para etapas locais.",
    likes: 15,
    order: 5
  },
  {
    id: "th5-eventos-2027",
    name: "Circuito TH5 de Travessias Aquáticas",
    organizer: "TH5 Eventos e Esportes",
    responsible: "Tadeu / Organização TH5 Eventos",
    stageLocations: "Bertioga (Canal de Bertioga), Ilhabela e Santos - SP",
    waterType: "Mar Aberto",
    status: "Em Estudo",
    location: "Litoral Paulista (Bertioga, Ilhabela, Santos)",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    distances: ["800m", "1.5km", "3km", "Travessia Canal"],
    stages: [
      { name: "Etapa 1", date: "Mar/2027 (Previsão)", info: "Travessia Canal de Bertioga" },
      { name: "Etapa 2", date: "Ago/2027 (Previsão)", info: "Desafio Ilhabela" },
      { name: "Etapa 3", date: "Nov/2027 (Previsão)", info: "Travessia Santos / São Vicente" }
    ],
    deliverablesText: "Travessias aquáticas tradicionais em mar aberto com fortes desafios de navegação e correnteza, kit clássico com touca numerada, hidratação na chegada e premiação no pódio.",
    deliverables: [
      { icon: "anchor", label: "Provas clássicas de travessia com forte apelo técnico e navegação" },
      { icon: "map", label: "Percursos desafiadores em canais e baías protegidas" },
      { icon: "shirt", label: "Kit tradicional com touca numerada e brindes" },
      { icon: "shield", label: "Acompanhamento náutico com a Capitania dos Portos" }
    ],
    pricing: {
      sitePrice: 230.00,
      publicPrice: 230.00,
      teamPrice: 185.00,
      notes: "Valores prévios da temporada anterior; regulamento e calendário 2027 em levantamento."
    },
    teamBenefits: "Desconto para inscrição conjunta da equipe ADCSBC e possibilidade de bate-e-volta com custo reduzido.",
    logistics: "Distância SBC: ~90 km (~1h20).",
    likes: 9,
    order: 6
  }
];
