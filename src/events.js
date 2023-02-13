const express = require('express');
const buffer = require("node:buffer");
const fs = require('fs');

function createRouter(db) 
{
  const router = express.Router();
  const owner = '';

  //GET categorie. ritorna tutte le categorie
  router.get('/categorie', function (req, res, next) 
  {
    db.query(
      'SELECT * FROM webco.categoria',
      (error, results) => {
        if (error) 
        {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else 
        {
          res.status(200).json(results);
        }
      }
    );
  });
  //ritorna il png del logo
  router.get('/logo', function (req, res, next) 
  {
    res.sendFile(__dirname + "/img/logo_finito.png");
  });
  //ritorna il png del background
  router.get('/background', function (req, res, next) 
  {
    res.sendFile(__dirname + "/img/background_finito.png");
  });
//GET nickname. ritorna tutti i nickname
  router.get('/nickname', function (req, res, next) 
  {
    db.query(
      'SELECT nickname FROM webco.membro',
      (error, results) => {
        if (error) 
        {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else 
        {
          res.status(200).json(results);
        }
      }
    );
  });
  //GET immagini. ritorna le immagini in base64. data:image/png
  router.get("/immagini",function (req, res, next)
  {
    db.query(
      "SELECT immagine, evento from webco.immagine",
      async (error, results)=>
      {
        if(error) 
        {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else 
        {
          let b64=[]; 
          let conta=0;

          results.forEach(raw_immagine => {
            
            b64[conta]= 
            {
              immagine:Buffer.from(raw_immagine.immagine).toString("base64"),
              evento:raw_immagine.evento
            }
            conta++
          });
          
          res.status(200).json(b64);
        }
      }
    )
  }


  )
  //GET eventi. ritorna tutti gli eventi
  router.get('/eventi', function (req, res, next) {
    db.query(
      'SELECT * FROM webco.evento',
      (error, results) => 
      {

        if (error) 
        {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else 
        {
          console.log(results)
          res.status(200).json(results);
        }
      }
    );
  });
//POST registrazione. Inserisce nel db il nuovo membro
  router.post('/registrazione', (req, res, next) => {
    db.query(
      'INSERT INTO membro VALUES (?,?,?,?,?)',
      [req.body.nickname, req.body.nome, req.body.cognome, req.body.email, req.body.password],
      (error) => 
      {
        if (error) 
        {
          console.error(error);
          res.status(500).json({status: 'error'});
        } 
        else 
        {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });
//POST accesso. prova l'accesso ad un account
  router.post('/accedi', (req, res, next) => {
    db.query(
      'select * from membro where password = ? and email = ?' ,
      [req.body.password,req.body.email],
      (error, results) => 
      {
        if (error) 
        {
          console.error(error);
          res.status(500).json({status: 'error'});
        } 
        else 
        {
          //se email e/o password sono sbagliate
          if(results == null)
          {
            // 204 - No content
            console.log("non esistente")
            console.log(results)
            res.status(204).json(results);
          }
          else //se l'account esiste
          {
            console.log("esistente")
            console.log(results)
            res.status(200).json(results);
          }
          
        }
      }
    );

  });

  
  return router;
}

module.exports = createRouter;