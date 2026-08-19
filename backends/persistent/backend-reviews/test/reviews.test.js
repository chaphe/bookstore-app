jest.mock('../models/ModelReviews', () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
}));

const request = require('supertest');
const reviewsModel = require('../models/ModelReviews');
const app = require('../app');

describe('GET /reviews', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('retorna la lista de reviews con 200', async () => {
        reviewsModel.find.mockResolvedValue([{ usuario: 'mannulus', isbn: '111', estrellas: 5 }]);

        const res = await request(app).get('/reviews');

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].usuario).toBe('mannulus');
        expect(reviewsModel.find).toHaveBeenCalledWith({});
    });

    test('retorna 500 si la consulta falla', async () => {
        reviewsModel.find.mockRejectedValue(new Error('db down'));

        const res = await request(app).get('/reviews');

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('db down');
    });
});

describe('POST /addreviews', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('crea una review y retorna 201', async () => {
        reviewsModel.findOneAndUpdate.mockResolvedValue({
            lastErrorObject: { updatedExisting: false }
        });

        const res = await request(app).post('/addreviews').query({
            usuario: 'mannulus', isbn: '111', estrellas: '5', comentario: 'buen libro'
        });

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ code: 'OK' });
        expect(reviewsModel.findOneAndUpdate).toHaveBeenCalledWith(
            { usuario: 'mannulus', isbn: '111' },
            { $set: { usuario: 'mannulus', isbn: '111', estrellas: 5, comentario: 'buen libro' } },
            { upsert: true, new: true, includeResultMetadata: true }
        );
    });

    test('actualiza una review existente y retorna 200', async () => {
        reviewsModel.findOneAndUpdate.mockResolvedValue({
            lastErrorObject: { updatedExisting: true }
        });

        const res = await request(app).post('/addreviews').query({
            usuario: 'mannulus', isbn: '111', estrellas: '4', comentario: 'mejor que antes'
        });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ code: 'OK' });
    });

    test('retorna 400 si faltan parámetros', async () => {
        const res = await request(app).post('/addreviews').query({
            usuario: 'mannulus'
        });

        expect(res.status).toBe(400);
        expect(Array.isArray(res.body.error)).toBe(true);
        expect(reviewsModel.findOneAndUpdate).not.toHaveBeenCalled();
    });

    test('retorna 400 si estrellas está fuera del rango 1-5', async () => {
        const res = await request(app).post('/addreviews').query({
            usuario: 'mannulus', isbn: '111', estrellas: '9', comentario: 'buen libro'
        });

        expect(res.status).toBe(400);
        expect(res.body.error.join(' ')).toContain('estrellas');
    });

    test('retorna 500 si la base de datos falla', async () => {
        reviewsModel.findOneAndUpdate.mockRejectedValue(new Error('db down'));

        const res = await request(app).post('/addreviews').query({
            usuario: 'mannulus', isbn: '111', estrellas: '5', comentario: 'buen libro'
        });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('db down');
    });
});

describe('DELETE /deletereviews', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('elimina una review existente y retorna 200', async () => {
        reviewsModel.findOne.mockResolvedValue({ _id: 'abc123' });
        reviewsModel.deleteOne.mockResolvedValue({});

        const res = await request(app).delete('/deletereviews').query({
            usuario: 'mannulus', isbn: '111'
        });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ code: 'OK' });
        expect(reviewsModel.deleteOne).toHaveBeenCalledWith({ _id: 'abc123' });
    });

    test('retorna 404 si la review no existe', async () => {
        reviewsModel.findOne.mockResolvedValue(null);

        const res = await request(app).delete('/deletereviews').query({
            usuario: 'mannulus', isbn: '999'
        });

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('no existe en la base de datos');
    });

    test('retorna 400 si faltan parámetros', async () => {
        const res = await request(app).delete('/deletereviews').query({ usuario: 'mannulus' });

        expect(res.status).toBe(400);
        expect(reviewsModel.findOne).not.toHaveBeenCalled();
    });

    test('retorna 500 si la base de datos falla', async () => {
        reviewsModel.findOne.mockRejectedValue(new Error('db down'));

        const res = await request(app).delete('/deletereviews').query({
            usuario: 'mannulus', isbn: '111'
        });

        expect(res.status).toBe(500);
    });
});