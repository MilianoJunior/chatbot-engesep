// Helper para criar a estrutura repetitiva de temperaturas
const criarEstruturaTemperatura = (baseName, valueAddr, alarmeAddr, tripAddr) => ({
    [`${baseName} value`]: valueAddr,
    [`${baseName} alarmes`]: alarmeAddr,
    [`${baseName} trip`]: tripAddr,
});

// Template base para uma Unidade Geradora (UG) padrão
const criarUgTemplate = (conexao, caracteristicas) => ({
    conexao,
    caracteristicas,
    potencias: {
        REAL: { "Potência Ativa": 13407 },
    },
    nivel_agua: {
        REAL: { "Nível Montante": 13519, "Nível Jusante": 13521 },
    },
    gerador: {
        REAL: {
            "Tensão Fase A": 13385, "Tensão Fase B": 13387, "Tensão Fase C": 13389,
            "Corrente Fase A": 13399, "Corrente Fase B": 13401, "Corrente Fase C": 13403,
        },
    },
});

const leituras = {
    "CGH-APARECIDA": {
        ip: "100.110.212.125",
        port: 8010,
        table: "cgh_aparecida",
        CLPS: {
            "UG-01": {
                ...criarUgTemplate(
                    { ip: '192.168.10.2', port: 502 },
                    { 'potência máxima': 3350, 'velocidade máxima': 450 }
                ),
                potencias: { INT: { "Potência Ativa": 13407 } },
                nivel_agua: {
                    REAL: {
                        "Nível Montante": 13519,
                        "Nível Jusante": 13521,
                        "Diferença de Nível": 13525,
                    }
                },
                gerador: {
                    REAL: {
                        "Tensão Fase A": 13385,
                        "Tensão Fase B": 13387,
                        "Tensão Fase C": 13389,
                    },
                    INT: {
                        "Corrente Fase A": 13399,
                        "Corrente Fase B": 13401,
                        "Corrente Fase C": 13403,
                    }
                },
                temperaturas: {
                    REAL: {
                        ...criarEstruturaTemperatura('Enrolamento Fase A', 13469, 13989, 13925),
                        ...criarEstruturaTemperatura('Enrolamento Fase B', 13471, 13991, 13927),
                        ...criarEstruturaTemperatura('Enrolamento Fase C', 13473, 13993, 13929),
                        ...criarEstruturaTemperatura('Tiristor 1', 13455, 13975, 13911),
                        ...criarEstruturaTemperatura('Tiristor 2', 13457, 13977, 13913),
                        ...criarEstruturaTemperatura('Tiristor 3', 13459, 13979, 13915),
                        ...criarEstruturaTemperatura('Resistor Crowbar 1', 13461, 13983, 13919),
                        ...criarEstruturaTemperatura('Resistor Crowbar 2', 13491, 13411, 13497),
                        ...criarEstruturaTemperatura('Transf. Exitação', 13463, 13983, 13919),
                        ...criarEstruturaTemperatura('Óleo U.H.R.V.', 13465, 13985, 13921),
                        ...criarEstruturaTemperatura('Óleo U.H.L.M.', 13467, 13987, 13923),
                        ...criarEstruturaTemperatura('Nucleo Estator 1', 13475, 13995, 13931),
                        ...criarEstruturaTemperatura('Nucleo Estator 2', 13477, 13997, 13933),
                        ...criarEstruturaTemperatura('Nucleo Estator 3', 13479, 13999, 13935),
                        ...criarEstruturaTemperatura('Manc. Casq. Rad. Guia', 13481, 14001, 13937),
                        ...criarEstruturaTemperatura('Mancal Comb. Casq', 13483, 14003, 13939),
                        ...criarEstruturaTemperatura('Mancal Comb. Esc.', 13485, 14005, 13941),
                        ...criarEstruturaTemperatura('Mancal Comb. Contra Esc.', 13487, 14007, 13943),
                        ...criarEstruturaTemperatura('Mancal Guia Casq. Turb.', 13489, 14009, 13945),
                    }
                },
                monitoramento: {
                    BOOLEAN: { "Queda de energia da Celesc": 16291 },
                },
            },
        }
    },
    "CGH-FAE": {
        ip: "100.106.33.66",
        port: 8010,
        table: "cgh_fae",
        CLPS: {
            "UG-01": {
                ...criarUgTemplate(
                    { ip: '192.168.10.2', port: 502 },
                    { 'potência máxima': 1350, 'velocidade máxima': 415 }
                ),
                temperaturas: {
                    REAL: {
                        ...criarEstruturaTemperatura('Enrolamento Fase A', 13455, 13975, 13911),
                        ...criarEstruturaTemperatura('Enrolamento Fase B', 13457, 13977, 13913),
                        ...criarEstruturaTemperatura('Enrolamento Fase C', 13459, 13979, 13915),
                        ...criarEstruturaTemperatura('Nucleo do estator', 13461, 13981, 13917),
                        ...criarEstruturaTemperatura('Mancal Guia', 13463, 13983, 13919),
                        ...criarEstruturaTemperatura('Mancal Combinado', 13465, 13985, 13921),
                        ...criarEstruturaTemperatura('Mancal Escora', 13467, 13987, 13923),
                        ...criarEstruturaTemperatura('Óleo U.H.R.V.', 13469, 13989, 13925),
                        ...criarEstruturaTemperatura('Óleo U.H.L.M.', 13471, 13991, 13927),
                    }
                },
                monitoramento: {
                    BOOLEAN: { "Queda de energia da Celesc": 16291 },
                },
            },
            "UG-02": {
                ...criarUgTemplate(
                    { ip: '192.168.10.3', port: 502 },
                    { 'potência máxima': 650, 'velocidade máxima': 800 }
                ),
                nivel_agua: {
                    REAL: {
                        "Nível Montante UG-02": 13519,
                        "Nível Jusante UG-02": 13521,
                    }
                },
                temperaturas: {
                    REAL: {
                        ...criarEstruturaTemperatura('Enrolamento Fase A', 13455, 13975, 13911),
                        ...criarEstruturaTemperatura('Enrolamento Fase B', 13457, 13977, 13913),
                        ...criarEstruturaTemperatura('Enrolamento Fase C', 13459, 13979, 13915),
                        ...criarEstruturaTemperatura('Nucleo do estator', 13461, 13981, 13917),
                        ...criarEstruturaTemperatura('Mancal Guia', 13463, 13983, 13919),
                        ...criarEstruturaTemperatura('Mancal Combinado', 13465, 13985, 13921),
                        ...criarEstruturaTemperatura('Mancal Escora', 13467, 13987, 13923),
                        ...criarEstruturaTemperatura('Óleo U.H.R.V.', 13469, 13989, 13925),
                        ...criarEstruturaTemperatura('Óleo U.H.L.M.', 13471, 13991, 13927),
                        ...criarEstruturaTemperatura('ENGEXC', 13475, 13997, 13933),
                        ...criarEstruturaTemperatura('CSS-U1', 13475, 13995, 13931),
                    }
                }
            },
        }
    },
    "PCH-PEDRAS": {
        ip: "100.93.237.40",
        port: 8010,
        table: "cgh_das_pedras",
        CLPS: {
            "UG-01": {
                ...criarUgTemplate(
                    { ip: '192.168.10.2', port: 502 },
                    { 'potência máxima': 2800, 'velocidade máxima': 450 }
                ),
                nivel_agua: {
                    REAL: {
                        "Nível Montante UG-01": 13519,
                        "Nível Jusante UG-01": 13521,
                    }
                },
                temperaturas: {
                    REAL: {
                        ...criarEstruturaTemperatura('Enrolamento Fase A', 13459, 13979, 13915),
                        ...criarEstruturaTemperatura('Enrolamento Fase B', 13461, 13981, 13917),
                        ...criarEstruturaTemperatura('Enrolamento Fase C', 13463, 13983, 13919),
                        ...criarEstruturaTemperatura('G Mancal L.A. Guia', 13465, 13985, 13921),
                        ...criarEstruturaTemperatura('G Mancal L.N.A. Guia', 13469, 13989, 13925),
                        ...criarEstruturaTemperatura('G Mancal L.N.A. Escora', 13467, 13987, 13923),
                        ...criarEstruturaTemperatura('T Bucha Radial 01', 13457, 13977, 13913),
                        ...criarEstruturaTemperatura('T Bucha Radial 02', 13475, 13995, 13931),
                        ...criarEstruturaTemperatura('T Gaxeteiro 01', 13455, 13975, 13911),
                        ...criarEstruturaTemperatura('T Gaxeteiro 02', 13473, 13993, 13929),
                        ...criarEstruturaTemperatura('T Gaxeteiro 03', 13471, 13991, 13927),
                        ...criarEstruturaTemperatura('Óleo U.H.L.M.', 13481, 14001, 13937),
                        ...criarEstruturaTemperatura('Óleo U.H.R.V.', 13479, 13999, 13935),
                    }
                },
                monitoramento: {
                    BOOLEAN: { "Queda de energia da Celesc": 20309 },
                },
            },
            "UG-02": {
                ...criarUgTemplate(
                    { ip: '192.168.10.3', port: 502 },
                    { 'potência máxima': 2800, 'velocidade máxima': 450 }
                ),
                nivel_agua: {
                    REAL: {
                        "Nível Montante UG-02": 13519,
                        "Nível Jusante UG-02": 13521,
                    }
                },
                temperaturas: {
                    REAL: {
                        ...criarEstruturaTemperatura('Enrolamento Fase A', 13459, 13979, 13915),
                        ...criarEstruturaTemperatura('Enrolamento Fase B', 13461, 13981, 13917),
                        ...criarEstruturaTemperatura('Enrolamento Fase C', 13463, 13983, 13919),
                        ...criarEstruturaTemperatura('G Mancal L.A. Guia', 13465, 13985, 13921),
                        ...criarEstruturaTemperatura('G Mancal L.N.A. Guia', 13469, 13989, 13925),
                        ...criarEstruturaTemperatura('G Mancal L.N.A. Escora', 13467, 13987, 13923),
                        ...criarEstruturaTemperatura('T Bucha Radial 01', 13457, 13977, 13913),
                        ...criarEstruturaTemperatura('T Bucha Radial 02', 13475, 13995, 13931),
                        ...criarEstruturaTemperatura('T Gaxeteiro 01', 13455, 13975, 13911),
                        ...criarEstruturaTemperatura('T Gaxeteiro 02', 13473, 13993, 13929),
                        ...criarEstruturaTemperatura('T Gaxeteiro 03', 13471, 13991, 13927),
                        ...criarEstruturaTemperatura('Óleo U.H.L.M.', 13481, 14001, 13937),
                        ...criarEstruturaTemperatura('Óleo U.H.R.V.', 13479, 13999, 13935),
                    }
                }
            },
        }
    },
    "CGH-PICADAS-ALTAS": {
        ip: "100.79.241.13",
        port: 8010,
        table: "cgh_picadas_altas",
        CLPS: {
            "UG-01": {
                ...criarUgTemplate(
                    { ip: '192.168.10.2', port: 502 },
                    { 'potência máxima': 300, 'velocidade máxima': 450 }
                ),
                nivel_agua: {
                    REAL: {
                        "Nível Montante UG-01": 13519,
                        "Nível Jusante UG-01": 13521,
                    }
                },
                temperaturas: {
                    REAL: {
                        ...criarEstruturaTemperatura('Enrolamento Fase A', 13455, 13975, 13911),
                        ...criarEstruturaTemperatura('Enrolamento Fase B', 13457, 13977, 13913),
                        ...criarEstruturaTemperatura('Enrolamento Fase C', 13459, 13979, 13915),
                        ...criarEstruturaTemperatura('Nucleo do estator', 13461, 13981, 13917),
                        ...criarEstruturaTemperatura('CS-U2', 13475, 13995, 13931),
                        ...criarEstruturaTemperatura('Manc. Comb. Rad. L.A.', 13463, 13983, 13919),
                        ...criarEstruturaTemperatura('Manc. Comb. Esc. L.A.', 13465, 13985, 13921),
                        ...criarEstruturaTemperatura('Manc. Cont. Esc. L.A.', 13467, 13987, 13923),
                        ...criarEstruturaTemperatura('Mancal Guia L.N.A.', 13469, 13989, 13925),
                        ...criarEstruturaTemperatura('Óleo U.H.L.M.', 13473, 13993, 13929),
                    }
                },
                monitoramento: {
                    BOOLEAN: { "Queda de energia da Celesc": 20311 },
                },
            },
            "UG-02": {
                ...criarUgTemplate(
                    { ip: '192.168.10.3', port: 502 },
                    { 'potência máxima': 700, 'velocidade máxima': 450 }
                ),
                nivel_agua: {
                    REAL: {
                        "Nível Montante UG-02": 13519,
                        "Nível Jusante UG-02": 13521,
                    }
                },
                temperaturas: {
                    REAL: {
                        ...criarEstruturaTemperatura('Enrolamento Fase A', 13455, 13975, 13911),
                        ...criarEstruturaTemperatura('Enrolamento Fase B', 13457, 13977, 13913),
                        ...criarEstruturaTemperatura('Enrolamento Fase C', 13459, 13979, 13915),
                        ...criarEstruturaTemperatura('Nucleo do estator', 13461, 13981, 13917),
                        ...criarEstruturaTemperatura('CS-U2', 13475, 13995, 13931),
                        ...criarEstruturaTemperatura('Manc. Comb. Rad. L.A.', 13463, 13983, 13919),
                        ...criarEstruturaTemperatura('Manc. Comb. Esc. L.A.', 13465, 13985, 13921),
                        ...criarEstruturaTemperatura('Manc. Cont. Esc. L.A.', 13467, 13987, 13923),
                        ...criarEstruturaTemperatura('Mancal Guia L.N.A.', 13469, 13989, 13925),
                        ...criarEstruturaTemperatura('Óleo U.H.L.M.', 13473, 13993, 13929),
                    }
                }
            },
        }
    },
    "CGH-HOPPEN": {
        ip: "100.73.37.105",
        port: 8010,
        table: "cgh_hoppen",
        CLPS: {
            "UG-01": {
                ...criarUgTemplate(
                    { ip: '192.168.10.2', port: 502 },
                    { 'potência máxima': 1300, 'velocidade máxima': 415 }
                ),
                nivel_agua: {
                    REAL: {
                        "Nível Montante UG-01": 13519,
                        "Nível Jusante UG-01": 13521,
                    }
                },
                temperaturas: {
                    REAL: {
                        ...criarEstruturaTemperatura('Enrolamento Fase A', 13455, 13975, 13911),
                        ...criarEstruturaTemperatura('Enrolamento Fase B', 13457, 13977, 13913),
                        ...criarEstruturaTemperatura('Enrolamento Fase C', 13459, 13979, 13915),
                        ...criarEstruturaTemperatura('Nucleo do estator', 13461, 13981, 13917),
                        ...criarEstruturaTemperatura('Vedação do eixo LNA', 13463, 13983, 13919),
                        ...criarEstruturaTemperatura('Vedação do eixo LA', 13465, 13985, 13921),
                        ...criarEstruturaTemperatura('Mancal Escora Combinado', 13467, 13987, 13923),
                        ...criarEstruturaTemperatura('Mancal Radial Combinado', 13469, 13989, 13925),
                        ...criarEstruturaTemperatura('Cont. Esc. Manc. Comb.', 13471, 13991, 13927),
                        ...criarEstruturaTemperatura('Mancal Radial Guia', 13473, 13993, 13929),
                        ...criarEstruturaTemperatura('Mancal Rad. Comb. L.A.', 13475, 13995, 13931),
                        ...criarEstruturaTemperatura('Mancal Rad. Comb. L.N.A.', 13477, 13997, 13933),
                        ...criarEstruturaTemperatura('Óleo U.H.R.V.', 13479, 13999, 13935),
                        ...criarEstruturaTemperatura('Óleo U.H.L.M.', 13481, 14001, 13937),
                        ...criarEstruturaTemperatura('CS-01', 13483, 14003, 13939),
                    }
                },
                monitoramento: {
                    BOOLEAN: { "Queda de energia da Celesc": 20311 },
                },
            },
            "UG-02": {
                ...criarUgTemplate(
                    { ip: '192.168.10.3', port: 502 },
                    { 'potência máxima': 1300, 'velocidade máxima': 415 }
                ),
                nivel_agua: {
                    REAL: {
                        "Nível Montante UG-02": 13519,
                        "Nível Jusante UG-02": 13521,
                    }
                },
                gerador: {
                    REAL: {
                        "Tensão Fase A": 13385,
                        "Tensão Fase B": 13387,
                        "Tensão Fase C": 13389,
                    },
                },
                temperaturas: {
                    REAL: {
                        ...criarEstruturaTemperatura('Enrolamento Fase A', 13455, 13975, 13911),
                        ...criarEstruturaTemperatura('Enrolamento Fase B', 13457, 13977, 13913),
                        ...criarEstruturaTemperatura('Enrolamento Fase C', 13459, 13979, 13915),
                        ...criarEstruturaTemperatura('Nucleo do estator', 13461, 13981, 13917),
                        ...criarEstruturaTemperatura('Vedação do eixo LNA', 13463, 13983, 13919),
                        ...criarEstruturaTemperatura('Vedação do eixo LA', 13465, 13985, 13921),
                        ...criarEstruturaTemperatura('Mancal Escora Combinado', 13467, 13987, 13923),
                        ...criarEstruturaTemperatura('Mancal Radial Combinado', 13469, 13989, 13925),
                        ...criarEstruturaTemperatura('Cont. Esc. Manc. Comb.', 13471, 13991, 13927),
                        ...criarEstruturaTemperatura('Mancal Radial Guia', 13473, 13993, 13929),
                        ...criarEstruturaTemperatura('Mancal Rad. Comb. L.A.', 13475, 13995, 13931),
                        ...criarEstruturaTemperatura('Mancal Rad. Comb. L.N.A.', 13477, 13997, 13933),
                        ...criarEstruturaTemperatura('Óleo U.H.R.V.', 13479, 13999, 13935),
                        ...criarEstruturaTemperatura('Óleo U.H.L.M.', 13481, 14001, 13937),
                        ...criarEstruturaTemperatura('CS-01', 13483, 14003, 13939),
                    }
                }
            },
        }
    }
};

module.exports = leituras;