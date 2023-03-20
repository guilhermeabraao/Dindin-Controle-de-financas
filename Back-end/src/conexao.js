const knex = require('knex')({
    client: 'pg',
    connection: {
        user: 'seu-usuario',
        host: 'localhost ou host onde o DB está hospedado',
        database: 'dindin',
        password: 'senha do DB',
        port: 5432
    }
});

module.exports = knex;