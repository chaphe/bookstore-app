const { query } = require('express');
var express = require('express');
var router = express.Router();

var reseñas = [
  {
    usuario: "mannulus",
    isbn: "000001222",
    estrellas: 0,
    comentario: "no es muy bueno, muy aburrido, perfiero una pelicula"
  },
  {
    usuario: "chaphe",
    isbn: "758001222",
    estrellas: 5,
    comentario: "sin palabras.... excelente obra, me encanta, la leo todo el tiempo"
  }
]
/* GET users listing. */
router.get('/reviews', function (req, res, next) {
  res.json(reseñas);
});

/* POST users listing. */
router.post('/addreviews', function (req, res, next) {
  var index = reseñas.findIndex(e => e.isbn == req.query.isbn && e.usuario == req.query.usuario);
  if (index == -1)
    reseñas.push(req.query);
  else
    reseñas[index] = req.query;
  res.json({ code: "OK" });
});

/* DELETE users listing. */
router.delete('/deletereviews', function (req, res, next) {
  reseñas = reseñas.filter((item) => !(item.isbn == req.query.isbn && item.usuario == req.query.usuario));
  res.json({ code: "OK" });
});



module.exports = router;
