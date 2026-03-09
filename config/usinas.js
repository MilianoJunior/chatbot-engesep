const leituras = {
    "CGH-APARECIDA": {
        "ip": "100.110.212.125",
        "port": 8010,
        "table": "cgh_aparecida",
        "CLPS": {
            "UG-01": {
                'conexao': {
                    'ip': '192.168.10.2',
                    'port': 502
                }, 
                'caracteristicas': {
                    'potência máxima': 3350,
                    'velocidade máxima': 450,
                    'nível de vertimento': 405.28
                },
                'potencias': {
                    "Potência Ativa": [13407, "INT", {"offset": -1}]
                },
                'nivel_agua': {
                    "Nível Montante": [13519, "REAL", {"offset": -1}],
                    "Nível Jusante": [13521, "REAL", {"offset": -1}],
                    "Diferença de Nível": [13525, "REAL", {"offset": -1}]
                },
                'gerador': {
                    "Tensão Fase A": [13385, "REAL", {"offset": -1}],
                    "Tensão Fase B": [13387, "REAL", {"offset": -1}],
                    "Tensão Fase C": [13389, "REAL", {"offset": -1}],
                    "Corrente Fase A": [13399, "INT", {"offset": -1}],
                    "Corrente Fase B": [13401, "INT", {"offset": -1}],
                    "Corrente Fase C": [13403, "INT", {"offset": -1}]
                },
                "temperaturas": {
                    'Enrolamento Fase A value': [13469, "REAL", {"offset": -1}],
                    'Enrolamento Fase A alarmes': [13989, "REAL", {"offset": -1}],
                    'Enrolamento Fase A trip': [13925, "REAL", {"offset": -1}],
                    'Enrolamento Fase B value': [13471, "REAL", {"offset": -1}],
                    'Enrolamento Fase B alarmes': [13991, "REAL", {"offset": -1}],
                    'Enrolamento Fase B trip': [13927, "REAL", {"offset": -1}],
                    'Enrolamento Fase C value': [13473, "REAL", {"offset": -1}],
                    'Enrolamento Fase C alarmes': [13993, "REAL", {"offset": -1}],
                    'Enrolamento Fase C trip': [13929, "REAL", {"offset": -1}],
                    'Tiristor 1 value': [13455, "REAL", {"offset": -1}],
                    'Tiristor 1 alarmes': [13975, "REAL", {"offset": -1}],
                    'Tiristor 1 trip': [13911, "REAL", {"offset": -1}],
                    'Tiristor 2 value': [13457, "REAL", {"offset": -1}],
                    'Tiristor 2 alarmes': [13977, "REAL", {"offset": -1}],
                    'Tiristor 2 trip': [13913, "REAL", {"offset": -1}],
                    'Tiristor 3 value': [13459, "REAL", {"offset": -1}],
                    'Tiristor 3 alarmes': [13979, "REAL", {"offset": -1}],
                    'Tiristor 3 trip': [13915, "REAL", {"offset": -1}],
                    'Resistor Crowbar 1 value': [13461, "REAL", {"offset": -1}],
                    'Resistor Crowbar 1 alarmes': [13983, "REAL", {"offset": -1}],
                    'Resistor Crowbar 1 trip': [13919, "REAL", {"offset": -1}],
                    'Resistor Crowbar 2 value': [13491, "REAL", {"offset": -1}],
                    'Resistor Crowbar 2 alarmes': [13411, "REAL", {"offset": -1}],
                    'Resistor Crowbar 2 trip': [13497, "REAL", {"offset": -1}],
                    'Transf. Exitação value': [13463, "REAL", {"offset": -1}],
                    'Transf. Exitação alarmes': [13983, "REAL", {"offset": -1}],
                    'Transf. Exitação trip': [13919, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. value': [13465, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. alarmes': [13985, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. trip': [13921, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. value': [13467, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. alarmes': [13987, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. trip': [13923, "REAL", {"offset": -1}],
                    'Nucleo Estator 1 value': [13475, "REAL", {"offset": -1}],
                    'Nucleo Estator 1 alarmes': [13995, "REAL", {"offset": -1}],
                    'Nucleo Estator 1 trip': [13931, "REAL", {"offset": -1}],
                    'Nucleo Estator 2 value': [13477, "REAL", {"offset": -1}],
                    'Nucleo Estator 2 alarmes': [13997, "REAL", {"offset": -1}],
                    'Nucleo Estator 2 trip': [13933, "REAL", {"offset": -1}],
                    'Nucleo Estator 3 value': [13479, "REAL", {"offset": -1}],
                    'Nucleo Estator 3 alarmes': [13999, "REAL", {"offset": -1}],
                    'Nucleo Estator 3 trip': [13935, "REAL", {"offset": -1}],
                    'Manc. Casq. Rad. Guia value': [13481, "REAL", {"offset": -1}],
                    'Manc. Casq. Rad. Guia alarmes': [14001, "REAL", {"offset": -1}],
                    'Manc. Casq. Rad. Guia trip': [13937, "REAL", {"offset": -1}],
                    'Mancal Comb. Casq value': [13483, "REAL", {"offset": -1}],
                    'Mancal Comb. Casq alarmes': [14003, "REAL", {"offset": -1}],
                    'Mancal Comb. Casq trip': [13939, "REAL", {"offset": -1}],
                    'Mancal Comb. Esc. value': [13485, "REAL", {"offset": -1}],
                    'Mancal Comb. Esc. alarmes': [14005, "REAL", {"offset": -1}],
                    'Mancal Comb. Esc. trip': [13941, "REAL", {"offset": -1}],
                    'Mancal Comb. Contra Esc. value': [13487, "REAL", {"offset": -1}],
                    'Mancal Comb. Contra Esc. alarmes': [14007, "REAL", {"offset": -1}],
                    'Mancal Comb. Contra Esc. trip': [13943, "REAL", {"offset": -1}],
                    'Mancal Guia Casq. Turb. value': [13489, "REAL", {"offset": -1}],
                    'Mancal Guia Casq. Turb. alarmes': [14009, "REAL", {"offset": -1}],
                    'Mancal Guia Casq. Turb. trip': [13945, "REAL", {"offset": -1}]
                },
                "monitoramento": {
                    "Queda de energia da Celesc": [16291, "BOOLEAN", {"offset": -1}]
                }
            }
        }
    },
    "CGH-FAE": {
        "ip": "100.106.33.66",
        "port": 8010,
        "table": "cgh_fae",
        "CLPS": {
            "PSA":{
                "conexao":{
                    "ip": "192.168.10.4",
                    "port": 502
                },
                "caracteristicas":{
                    "Nível de vertimento": 701.15,
                    "Nível da Vazão sanitária": 701.06
                },
                'nivel_agua': {
                    "Nível Montante": [13353, "REAL", {"offset": -1}],
                    "Nível Jusante UG-01": [13379, "REAL", {"offset": -1}],
                    "Nível Jusante UG-02": [13381, "REAL", {"offset": -1}]
                }
            },
            "UG-01": {
                'conexao': {
                    'ip': '192.168.10.2',
                    'port': 502
                }, 
                'caracteristicas': {
                    'potência máxima': 1350,
                    'velocidade máxima': 415
                },
                'potencias': {
                    "Potência Ativa": [13407, "REAL", {"offset": -1}]
                },
                // 'nivel_agua': {
                //     "Nível Montante": [13519, "REAL", {"offset": -1}],
                //     "Nível Jusante": [13521, "REAL", {"offset": -1}]
                // },
                'gerador': {
                    "Tensão Fase A": [13385, "REAL", {"offset": -1}],
                    "Tensão Fase B": [13387, "REAL", {"offset": -1}],
                    "Tensão Fase C": [13389, "REAL", {"offset": -1}],
                    "Corrente Fase A": [13399, "REAL", {"offset": -1}],
                    "Corrente Fase B": [13401, "REAL", {"offset": -1}],
                    "Corrente Fase C": [13403, "REAL", {"offset": -1}]
                },
                "temperaturas": {
                    'Enrolamento Fase A value': [13455, "REAL", {"offset": -1}],
                    'Enrolamento Fase A alarmes': [13975, "REAL", {"offset": -1}],
                    'Enrolamento Fase A trip': [13911, "REAL", {"offset": -1}],
                    'Enrolamento Fase B value': [13457, "REAL", {"offset": -1}],
                    'Enrolamento Fase B alarmes': [13977, "REAL", {"offset": -1}],
                    'Enrolamento Fase B trip': [13913, "REAL", {"offset": -1}],
                    'Enrolamento Fase C value': [13459, "REAL", {"offset": -1}],
                    'Enrolamento Fase C alarmes': [13979, "REAL", {"offset": -1}],
                    'Enrolamento Fase C trip': [13915, "REAL", {"offset": -1}],
                    'Nucleo do estator value': [13461, "REAL", {"offset": -1}],
                    'Nucleo do estator alarmes': [13981, "REAL", {"offset": -1}],
                    'Nucleo do estator trip': [13917, "REAL", {"offset": -1}],
                    'Mancal Guia value': [13463, "REAL", {"offset": -1}],
                    'Mancal Guia alarmes': [13983, "REAL", {"offset": -1}],
                    'Mancal Guia trip': [13919, "REAL", {"offset": -1}],
                    'Mancal Combinado value': [13465, "REAL", {"offset": -1}],
                    'Mancal Combinado alarmes': [13985, "REAL", {"offset": -1}],
                    'Mancal Combinado trip': [13921, "REAL", {"offset": -1}],
                    'Mancal Escora value': [13467, "REAL", {"offset": -1}],
                    'Mancal Escora alarmes': [13987, "REAL", {"offset": -1}],
                    'Mancal Escora trip': [13923, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. value': [13469, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. alarmes': [13989, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. trip': [13925, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. value': [13471, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. alarmes': [13991, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. trip': [13927, "REAL", {"offset": -1}]
                },
                "monitoramento": {
                    "Queda de energia da Celesc": [16291, "BOOLEAN", {"offset": -1}]
                }
            },
            "UG-02": {
                'conexao': {
                    'ip': '192.168.10.3',
                    'port': 502
                },
                'caracteristicas': {
                    'potência máxima': 650,
                    'velocidade máxima': 800
                },
                'potencias': {
                    "Potência Ativa": [13407, "REAL", {"offset": -1}]
                },
                // 'nivel_agua': {
                //     "Nível Montante UG-02": [13519, "REAL", {"offset": -1}],
                //     "Nível Jusante UG-02": [13521, "REAL", {"offset": -1}]
                // },
                'gerador': {
                    "Tensão Fase A": [13385, "REAL", {"offset": -1}],
                    "Tensão Fase B": [13387, "REAL", {"offset": -1}],
                    "Tensão Fase C": [13389, "REAL", {"offset": -1}],
                    "Corrente Fase A": [13399, "REAL", {"offset": -1}],
                    "Corrente Fase B": [13401, "REAL", {"offset": -1}],
                    "Corrente Fase C": [13403, "REAL", {"offset": -1}]
                },
                "temperaturas": {
                    'Enrolamento Fase A value': [13455, "REAL", {"offset": -1}],
                    'Enrolamento Fase A alarmes': [13975, "REAL", {"offset": -1}],
                    'Enrolamento Fase A trip': [13911, "REAL", {"offset": -1}],
                    'Enrolamento Fase B value': [13457, "REAL", {"offset": -1}],
                    'Enrolamento Fase B alarmes': [13977, "REAL", {"offset": -1}],
                    'Enrolamento Fase B trip': [13913, "REAL", {"offset": -1}],
                    'Enrolamento Fase C value': [13459, "REAL", {"offset": -1}],
                    'Enrolamento Fase C alarmes': [13979, "REAL", {"offset": -1}],
                    'Enrolamento Fase C trip': [13915, "REAL", {"offset": -1}],
                    'Nucleo do estator value': [13461, "REAL", {"offset": -1}],
                    'Nucleo do estator alarmes': [13981, "REAL", {"offset": -1}],
                    'Nucleo do estator trip': [13917, "REAL", {"offset": -1}],
                    'Mancal Guia value': [13463, "REAL", {"offset": -1}],
                    'Mancal Guia alarmes': [13983, "REAL", {"offset": -1}],
                    'Mancal Guia trip': [13919, "REAL", {"offset": -1}],
                    'Mancal Combinado value': [13465, "REAL", {"offset": -1}],
                    'Mancal Combinado alarmes': [13985, "REAL", {"offset": -1}],
                    'Mancal Combinado trip': [13921, "REAL", {"offset": -1}],
                    'Mancal Escora value': [13467, "REAL", {"offset": -1}],
                    'Mancal Escora alarmes': [13987, "REAL", {"offset": -1}],
                    'Mancal Escora trip': [13923, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. value': [13469, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. alarmes': [13989, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. trip': [13925, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. value': [13471, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. alarmes': [13991, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. trip': [13927, "REAL", {"offset": -1}],
                    'ENGEXC value': [13475, "REAL", {"offset": -1}],
                    'ENGEXC alarmes': [13997, "REAL", {"offset": -1}],
                    'ENGEXC trip': [13933, "REAL", {"offset": -1}],
                    'CSS-U1 value': [13475, "REAL", {"offset": -1}],
                    'CSS-U1 alarmes': [13995, "REAL", {"offset": -1}],
                    'CSS-U1 trip': [13931, "REAL", {"offset": -1}]
                }
            }
        }
    },
    "PCH-PEDRAS": {
        "ip": "100.93.237.40",
        "port": 8010,
        "table": "cgh_das_pedras",
        "CLPS": {
            "UG-01": {
                'conexao': {
                    'ip': '192.168.10.2',
                    'port': 502
                }, 
                'caracteristicas': {
                    'potência máxima': 2800,
                    'velocidade máxima': 450
                },
                'potencias': {
                    "Potência Ativa": [13407, "REAL", {"offset": -1}]
                },
                'nivel_agua': {
                    "Nível Montante UG-01": [13519, "REAL", {"offset": -1}],
                    "Nível Jusante UG-01": [13521, "REAL", {"offset": -1}]
                },
                'gerador': {
                    "Tensão Fase A": [13385, "REAL", {"offset": -1}],
                    "Tensão Fase B": [13387, "REAL", {"offset": -1}],
                    "Tensão Fase C": [13389, "REAL", {"offset": -1}],
                    "Corrente Fase A": [13399, "REAL", {"offset": -1}],
                    "Corrente Fase B": [13401, "REAL", {"offset": -1}],
                    "Corrente Fase C": [13403, "REAL", {"offset": -1}]
                },
                "temperaturas": {
                    'Enrolamento Fase A value': [13459, "REAL", {"offset": -1}],
                    'Enrolamento Fase A alarmes': [13979, "REAL", {"offset": -1}],
                    'Enrolamento Fase A trip': [13915, "REAL", {"offset": -1}],
                    'Enrolamento Fase B value': [13461, "REAL", {"offset": -1}],
                    'Enrolamento Fase B alarmes': [13981, "REAL", {"offset": -1}],
                    'Enrolamento Fase B trip': [13917, "REAL", {"offset": -1}],
                    'Enrolamento Fase C value': [13463, "REAL", {"offset": -1}],
                    'Enrolamento Fase C alarmes': [13983, "REAL", {"offset": -1}],
                    'Enrolamento Fase C trip': [13919, "REAL", {"offset": -1}],
                    'G Mancal L.A. Guia value': [13465, "REAL", {"offset": -1}],
                    'G Mancal L.A. Guia alarmes': [13985, "REAL", {"offset": -1}],
                    'G Mancal L.A. Guia trip': [13921, "REAL", {"offset": -1}],
                    'G Mancal L.N.A. Guia value': [13469, "REAL", {"offset": -1}],
                    'G Mancal L.N.A. Guia alarmes': [13989, "REAL", {"offset": -1}],
                    'G Mancal L.N.A. Guia trip': [13925, "REAL", {"offset": -1}],
                    'G Mancal L.N.A. Escora value': [13467, "REAL", {"offset": -1}],
                    'G Mancal L.N.A. Escora alarmes': [13987, "REAL", {"offset": -1}],
                    'G Mancal L.N.A. Escora trip': [13923, "REAL", {"offset": -1}],
                    'T Bucha Radial 01 value': [13457, "REAL", {"offset": -1}],
                    'T Bucha Radial 01 alarmes': [13977, "REAL", {"offset": -1}],
                    'T Bucha Radial 01 trip': [13913, "REAL", {"offset": -1}],
                    'T Bucha Radial 02 value': [13475, "REAL", {"offset": -1}],
                    'T Bucha Radial 02 alarmes': [13995, "REAL", {"offset": -1}],
                    'T Bucha Radial 02 trip': [13931, "REAL", {"offset": -1}],
                    'T Gaxeteiro 01 value': [13455, "REAL", {"offset": -1}],
                    'T Gaxeteiro 01 alarmes': [13975, "REAL", {"offset": -1}],
                    'T Gaxeteiro 01 trip': [13911, "REAL", {"offset": -1}],
                    'T Gaxeteiro 02 value': [13473, "REAL", {"offset": -1}],
                    'T Gaxeteiro 02 alarmes': [13993, "REAL", {"offset": -1}],
                    'T Gaxeteiro 02 trip': [13929, "REAL", {"offset": -1}],
                    'T Gaxeteiro 03 value': [13471, "REAL", {"offset": -1}],
                    'T Gaxeteiro 03 alarmes': [13991, "REAL", {"offset": -1}],
                    'T Gaxeteiro 03 trip': [13927, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. value': [13481, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. alarmes': [14001, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. trip': [13937, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. value': [13479, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. alarmes': [13999, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. trip': [13935, "REAL", {"offset": -1}]
                },
                "monitoramento": {
                    "Queda de energia da Celesc": [20309, "BOOLEAN", {"offset": -1}]
                }
            },
            "UG-02": {
                'conexao': {'ip': '192.168.10.3', 'port': 502}, 
                'caracteristicas': {
                    'potência máxima': 2800,
                    'velocidade máxima': 450
                },
                'potencias': {
                    "Potência Ativa": [13407, "REAL", {"offset": -1}]
                },
                'nivel_agua': {
                    "Nível Montante UG-02": [13519, "REAL", {"offset": -1}],
                    "Nível Jusante UG-02": [13521, "REAL", {"offset": -1}]
                },
                'gerador': {
                    "Tensão Fase A": [13385, "REAL", {"offset": -1}],
                    "Tensão Fase B": [13387, "REAL", {"offset": -1}],
                    "Tensão Fase C": [13389, "REAL", {"offset": -1}],
                    "Corrente Fase A": [13399, "REAL", {"offset": -1}],
                    "Corrente Fase B": [13401, "REAL", {"offset": -1}],
                    "Corrente Fase C": [13403, "REAL", {"offset": -1}]
                },
                "temperaturas": {
                    'Enrolamento Fase A value': [13459, "REAL", {"offset": -1}],
                    'Enrolamento Fase A alarmes': [13979, "REAL", {"offset": -1}],
                    'Enrolamento Fase A trip': [13915, "REAL", {"offset": -1}],
                    'Enrolamento Fase B value': [13461, "REAL", {"offset": -1}],
                    'Enrolamento Fase B alarmes': [13981, "REAL", {"offset": -1}],
                    'Enrolamento Fase B trip': [13917, "REAL", {"offset": -1}],
                    'Enrolamento Fase C value': [13463, "REAL", {"offset": -1}],
                    'Enrolamento Fase C alarmes': [13983, "REAL", {"offset": -1}],
                    'Enrolamento Fase C trip': [13919, "REAL", {"offset": -1}],
                    'G Mancal L.A. Guia value': [13465, "REAL", {"offset": -1}],
                    'G Mancal L.A. Guia alarmes': [13985, "REAL", {"offset": -1}],
                    'G Mancal L.A. Guia trip': [13921, "REAL", {"offset": -1}],
                    'G Mancal L.N.A. Guia value': [13469, "REAL", {"offset": -1}],
                    'G Mancal L.N.A. Guia alarmes': [13989, "REAL", {"offset": -1}],
                    'G Mancal L.N.A. Guia trip': [13925, "REAL", {"offset": -1}],
                    'G Mancal L.N.A. Escora value': [13467, "REAL", {"offset": -1}],
                    'G Mancal L.N.A. Escora alarmes': [13987, "REAL", {"offset": -1}],
                    'G Mancal L.N.A. Escora trip': [13923, "REAL", {"offset": -1}],
                    'T Bucha Radial 01 value': [13457, "REAL", {"offset": -1}],
                    'T Bucha Radial 01 alarmes': [13977, "REAL", {"offset": -1}],
                    'T Bucha Radial 01 trip': [13913, "REAL", {"offset": -1}],
                    'T Bucha Radial 02 value': [13475, "REAL", {"offset": -1}],
                    'T Bucha Radial 02 alarmes': [13995, "REAL", {"offset": -1}],
                    'T Bucha Radial 02 trip': [13931, "REAL", {"offset": -1}],
                    'T Gaxeteiro 01 value': [13455, "REAL", {"offset": -1}],
                    'T Gaxeteiro 01 alarmes': [13975, "REAL", {"offset": -1}],
                    'T Gaxeteiro 01 trip': [13911, "REAL", {"offset": -1}],
                    'T Gaxeteiro 02 value': [13473, "REAL", {"offset": -1}],
                    'T Gaxeteiro 02 alarmes': [13993, "REAL", {"offset": -1}],
                    'T Gaxeteiro 02 trip': [13929, "REAL", {"offset": -1}],
                    'T Gaxeteiro 03 value': [13471, "REAL", {"offset": -1}],
                    'T Gaxeteiro 03 alarmes': [13991, "REAL", {"offset": -1}],
                    'T Gaxeteiro 03 trip': [13927, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. value': [13481, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. alarmes': [14001, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. trip': [13937, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. value': [13479, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. alarmes': [13999, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. trip': [13935, "REAL", {"offset": -1}]
                }
            }
        }
    },
    "CGH-PICADAS-ALTAS": {
        "ip": "100.79.241.13",
        "port": 8010,
        "table": "cgh_picadas_altas",
        "CLPS": {
            "UG-01": {
                'conexao': {'ip': '192.168.10.2', 'port': 502}, 
                'caracteristicas': {
                    'potência máxima': 300,
                    'velocidade máxima': 450
                },
                'potencias': {
                    "Potência Ativa": [13407, "REAL", {"offset": -1}]
                },
                'nivel_agua': {
                    "Nível Montante UG-01": [13519, "REAL", {"offset": -1}],
                    "Nível Jusante UG-01": [13521, "REAL", {"offset": -1}]
                },
                'gerador': {
                    "Tensão Fase A": [13385, "REAL", {"offset": -1}],
                    "Tensão Fase B": [13387, "REAL", {"offset": -1}],
                    "Tensão Fase C": [13389, "REAL", {"offset": -1}],
                    "Corrente Fase A": [13399, "REAL", {"offset": -1}],
                    "Corrente Fase B": [13401, "REAL", {"offset": -1}],
                    "Corrente Fase C": [13403, "REAL", {"offset": -1}]
                },
                "temperaturas": {
                    'Enrolamento Fase A value': [13455, "REAL", {"offset": -1}],
                    'Enrolamento Fase A alarmes': [13975, "REAL", {"offset": -1}],
                    'Enrolamento Fase A trip': [13911, "REAL", {"offset": -1}],
                    'Enrolamento Fase B value': [13457, "REAL", {"offset": -1}],
                    'Enrolamento Fase B alarmes': [13977, "REAL", {"offset": -1}],
                    'Enrolamento Fase B trip': [13913, "REAL", {"offset": -1}],
                    'Enrolamento Fase C value': [13459, "REAL", {"offset": -1}],
                    'Enrolamento Fase C alarmes': [13979, "REAL", {"offset": -1}],
                    'Enrolamento Fase C trip': [13915, "REAL", {"offset": -1}],
                    'Nucleo do estator value': [13461, "REAL", {"offset": -1}],
                    'Nucleo do estator alarmes': [13981, "REAL", {"offset": -1}],
                    'Nucleo do estator trip': [13917, "REAL", {"offset": -1}],
                    'CS-U2 value': [13475, "REAL", {"offset": -1}],
                    'CS-U2 alarmes': [13995, "REAL", {"offset": -1}],
                    'CS-U2 trip': [13931, "REAL", {"offset": -1}],
                    'Manc. Comb. Rad. L.A. value': [13463, "REAL", {"offset": -1}],
                    'Manc. Comb. Rad. L.A. alarmes': [13983, "REAL", {"offset": -1}],
                    'Manc. Comb. Rad. L.A. trip': [13919, "REAL", {"offset": -1}],
                    'Manc. Comb. Esc. L.A. value': [13465, "REAL", {"offset": -1}],
                    'Manc. Comb. Esc. L.A. alarmes': [13985, "REAL", {"offset": -1}],
                    'Manc. Comb. Esc. L.A. trip': [13921, "REAL", {"offset": -1}],
                    'Manc. Cont. Esc. L.A. value': [13467, "REAL", {"offset": -1}],
                    'Manc. Cont. Esc. L.A. alarmes': [13987, "REAL", {"offset": -1}],
                    'Manc. Cont. Esc. L.A. trip': [13923, "REAL", {"offset": -1}],
                    'Mancal Guia L.N.A. value': [13469, "REAL", {"offset": -1}],
                    'Mancal Guia L.N.A. alarmes': [13989, "REAL", {"offset": -1}],
                    'Mancal Guia L.N.A. trip': [13925, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. value': [13473, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. alarmes': [13993, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. trip': [13929, "REAL", {"offset": -1}]
                },
                "monitoramento": {
                    "Queda de energia da Celesc": [20311, "BOOLEAN", {"offset": -1}]
                }
            },
            "UG-02": {
                'conexao': {'ip': '192.168.10.3', 'port': 502}, 
                'caracteristicas': {
                    'potência máxima': 700,
                    'velocidade máxima': 450
                },
                'potencias': {
                    "Potência Ativa": [13407, "REAL", {"offset": -1}]
                },
                'nivel_agua': {
                    "Nível Montante UG-02": [13519, "REAL", {"offset": -1}],
                    "Nível Jusante UG-02": [13521, "REAL", {"offset": -1}]
                },
                'gerador': {
                    "Tensão Fase A": [13385, "REAL", {"offset": -1}],
                    "Tensão Fase B": [13387, "REAL", {"offset": -1}],
                    "Tensão Fase C": [13389, "REAL", {"offset": -1}],
                    "Corrente Fase A": [13399, "REAL", {"offset": -1}],
                    "Corrente Fase B": [13401, "REAL", {"offset": -1}],
                    "Corrente Fase C": [13403, "REAL", {"offset": -1}]
                },
                "temperaturas": {
                    'Enrolamento Fase A value': [13455, "REAL", {"offset": -1}],
                    'Enrolamento Fase A alarmes': [13975, "REAL", {"offset": -1}],
                    'Enrolamento Fase A trip': [13911, "REAL", {"offset": -1}],
                    'Enrolamento Fase B value': [13457, "REAL", {"offset": -1}],
                    'Enrolamento Fase B alarmes': [13977, "REAL", {"offset": -1}],
                    'Enrolamento Fase B trip': [13913, "REAL", {"offset": -1}],
                    'Enrolamento Fase C value': [13459, "REAL", {"offset": -1}],
                    'Enrolamento Fase C alarmes': [13979, "REAL", {"offset": -1}],
                    'Enrolamento Fase C trip': [13915, "REAL", {"offset": -1}],
                    'Nucleo do estator value': [13461, "REAL", {"offset": -1}],
                    'Nucleo do estator alarmes': [13981, "REAL", {"offset": -1}],
                    'Nucleo do estator trip': [13917, "REAL", {"offset": -1}],
                    'CS-U2 value': [13475, "REAL", {"offset": -1}],
                    'CS-U2 alarmes': [13995, "REAL", {"offset": -1}],
                    'CS-U2 trip': [13931, "REAL", {"offset": -1}],
                    'Manc. Comb. Rad. L.A. value': [13463, "REAL", {"offset": -1}],
                    'Manc. Comb. Rad. L.A. alarmes': [13983, "REAL", {"offset": -1}],
                    'Manc. Comb. Rad. L.A. trip': [13919, "REAL", {"offset": -1}],
                    'Manc. Comb. Esc. L.A. value': [13465, "REAL", {"offset": -1}],
                    'Manc. Comb. Esc. L.A. alarmes': [13985, "REAL", {"offset": -1}],
                    'Manc. Comb. Esc. L.A. trip': [13921, "REAL", {"offset": -1}],
                    'Manc. Cont. Esc. L.A. value': [13467, "REAL", {"offset": -1}],
                    'Manc. Cont. Esc. L.A. alarmes': [13987, "REAL", {"offset": -1}],
                    'Manc. Cont. Esc. L.A. trip': [13923, "REAL", {"offset": -1}],
                    'Mancal Guia L.N.A. value': [13469, "REAL", {"offset": -1}],
                    'Mancal Guia L.N.A. alarmes': [13989, "REAL", {"offset": -1}],
                    'Mancal Guia L.N.A. trip': [13925, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. value': [13473, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. alarmes': [13993, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. trip': [13929, "REAL", {"offset": -1}]
                }
            }
        }
    },
    "CGH-HOPPEN": {
        "ip": "100.73.37.105",
        "port": 8010,
        "table": "cgh_hoppen",
        "CLPS": {
            "UG-01": {
                'conexao': {'ip': '192.168.10.2', 'port': 502}, 
                'caracteristicas': {
                    'potência máxima': 1300,
                    'velocidade máxima': 415
                },
                'potencias': {
                    "Potência Ativa": [13407, "REAL", {"offset": -1}]
                },
                'nivel_agua': {
                    "Nível Montante UG-01": [13519, "REAL", {"offset": -1}],
                    "Nível Jusante UG-01": [13521, "REAL", {"offset": -1}]
                },
                'gerador': {
                    "Tensão Fase A": [13385, "REAL", {"offset": -1}],
                    "Tensão Fase B": [13387, "REAL", {"offset": -1}],
                    "Tensão Fase C": [13389, "REAL", {"offset": -1}],
                    "Corrente Fase A": [13399, "REAL", {"offset": -1}],
                    "Corrente Fase B": [13401, "REAL", {"offset": -1}],
                    "Corrente Fase C": [13403, "REAL", {"offset": -1}]
                },
                "temperaturas": {
                    'Enrolamento Fase A value': [13455, "REAL", {"offset": -1}],
                    'Enrolamento Fase A alarmes': [13975, "REAL", {"offset": -1}],
                    'Enrolamento Fase A trip': [13911, "REAL", {"offset": -1}],
                    'Enrolamento Fase B value': [13457, "REAL", {"offset": -1}],
                    'Enrolamento Fase B alarmes': [13977, "REAL", {"offset": -1}],
                    'Enrolamento Fase B trip': [13913, "REAL", {"offset": -1}],
                    'Enrolamento Fase C value': [13459, "REAL", {"offset": -1}],
                    'Enrolamento Fase C alarmes': [13979, "REAL", {"offset": -1}],
                    'Enrolamento Fase C trip': [13915, "REAL", {"offset": -1}],
                    'Nucleo do estator value': [13461, "REAL", {"offset": -1}],
                    'Nucleo do estator alarmes': [13981, "REAL", {"offset": -1}],
                    'Nucleo do estator trip': [13917, "REAL", {"offset": -1}],
                    'Vedação do eixo LNA value': [13463, "REAL", {"offset": -1}],
                    'Vedação do eixo LNA alarmes': [13983, "REAL", {"offset": -1}],
                    'Vedação do eixo LNA trip': [13919, "REAL", {"offset": -1}],
                    'Vedação do eixo LA value': [13465, "REAL", {"offset": -1}],
                    'Vedação do eixo LA alarmes': [13985, "REAL", {"offset": -1}],
                    'Vedação do eixo LA trip': [13921, "REAL", {"offset": -1}],
                    'Mancal Escora Combinado value': [13467, "REAL", {"offset": -1}],
                    'Mancal Escora Combinado alarmes': [13987, "REAL", {"offset": -1}],
                    'Mancal Escora Combinado trip': [13923, "REAL", {"offset": -1}],
                    'Mancal Radial Combinado value': [13469, "REAL", {"offset": -1}],
                    'Mancal Radial Combinado alarmes': [13989, "REAL", {"offset": -1}],
                    'Mancal Radial Combinado trip': [13925, "REAL", {"offset": -1}],
                    'Cont. Esc. Manc. Comb. value': [13471, "REAL", {"offset": -1}],
                    'Cont. Esc. Manc. Comb. alarmes': [13991, "REAL", {"offset": -1}],
                    'Cont. Esc. Manc. Comb. trip': [13927, "REAL", {"offset": -1}],
                    'Mancal Radial Guia value': [13473, "REAL", {"offset": -1}],
                    'Mancal Radial Guia alarmes': [13993, "REAL", {"offset": -1}],
                    'Mancal Radial Guia trip': [13929, "REAL", {"offset": -1}],
                    'Mancal Rad. Comb. L.A. value': [13475, "REAL", {"offset": -1}],
                    'Mancal Rad. Comb. L.A. alarmes': [13995, "REAL", {"offset": -1}],
                    'Mancal Rad. Comb. L.A. trip': [13931, "REAL", {"offset": -1}],
                    'Mancal Rad. Comb. L.N.A. value': [13477, "REAL", {"offset": -1}],
                    'Mancal Rad. Comb. L.N.A. alarmes': [13997, "REAL", {"offset": -1}],
                    'Mancal Rad. Comb. L.N.A. trip': [13933, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. value': [13479, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. alarmes': [13999, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. trip': [13935, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. value': [13481, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. alarmes': [14001, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. trip': [13937, "REAL", {"offset": -1}],
                    'CS-01 value': [13483, "REAL", {"offset": -1}],
                    'CS-01 alarmes': [14003, "REAL", {"offset": -1}],
                    'CS-01 trip': [13939, "REAL", {"offset": -1}]
                },
                "monitoramento": {
                    "Queda de energia da Celesc": [20311, "BOOLEAN", {"offset": -1}]
                }
            },
            "UG-02": {
                'conexao': {'ip': '192.168.10.3', 'port': 502}, 
                'caracteristicas': {
                    'potência máxima': 1300,
                    'velocidade máxima': 415
                },
                'potencias': {
                    "Potência Ativa": [13407, "REAL", {"offset": -1}]
                },
                'nivel_agua': {
                    "Nível Montante UG-02": [13519, "REAL", {"offset": -1}],
                    "Nível Jusante UG-02": [13521, "REAL", {"offset": -1}]
                },
                'gerador': {
                    "Tensão Fase A": [13385, "REAL", {"offset": -1}],
                    "Tensão Fase B": [13387, "REAL", {"offset": -1}],
                    "Tensão Fase C": [13389, "REAL", {"offset": -1}]
                },
                "temperaturas": {
                    'Enrolamento Fase A value': [13455, "REAL", {"offset": -1}],
                    'Enrolamento Fase A alarmes': [13975, "REAL", {"offset": -1}],
                    'Enrolamento Fase A trip': [13911, "REAL", {"offset": -1}],
                    'Enrolamento Fase B value': [13457, "REAL", {"offset": -1}],
                    'Enrolamento Fase B alarmes': [13977, "REAL", {"offset": -1}],
                    'Enrolamento Fase B trip': [13913, "REAL", {"offset": -1}],
                    'Enrolamento Fase C value': [13459, "REAL", {"offset": -1}],
                    'Enrolamento Fase C alarmes': [13979, "REAL", {"offset": -1}],
                    'Enrolamento Fase C trip': [13915, "REAL", {"offset": -1}],
                    'Nucleo do estator value': [13461, "REAL", {"offset": -1}],
                    'Nucleo do estator alarmes': [13981, "REAL", {"offset": -1}],
                    'Nucleo do estator trip': [13917, "REAL", {"offset": -1}],
                    'Vedação do eixo LNA value': [13463, "REAL", {"offset": -1}],
                    'Vedação do eixo LNA alarmes': [13983, "REAL", {"offset": -1}],
                    'Vedação do eixo LNA trip': [13919, "REAL", {"offset": -1}],
                    'Vedação do eixo LA value': [13465, "REAL", {"offset": -1}],
                    'Vedação do eixo LA alarmes': [13985, "REAL", {"offset": -1}],
                    'Vedação do eixo LA trip': [13921, "REAL", {"offset": -1}],
                    'Mancal Escora Combinado value': [13467, "REAL", {"offset": -1}],
                    'Mancal Escora Combinado alarmes': [13987, "REAL", {"offset": -1}],
                    'Mancal Escora Combinado trip': [13923, "REAL", {"offset": -1}],
                    'Mancal Radial Combinado value': [13469, "REAL", {"offset": -1}],
                    'Mancal Radial Combinado alarmes': [13989, "REAL", {"offset": -1}],
                    'Mancal Radial Combinado trip': [13925, "REAL", {"offset": -1}],
                    'Cont. Esc. Manc. Comb. value': [13471, "REAL", {"offset": -1}],
                    'Cont. Esc. Manc. Comb. alarmes': [13991, "REAL", {"offset": -1}],
                    'Cont. Esc. Manc. Comb. trip': [13927, "REAL", {"offset": -1}],
                    'Mancal Radial Guia value': [13473, "REAL", {"offset": -1}],
                    'Mancal Radial Guia alarmes': [13993, "REAL", {"offset": -1}],
                    'Mancal Radial Guia trip': [13929, "REAL", {"offset": -1}],
                    'Mancal Rad. Comb. L.A. value': [13475, "REAL", {"offset": -1}],
                    'Mancal Rad. Comb. L.A. alarmes': [13995, "REAL", {"offset": -1}],
                    'Mancal Rad. Comb. L.A. trip': [13931, "REAL", {"offset": -1}],
                    'Mancal Rad. Comb. L.N.A. value': [13477, "REAL", {"offset": -1}],
                    'Mancal Rad. Comb. L.N.A. alarmes': [13997, "REAL", {"offset": -1}],
                    'Mancal Rad. Comb. L.N.A. trip': [13933, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. value': [13479, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. alarmes': [13999, "REAL", {"offset": -1}],
                    'Óleo U.H.R.V. trip': [13935, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. value': [13481, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. alarmes': [14001, "REAL", {"offset": -1}],
                    'Óleo U.H.L.M. trip': [13937, "REAL", {"offset": -1}],
                    'CS-01 value': [13483, "REAL", {"offset": -1}],
                    'CS-01 alarmes': [14003, "REAL", {"offset": -1}],
                    'CS-01 trip': [13939, "REAL", {"offset": -1}]
                }
            }
        }
    },
    "PCH-PIRA": {
        "ip": "100.93.197.110",
        "port": 8010,
        "table": "pch_pira",
        "CLPS": {
            "UG-01": {
                'conexao': { 'ip': '10.200.20.11', 'port': 502 },
                'caracteristicas': { 'potência máxima': 7500, 'velocidade máxima': 450 },
                'potencias': {
                    "Potência Ativa": [2588, "INPUT_REAL",{"offset": 0, "converter": "word_order"}],
                    // "Potência Reativa": [2590, "INPUT_REAL"],
                    // "Fator de Potência": [2594, "INPUT_REAL"]
                },
                // 'gerador': {
                //     "Tensão Nominal": [2574, "INPUT_REAL"],
                //     "Tensão Fase A": [2612, "INPUT_REAL"],
                //     "Tensão Fase B": [2614, "INPUT_REAL"],
                //     "Tensão Fase C": [2616, "INPUT_REAL"],
                //     "Corrente Nominal": [2582, "INPUT_REAL"],
                //     "Frequencia": [2560, "INPUT_REAL"]
                // },
                'producao': {
                    "Energia Total": [2652, "INPUT_REAL",{"offset": 0, "converter": "word_order"}],
                    "Rotação da Turbina": [2628, "INPUT_REAL",{"offset": 0, "converter": "word_order"}]
                },
                'nivel_agua': {
                    "Nível Canal de Fuga": [19187, "INPUT_REAL",{"offset": 0, "converter": "word_order"}]
                }
            },
            "UG-02": {
                'conexao': { 'ip': '10.200.20.21', 'port': 502 },
                'caracteristicas': { 'potência máxima': 7500, 'velocidade máxima': 450 },
                'potencias': {
                    "Potência Ativa": [2588, "INPUT_REAL",{"offset": 0, "converter": "word_order"}],
                    // "Potência Reativa": [2590, "INPUT_REAL",{"offset": 0, "converter": "word_order"}],
                    // "Fator de Potência": [2594, "INPUT_REAL",{"offset": 0, "converter": "word_order"}]
                },
                // 'gerador': {
                //     "Tensão Nominal": [2574, "INPUT_REAL"],
                //     "Tensão Fase A": [2612, "INPUT_REAL"],
                //     "Tensão Fase B": [2614, "INPUT_REAL"],
                //     "Tensão Fase C": [2616, "INPUT_REAL"],
                //     "Corrente Nominal": [2582, "INPUT_REAL"],
                //     "Frequencia": [2560, "INPUT_REAL"]
                // },
                'producao': {
                    "Energia Total": [2652, "INPUT_REAL",{"offset": 0, "converter": "word_order"}],
                    "Rotação da Turbina": [2628, "INPUT_REAL",{"offset": 0, "converter": "word_order"}]
                },
                'nivel_agua': {
                    "Nível Canal de Fuga": [19187, "INPUT_REAL",{"offset": 0, "converter": "word_order"}]
                }
            },
            "UG-03": {
                'conexao': { 'ip': '10.200.20.31', 'port': 502 },
                'caracteristicas': { 'potência máxima': 7500, 'velocidade máxima': 450 },
                'potencias': {
                    "Potência Ativa": [2588, "INPUT_REAL",{"offset": 0, "converter": "word_order"}],
                    // "Potência Reativa": [2590, "INPUT_REAL"],
                    // "Fator de Potência": [2594, "INPUT_REAL"]
                },
                // 'gerador': {
                //     "Tensão Nominal": [2574, "INPUT_REAL"],
                //     "Tensão Fase A": [2612, "INPUT_REAL"],
                //     "Tensão Fase B": [2614, "INPUT_REAL"],
                //     "Tensão Fase C": [2616, "INPUT_REAL"],
                //     "Corrente Nominal": [2582, "INPUT_REAL"],
                //     "Frequencia": [2560, "INPUT_REAL"]
                // },
                'producao': {
                    "Energia Total": [2652, "INPUT_REAL",{"offset": 0, "converter": "word_order"}],
                    "Rotação da Turbina": [2628, "INPUT_REAL",{"offset": 0, "converter": "word_order"}]
                },
                'nivel_agua': {
                    "Nível Canal de Fuga": [19187, "INPUT_REAL",{"offset": 0, "converter": "word_order"}]
                }
            },
            "UG-04": {
                'conexao': { 'ip': '10.200.20.41', 'port': 502 },
                'caracteristicas': { 'potência máxima': 2500, 'velocidade máxima': 450 },
                'potencias': {
                    "Potência Ativa": [2588, "INPUT_REAL",{"offset": 0, "converter": "word_order"}],
                    // "Potência Reativa": [2590, "INPUT_REAL"],
                    // "Fator de Potência": [2594, "INPUT_REAL"]
                },
                // 'gerador': {
                //     "Tensão Nominal": [2574, "INPUT_REAL"],
                //     "Tensão Fase A": [2612, "INPUT_REAL"],
                //     "Tensão Fase B": [2614, "INPUT_REAL"],
                //     "Tensão Fase C": [2616, "INPUT_REAL"],
                //     "Corrente Nominal": [2582, "INPUT_REAL"],
                //     "Frequencia": [2560, "INPUT_REAL"]
                // },
                'producao': {
                    "Energia Total": [2652, "INPUT_REAL",{"offset": 0, "converter": "word_order"}],
                    "Rotação da Turbina": [2628, "INPUT_REAL",{"offset": 0, "converter": "word_order"}]
                },
                'nivel_agua': {
                    "Nível Canal de Fuga": [19187, "INPUT_REAL",{"offset": 0, "converter": "word_order"}]
                }
            }
        }
    }
};

module.exports = leituras;