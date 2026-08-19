var express = require('express');
const reviewsModel = require('../models/ModelReviews');
var router = express.Router();

const validateReview = ({ usuario, isbn, estrellas, comentario }) => {
    const errors = [];
    if (!usuario || typeof usuario !== 'string') errors.push('usuario es requerido');
    if (!isbn || typeof isbn !== 'string') errors.push('isbn es requerido');
    const stars = Number(estrellas);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) errors.push('estrellas debe ser un entero entre 1 y 5');
    if (!comentario || typeof comentario !== 'string') errors.push('comentario es requerido');
    return errors;
};

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
 *                $ref: '#/components/schemas/Review'
 *      500:
 *        description: Server Error
 */

router.get('/reviews', async function (req, res) {
  try {
    var docs = await reviewsModel.find({})
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
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
 *        description: Star rating of the reviewed book (1 to 5)
 *      - in: query
 *        name: comentario
 *        schema:
 *          type: string
 *          required: true
 *        description: The review's comment
 *    responses:
 *      201:
 *        description: Created review
 *      200:
 *        description: Updated review
 *      400:
 *        description: Bad Request - missing or invalid parameters
 *      500:
 *        description: Server Error
 */

router.post('/addreviews', async function (req, res) {
  const { usuario, isbn, estrellas, comentario } = req.query;
  const errors = validateReview({ usuario, isbn, estrellas, comentario });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors });
  }
  try {
    const result = await reviewsModel.findOneAndUpdate(
      { usuario, isbn },
      { $set: { usuario, isbn, estrellas: Number(estrellas), comentario } },
      { upsert: true, new: true, includeResultMetadata: true }
    );
    const updatedExisting = result.lastErrorObject ? result.lastErrorObject.updatedExisting : false;
    res.status(updatedExisting ? 200 : 201).json({ code: "OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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
 *      400:
 *        description: Bad Request - missing parameters
 *      404:
 *        description: Review not found
 *      500:
 *        description: Server Error
 */

router.delete('/deletereviews', async function (req, res) {
  const { usuario, isbn } = req.query;
  if (!usuario || !isbn) {
    return res.status(400).json({ error: "usuario e isbn son requeridos" });
  }
  try {
    var doc = await reviewsModel.findOne({ isbn, usuario });
    if (doc == null) {
      return res.status(404).json({ error: "no existe en la base de datos" });
    }
    await reviewsModel.deleteOne({ _id: doc._id });
    res.json({ code: "OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;