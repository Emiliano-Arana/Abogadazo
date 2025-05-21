const mysql = require('mysql2');
var con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'3927',
    database:'abogadazo'
}
);
con.connect(
    (err)=>{
        if(!err){
            console.log('Conexión establecida');
        }else{
            console.log('Error de Conexión');
            console.log(err)
        }
    }
);
module.exports = con;