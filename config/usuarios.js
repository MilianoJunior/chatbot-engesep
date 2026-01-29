// Configuração das usinas, grupos e usuários permitidos

module.exports = {
    gruposPermitidos: [
        {
            nome: 'CGH-APARECIDA',
            // ID DO GRUPO: 120363293776290750@g.us (CGH Aparecida O&M)
            grupos: ['120363293776290750@g.us'], 
            usuarios: ['all'],
            usinas: ['CGH-APARECIDA'] // Define explicitamente qual usina este grupo acessa
        },
        {
            nome: 'CGH-PICADAS-ALTAS',
            // ID DO GRUPO: 120363420417271434@g.us (CGH PICADAS ALTAS - O&M)
            grupos: ['120363420417271434@g.us'],
            usuarios: ['all'],
            usinas: ['CGH-PICADAS-ALTAS']
        },
        {
            nome: 'PCH-PEDRAS',
            // ID DO GRUPO: 120363421530083891@g.us (PCH PEDRAS - O&M)
            grupos: ['120363421530083891@g.us'],
            usuarios: ['all'],
            usinas: ['PCH-PEDRAS']
        },
        {
            nome: 'CGH-HOPPEN',
            // ID DO GRUPO: 120363401112465577@g.us (CGH Hoppen - O&M)
            grupos: ['120363401112465577@g.us'],
            usuarios: ['all'],
            usinas: ['CGH-HOPPEN']
        },
        {
            nome: 'CGH-FAE',
            // ID DO GRUPO: 120363403378026754@g.us (CGH FAE - O&M)
            grupos: ['120363403378026754@g.us'],
            usuarios: ['all'],
            usinas: ['CGH-FAE']
        },
        {
            nome: 'PCH-PIRA',
            // ID DO GRUPO: 120363421235105336@g.us (PCH PIRA - O&M)
            grupos: ['120363421235105336@g.us'],
            usuarios: ['all'],
            usinas: ['PCH-PIRA'] // Acessa apenas PIRA (futuro)
        },
        {
            // Grupo Interno/Admin: Pode acessar TODAS as usinas
            nome: 'EngeGOM O&M IA',
            grupos: ['120363400075500190@g.us', '120363402382699818@g.us'],
            usuarios: ['all'],
            // Lista mestre de permissão para o grupo interno
            usinas: ['CGH-APARECIDA', 'CGH-PICADAS-ALTAS', 'CGH-HOPPEN', 'CGH-FAE', 'PCH-PEDRAS', 'PCH-PIRA']
        }
    ],
    usuariosPermitidos: [
        // Usuários individuais (mantidos como backup ou acesso direto privado)
        { nome: 'Gelson', numero: '554991075958@c.us', usina: ['CGH-APARECIDA', 'CGH-PICADAS-ALTAS', 'CGH-HOPPEN', 'CGH-FAE','PCH-PEDRAS'] },
        { nome: 'Leandro', numero: '554984198921@c.us', usina: ['CGH-APARECIDA', 'CGH-PICADAS-ALTAS', 'CGH-HOPPEN', 'CGH-FAE','PCH-PEDRAS'] },
        { nome: 'Miliano', numero: '554998385500@c.us', usina: ['CGH-APARECIDA', 'CGH-PICADAS-ALTAS', 'CGH-HOPPEN', 'CGH-FAE','PCH-PEDRAS'] },
        { nome: 'Leonardo - O&M IA', numero: '554998059294@c.us', usina: ['CGH-APARECIDA', 'CGH-PICADAS-ALTAS', 'CGH-HOPPEN', 'CGH-FAE','PCH-PEDRAS'] },
        { nome: 'Jader', numero: '554999897471@c.us', usina: ['CGH-APARECIDA'] }
    ]
};

/*
REGISTRO DE IDs DE GRUPOS (Capturados via Debug):
--------------------------------
[GRUPO DETECTADO] Nome: "EngeGOM O&M IA" | ID DO GRUPO: 120363400075500190@g.us
--------------------------------
[GRUPO DETECTADO] Nome: "Teste IA Leonardo" | ID DO GRUPO: 120363402382699818@g.us
--------------------------------
[GRUPO DETECTADO] Nome: "CGH PICADAS ALTAS - O&M" | ID DO GRUPO: 120363420417271434@g.us
--------------------------------
[GRUPO DETECTADO] Nome: "CGH Hoppen - O&M" | ID DO GRUPO: 120363401112465577@g.us
--------------------------------
[GRUPO DETECTADO] Nome: "PCH PIRA - O&M" | ID DO GRUPO: 120363421235105336@g.us
--> ATENÇÃO: PCH PIRA NÃO ESTÁ CONFIGURADA NO ARRAY 'usinas' ACIMA. ADICIONAR SE NECESSÁRIO.
--------------------------------
[GRUPO DETECTADO] Nome: "CGH FAE - O&M" | ID DO GRUPO: 120363403378026754@g.us
--------------------------------
[GRUPO DETECTADO] Nome: "CGH Aparecida O&M" | ID DO GRUPO: 120363293776290750@g.us
--------------------------------
[GRUPO DETECTADO] Nome: "PCH PEDRAS - O&M" | ID DO GRUPO: 120363421530083891@g.us
--------------------------------
*/


