var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var express = require('express');
var router = express.Router();
const sql = require('mssql');

const config = {
  user: '4DD_19',  //Vostro user name
  password: 'xxx123##', //Vostra password
  server: "213.140.22.237",  //Stringa di connessione
  database: '4DD_19', //(Nome del DB)
}

//Function to connect to database and execute query
let executeQuery = function (res, query, next, sendData) {
  sql.connect(config, function (err) {
    if (err) { //Display error page
      console.log("Error while connecting database :- " + err);
      res.status(500).json({success: false, message:'Error while connecting database', error:err});
      return;
    }
    var request = new sql.Request(); // create Request object
    request.query(query, function (err, result) { //Display error page
      if (err) {
        console.log("Error while querying database :- " + err);
        res.status(500).json({success: false, message:'Error while querying database', error:err});
        sql.close();
        return;
      }
      if(sendData) res.send(result.recordset); //Il vettore con i dati è nel campo recordset (puoi loggare result per verificare)
      sql.close();
    });

  });
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  let sqlQuery = "select * from dbo.[cr-unit-attributes]";
  executeQuery(res, sqlQuery, next, true);
});

router.get('/search/:name', function (req, res, next) {
  let sqlQuery = `select * from dbo.[cr-unit-attributes] where Unit = '${req.params.name}'`;
  executeQuery(res, sqlQuery, next, true);
});

router.post('/', function (req, res, next) {
  // Add a new Unit  
  let unit = req.body;
  if (!unit) {  //Qui dovremmo testare tutti i campi della richiesta
    res.status(500).json({success: false, message:'Error while connecting database', error:err});
    return;
  }
  let sqlInsert = `INSERT INTO dbo.[cr-unit-attributes] (Unit,Cost,Hit_Speed,Speed,Deploy_Time,Range,Target,Count,Transport,Type,Rarity) 
                     VALUES ('${unit.Unit}','${unit.Cost}','${unit.Hit_Speed}','${unit.Speed}','${unit.Deploy_Time}','${unit.Range}','${unit.Target}','${unit.Count}','${unit.Transport}','${unit.Type}','${unit.Rarity}')`;
  executeQuery(res, sqlInsert, next, false);
  
  let unita = [];
  unita.push(unit);
  res.render("unit",{unita : unita})
  //res.send({success:true, message: "unità inserita con successo", unit: unit})
});

module.exports = router;