var express = require('express');
const reviewsModel = require('../models/ModelReviews');
var router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Review:
 *      type: object
 *      properties:
 *        usuario:
 *          type: String
 *          description: Nombre de usuario
 *        isbn:
 *          type: String
 *          description: ISBN del libro
 *        estrellas:
 *          type: Number
 *          description: Numero de estrellas
 *        comentario:
 *          type: String
 *          description: Comentario realizado al libro
 *      required:
 *        - usuario
 *        - isbn
 *        - estrellas
 *        - comentario
 *      example:
 *        usuario: "mannulus"
 *        isbn: "9789584295446"
 *        estrellas: 2
 *        comentario: "no es muy bueno, muy aburrido, perfiero una pelicula"
 */

/**
 * @swagger
 * /reviews:
 *  get:
 *    summary: Returns the list of all reviews
 *    tags: [Review]
 *    responses:
 *      200:
 *        description: The list of all reviews
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Review'
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */

router.get('/reviews', async function (req, res, next) {
  console.log("-> request /reviews")
  var docs = await reviewsModel.find({})
  res.json(docs);
});



/**
 * @swagger
 * /addreviews:
 *  post:
 *    summary: Creates a review
 *    tags: [Review]
 *    parameters:
 *      - in: query
 *        name: usuario
 *        schema:
 *          type: string
 *          required: true
 *        description: Username of who submitted the review
 *      - in: query
 *        name: isbn
 *        schema:
 *          type: string
 *          required: true
 *        description: The book's ISBN
 *      - in: query
 *        name: estrellas
 *        schema:
 *          type: number
 *          required: true
 *        description: Star rating of the reviewed book
 *      - in: query
 *        name: comentario
 *        schema:
 *          type: string
 *          required: true
 *        description: The review's comment
 *    responses:
 *      201:
 *        description: Created review
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */

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


/**
 * @swagger
 * /deletereviews:
 *  delete:
 *    summary: Deletes a review
 *    tags: [Review]
 *    parameters:
 *      - in: query
 *        name: usuario
 *        schema:
 *          type: string
 *          required: true
 *        description: Username of who submitted the review
 *      - in: query
 *        name: isbn
 *        schema:
 *          type: string
 *          required: true
 *        description: The book's ISBN
 *    responses:
 *      200:
 *        description: Deleted review
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */

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