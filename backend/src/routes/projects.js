import { Router } from 'express';
import controller from '../controllers/projectsController.js'
import { catchAsync } from '../middlewares/errors.js';
import jwtAuthentication from '../middlewares/auth.js'

export default () => {
    const api = Router();

    api.get('/:id', jwtAuthentication, catchAsync(controller.findOne));
    api.get('/', jwtAuthentication, catchAsync(controller.findAll));
    api.get('/execute/:id', jwtAuthentication, catchAsync(controller.execute));
    api.get('/waveforms/:id', jwtAuthentication, catchAsync(controller.wavefroms));
    api.post('/', jwtAuthentication, catchAsync(controller.create));
    api.put('/:id', jwtAuthentication, catchAsync(controller.update));
    api.delete('/:id', jwtAuthentication, catchAsync(controller.delete));

    return api;
}