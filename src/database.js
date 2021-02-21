const mysql = require('mysql')
const { database } = require('./keys')

const pool = mysql.createPool(database)

const { promisify } = require('util')

pool.getConnection((err, connection) => {
    if(err){
        if(err.code == 'PROTOCOL_CONNECTION_LOST'){
            console.log('La conexion a la db fue cerrada')
        }
        if(err.code == 'ER_CON_COUNT_ERROR'){
            console.log('Db has many connections')
        }
        if(err.code == 'ECONNREFUSED'){
            console.log('La db Rechazo')
        }
    }

    if(connection) connection.release()
    console.log('DB Connected')
    return
})

pool.query = promisify(pool.query)

module.exports = pool
