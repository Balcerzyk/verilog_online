import { Router } from 'express';
import controller from '../controllers/projectsController.js'
import { catchAsync } from '../middlewares/errors.js';

export default () => {
    const api = Router();

    api.get('/:id', catchAsync(controller.findOne));
    api.get('/', catchAsync(controller.findAll));
    api.post('/', catchAsync(controller.create));
    api.post('/execute/:id', catchAsync(controller.execute));
    api.put('/:id', catchAsync(controller.update));
    api.delete('/:id', catchAsync(controller.delete));

    return api;
}