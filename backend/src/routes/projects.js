import { Router } from 'express';
import controller from '../controllers/projectsController.js'
import { catchAsync } from '../middlewares/errors.js';

export default () => {
    const api = Router();

    api.get('/:id', catchAsync(controller.findOne));
    api.get('/', catchAsync(controller.findAll));
    api.get('/execute/:id', catchAsync(controller.execute));
    api.post('/', catchAsync(controller.create));
    api.put('/:id', catchAsync(controller.update));
    api.delete('/:id', catchAsync(controller.delete));

    return api;
}