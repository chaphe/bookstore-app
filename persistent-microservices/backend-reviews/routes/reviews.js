var express = require('express');
const reviewsModel = require('../models/ModelReviews');
var router = express.Router();

/* GET users listing. */
router.get('/reviews', async function (req, res, next) {
  console.log("-> request /reviews")
  var docs = await reviewsModel.find({})
  res.json(docs);
});

/* POST users listing. */
router.post('/addreviews', async function (req, res, next) {
  console.log("-> post reviews")
  var doc = await reviewsModel.findOne({ isbn: req.query.isbn, usuario: req.query.usuario });
  if (doc == null) {
    reviewsModel.insertMany(req.query).then((state) => {
      res.json({ code: "OK" });
    })
      .catch((err) => { console.error(err); res.json({ error: err }); });
  } else {
    reviewsModel.findByIdAndUpdate(doc._id, req.query).then((state) => {
      res.json({ code: "OK" });
    })
      .catch((err) => { console.error(err); res.json({ error: err }); });
  }
});

/* DELETE users listing. */
router.delete('/deletereviews', async function (req, res, next) {
  var doc = await reviewsModel.findOne({ isbn: req.query.isbn, usuario: req.query.usuario });
  if (doc == null) {
    res.json({ error: "no existe en la base de datos" });
  } else {
    reviewsModel.deleteOne({ _id: doc._id }).then((state) => {
      res.json({ code: "OK" });
    })
      .catch((err) => { console.error(err); res.json({ error: err }); });
  }
});



module.exports = router;
