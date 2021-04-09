const mysql      = require('mysql');
// const dbConnection =require('../../src/configs/db')

exports.getUser =async () => {
    //aqui metemos el id del usuario que queremos
   let usuarioBack=1;
  
    let sql =('SELECT nombre, apellidos, foto FROM profile  WHERE idUsuario ='+`${usuarioBack}`)
    
    const doQuery = (query) =>{
        return new Promise((resolve, reject) => {
            dbConnection.query(query, (error, results) => {
                if(error) return reject(error);
                console.log('Consulta correcta');
                return resolve(results);
            });
        });
    }
   
const results = await doQuery(sql);
const doStuffWithResults = (resultados) => {
console.log(resultados[0].nombre);

        // Aquí haces cosas con los resultados
    }
   

    // llamamos a nuestros métodos y le pasamos el resultado para realizar tareas
    doStuffWithResults(results);

};

exports.updateUser = () => {};

exports.deleteUser = () => {};
