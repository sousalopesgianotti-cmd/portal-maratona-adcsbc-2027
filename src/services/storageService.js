import { INITIAL_CIRCUITS } from '../data/initialCircuits';

const STORAGE_KEYS = {
  CIRCUITS: 'adcsbc_circuits_2027_v2', // v2 para garantir atualização dos 8 novos campos
  BALLOTS: 'adcsbc_ballots_2027_v1',
  USER_VOTE: 'adcsbc_user_ballot_2027_v1',
  USER_LIKES: 'adcsbc_user_likes_2027_v1',
  USER_DEVICE_ID: 'adcsbc_device_id_2027_v1',
  ADMIN_PASSWORD: 'adcsbc_admin_pass_2027_v1',
  VOTING_ENABLED: 'adcsbc_voting_enabled_2027_v1'
};

const DEFAULT_ADMIN_PASSWORD = 'adcsbc2027';

function getDeviceId() {
  let id = localStorage.getItem(STORAGE_KEYS.USER_DEVICE_ID);
  if (!id) {
    id = 'voter_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem(STORAGE_KEYS.USER_DEVICE_ID, id);
  }
  return id;
}

const INITIAL_MOCK_BALLOTS = [
  { deviceId: 'seed_01', first: 'gaivotas-eventos-2027', second: 'marcio-latuf-2027', third: 'circuito-mares-2027' },
  { deviceId: 'seed_02', first: 'circuito-mares-2027', second: 'gaivotas-eventos-2027', third: 'golfinho-eventos-2027' },
  { deviceId: 'seed_03', first: 'marcio-latuf-2027', second: 'gaivotas-eventos-2027', third: 'igor-eventos-2027' },
  { deviceId: 'seed_04', first: 'gaivotas-eventos-2027', second: 'marcio-latuf-2027', third: 'th5-eventos-2027' },
  { deviceId: 'seed_05', first: 'circuito-mares-2027', second: 'marcio-latuf-2027', third: 'gaivotas-eventos-2027' },
  { deviceId: 'seed_06', first: 'golfinho-eventos-2027', second: 'circuito-mares-2027', third: 'gaivotas-eventos-2027' },
  { deviceId: 'seed_07', first: 'gaivotas-eventos-2027', second: 'circuito-mares-2027', third: 'marcio-latuf-2027' },
  { deviceId: 'seed_08', first: 'marcio-latuf-2027', second: 'golfinho-eventos-2027', third: 'igor-eventos-2027' },
  { deviceId: 'seed_09', first: 'circuito-mares-2027', second: 'gaivotas-eventos-2027', third: 'marcio-latuf-2027' },
  { deviceId: 'seed_10', first: 'gaivotas-eventos-2027', second: 'marcio-latuf-2027', third: 'golfinho-eventos-2027' },
  { deviceId: 'seed_11', first: 'igor-eventos-2027', second: 'gaivotas-eventos-2027', third: 'circuito-mares-2027' },
  { deviceId: 'seed_12', first: 'marcio-latuf-2027', second: 'circuito-mares-2027', third: 'gaivotas-eventos-2027' },
  { deviceId: 'seed_13', first: 'gaivotas-eventos-2027', second: 'golfinho-eventos-2027', third: 'marcio-latuf-2027' },
  { deviceId: 'seed_14', first: 'circuito-mares-2027', second: 'gaivotas-eventos-2027', third: 'th5-eventos-2027' },
];

