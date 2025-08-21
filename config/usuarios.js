// Configuração das usinas, grupos e usuários permitidos

module.exports = {
    usinas: [
        {
            nome: 'CGH-APARECIDA',
            grupos: ['CGH Aparecida O&M'],
            usuarios: ['all']
        },
        {
            nome: 'CGH-PICADAS-ALTAS',
            grupos: ['CGH PICADAS ALTAS - O&M'],
            usuarios: ['all']
        },
        {
            nome: 'PCH-PEDRAS',
            grupos: ['PCH PEDRAS - O&M'],
            usuarios: ['all']
        },
        {
            nome: 'CGH-HOPPEN',
            grupos: ['CGH HOPPEN - O&M'],
            usuarios: ['all']
        },
        {
            nome: 'CGH-FAE',
            grupos: ['CGH FAE - O&M'],
            usuarios: ['all']
        },
        {
            nome: 'EngeGOM O&M IA',
            grupos: ['EngeGOM O&M IA'],
            usuarios: ['all']
        }
    ],
    usuariosPermitidos: [
        { nome: 'Gelson', numero: '554991075958@c.us', usina: ['CGH-APARECIDA', 'CGH-PICADAS-ALTAS', 'CGH-HOPPEN', 'CGH-FAE','PCH-PEDRAS'] },
        { nome: 'Leandro', numero: '554984198921@c.us', usina: ['CGH-APARECIDA', 'CGH-PICADAS-ALTAS', 'CGH-HOPPEN', 'CGH-FAE','PCH-PEDRAS'] },
        { nome: 'Miliano', numero: '554998385500@c.us', usina: ['CGH-APARECIDA', 'CGH-PICADAS-ALTAS', 'CGH-HOPPEN', 'CGH-FAE','PCH-PEDRAS'] },
        { nome: 'Leonardo - O&M IA', numero: '554998059294@c.us', usina: ['CGH-APARECIDA', 'CGH-PICADAS-ALTAS', 'CGH-HOPPEN', 'CGH-FAE','PCH-PEDRAS'] },
        { nome: 'Leonardo - O&M IA', numero: '120363402382699818@g.us', usina: ['CGH-APARECIDA', 'CGH-PICADAS-ALTAS', 'CGH-HOPPEN', 'CGH-FAE','PCH-PEDRAS'] },
        { nome: 'Leonardo - O&M IA', numero: '120363400075500190@g.us', usina: ['CGH-APARECIDA', 'CGH-PICADAS-ALTAS', 'CGH-HOPPEN', 'CGH-FAE','PCH-PEDRAS'] },
        { nome: 'CGH FAE - O&M', numero: '120363403378026754@g.us', usina: ['CGH-FAE'] },
    ]
}; 