export const storageService = {
  // ---- CIRCUITOS ----
  getCircuits: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CIRCUITS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CIRCUITS, JSON.stringify(INITIAL_CIRCUITS));
        return INITIAL_CIRCUITS;
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Erro ao ler circuitos do LocalStorage:', err);
      return INITIAL_CIRCUITS;
    }
  },

  saveCircuits: (circuits) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CIRCUITS, JSON.stringify(circuits));
    } catch (err) {
      console.error('Erro ao salvar circuitos no LocalStorage:', err);
    }
  },

  createCircuit: (newCircuitData) => {
    const circuits = storageService.getCircuits();
    const id = newCircuitData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) + '-' + Date.now().toString(36);
    const newCircuit = {
      ...newCircuitData,
      id,
      likes: 0,
      order: circuits.length + 1
    };
    const updated = [newCircuit, ...circuits];
    storageService.saveCircuits(updated);
    return updated;
  },

  updateCircuit: (updatedCircuit) => {
    const circuits = storageService.getCircuits();
    const index = circuits.findIndex(c => c.id === updatedCircuit.id);
    if (index !== -1) {
      circuits[index] = { ...circuits[index], ...updatedCircuit };
      storageService.saveCircuits(circuits);
    }
    return circuits;
  },

  deleteCircuit: (circuitId) => {
    const circuits = storageService.getCircuits();
    const filtered = circuits.filter(c => c.id !== circuitId);
    storageService.saveCircuits(filtered);
    return filtered;
  },

  // ---- CURTIDAS (LIKES) ----
  getUserLikes: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_LIKES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  toggleLike: (circuitId) => {
    const userLikes = storageService.getUserLikes();
    const circuits = storageService.getCircuits();
    const circuit = circuits.find(c => c.id === circuitId);
    if (!circuit) return { success: false, isLiked: false, likes: 0 };

    const wasLiked = !!userLikes[circuitId];
    if (wasLiked) {
      // Descurtir é sempre permitido
      delete userLikes[circuitId];
      circuit.likes = Math.max(0, (circuit.likes || 0) - 1);
    } else {
      // Bloqueia se já tiver 3 opções curtidas
      const currentLikedCount = Object.keys(userLikes).length;
      if (currentLikedCount >= 3) {
        return {
          success: false,
          blocked: true,
          reason: 'LIMIT_REACHED',
          isLiked: false,
          likes: circuit.likes,
          circuits
        };
      }
      userLikes[circuitId] = true;
      circuit.likes = (circuit.likes || 0) + 1;
    }

    localStorage.setItem(STORAGE_KEYS.USER_LIKES, JSON.stringify(userLikes));
    storageService.saveCircuits(circuits);

    return {
      success: true,
      blocked: false,
      isLiked: !wasLiked,
      likes: circuit.likes,
      circuits
    };
  },

  // ---- CÉDULA DE VOTAÇÃO ANÔNIMA (SECRET BALLOT) ----
  getBallots: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BALLOTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BALLOTS, JSON.stringify(INITIAL_MOCK_BALLOTS));
        return INITIAL_MOCK_BALLOTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MOCK_BALLOTS;
    }
  },

  getUserBallot: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_VOTE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  submitBallot: ({ first, second, third }) => {
    const deviceId = getDeviceId();
    const ballots = storageService.getBallots();

    const existingIndex = ballots.findIndex(b => b.deviceId === deviceId);
    const newBallot = {
      deviceId,
      first,
      second,
      third,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      ballots[existingIndex] = newBallot;
    } else {
      ballots.push(newBallot);
    }

    localStorage.setItem(STORAGE_KEYS.BALLOTS, JSON.stringify(ballots));
    
    const userVote = {
      hasVoted: true,
      first,
      second,
      third,
      votedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.USER_VOTE, JSON.stringify(userVote));

    return {
      success: true,
      userVote,
      ballots
    };
  },

  // ---- CÁLCULO DE RANKING BORDA (1º=3, 2º=2, 3º=1) ----
  calculateScores: (circuitsList = null, ballotsList = null) => {
    const circuits = circuitsList || storageService.getCircuits();
    const ballots = ballotsList || storageService.getBallots();

    const scoreMap = {};
    circuits.forEach(c => {
      scoreMap[c.id] = {
        circuit: c,
        firstVotes: 0,
        secondVotes: 0,
        thirdVotes: 0,
        totalVotes: 0,
        totalPoints: 0,
        percentage: 0
      };
    });

    ballots.forEach(b => {
      if (scoreMap[b.first]) {
        scoreMap[b.first].firstVotes += 1;
        scoreMap[b.first].totalPoints += 3;
        scoreMap[b.first].totalVotes += 1;
      }
      if (scoreMap[b.second]) {
        scoreMap[b.second].secondVotes += 1;
        scoreMap[b.second].totalPoints += 2;
        scoreMap[b.second].totalVotes += 1;
      }
      if (scoreMap[b.third]) {
        scoreMap[b.third].thirdVotes += 1;
        scoreMap[b.third].totalPoints += 1;
        scoreMap[b.third].totalVotes += 1;
      }
    });

    const totalVoters = ballots.length;

    const ranked = Object.values(scoreMap).map(item => {
      const percentage = totalVoters > 0 ? Math.round((item.totalPoints / (totalVoters * 3)) * 100) : 0;
      return {
        ...item,
        percentage
      };
    });

    ranked.sort((a, b) => b.totalPoints - a.totalPoints || b.firstVotes - a.firstVotes);

    return {
      ranked,
      totalVoters,
      totalBallots: ballots.length
    };
  },

  // ---- EXPORTAÇÃO E IMPORTAÇÃO ----
  exportDataJSON: () => {
    const circuits = storageService.getCircuits();
    const ballots = storageService.getBallots();
    const payload = {
      app: 'Portal Maratona Aquática ADCSBC 2027',
      exportedAt: new Date().toISOString(),
      version: '2.0',
      standardFields: [
        'Nome do Circuito / Organizador',
        'Responsável',
        'Locais das Etapas',
        'Distâncias / Provas',
        'Calendário Anual (Etapas com datas)',
        'Entregas & Estrutura',
        'Preços (Site x Equipe ADCSBC)',
        'Benefícios para Equipes'
      ],
      circuits,
      ballotsSummary: storageService.calculateScores(circuits, ballots)
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ADCSBC_Maratonas_2027_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  exportDataCSV: () => {
    const { ranked, totalVoters } = storageService.calculateScores();
    
    let csv = 'Posição;Circuito / Organizador;Responsável;Locais das Etapas;Distâncias;Etapas Mapeadas;Preço Site Oficial;Preço Equipe ADCSBC;Economia por Atleta;Benefícios para Equipes;Pontuação Borda;Percentual Preferência;Votos 1º;Votos 2º;Votos 3º\n';
    
    ranked.forEach((item, index) => {
      const c = item.circuit;
      const sitePrice = c.pricing?.sitePrice || c.pricing?.publicPrice || 0;
      const teamPrice = c.pricing?.teamPrice || 0;
      const savings = Math.max(0, sitePrice - teamPrice);
      const stagesStr = (c.stages || []).map(s => `${s.name}: ${s.date}`).join(' | ');

      const line = [
        `${index + 1}º`,
        `"${c.name} (${c.organizer || ''})"`,
        `"${c.responsible || 'A definir'}"`,
        `"${c.stageLocations || c.location || ''}"`,
        `"${(c.distances || []).join(', ')}"`,
        `"${stagesStr}"`,
        `"R$ ${sitePrice.toFixed(2)}"`,
        `"R$ ${teamPrice.toFixed(2)}"`,
        `"R$ ${savings.toFixed(2)}"`,
        `"${c.teamBenefits || 'A definir'}"`,
        item.totalPoints,
        `${item.percentage}%`,
        item.firstVotes,
        item.secondVotes,
        item.thirdVotes
      ].join(';');
      csv += line + '\n';
    });

    csv += `\nTotal de Atletas Votantes Computados:;${totalVoters}\n`;

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ADCSBC_Ranking_Maratonas_2027_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },

  importDataJSON: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.circuits)) {
        storageService.saveCircuits(parsed.circuits);
        if (Array.isArray(parsed.ballots)) {
          localStorage.setItem(STORAGE_KEYS.BALLOTS, JSON.stringify(parsed.ballots));
        }
        return { success: true, message: 'Dados importados com sucesso!' };
      }
      return { success: false, message: 'Arquivo JSON em formato incompatível.' };
    } catch (e) {
      return { success: false, message: 'Erro ao interpretar arquivo JSON.' };
    }
  },

  resetToDefaults: () => {
    localStorage.setItem(STORAGE_KEYS.CIRCUITS, JSON.stringify(INITIAL_CIRCUITS));
    localStorage.setItem(STORAGE_KEYS.BALLOTS, JSON.stringify(INITIAL_MOCK_BALLOTS));
    localStorage.removeItem(STORAGE_KEYS.USER_VOTE);
    localStorage.removeItem(STORAGE_KEYS.USER_LIKES);
    return {
      circuits: INITIAL_CIRCUITS,
      ballots: INITIAL_MOCK_BALLOTS
    };
  },

  getAdminPassword: () => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || DEFAULT_ADMIN_PASSWORD;
  },

  setAdminPassword: (newPassword) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
      return true;
    } catch {
      return false;
    }
  },

  verifyPassword: (pass) => {
    const realPass = storageService.getAdminPassword();
    return pass === realPass;
  },

  // ---- STATUS DE ABERTURA DA VOTAÇÃO ----
  isVotingEnabled: () => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.VOTING_ENABLED);
      // Padrão: Desabilitado (false)
      return val === 'true';
    } catch {
      return false;
    }
  },

  setVotingEnabled: (enabled) => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOTING_ENABLED, enabled ? 'true' : 'false');
      return enabled;
    } catch {
      return false;
    }
  }
};
