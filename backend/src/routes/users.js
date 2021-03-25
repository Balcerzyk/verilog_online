import { Router } from 'express';
import controller from '../controllers/usersController.js'
import { catchAsync} from '../middlewares/errors.js';

export default () => {
    const api = Router();

    api.get('/:slug', catchAsync(controller.findOne));
    api.get('/', catchAsync(controller.findAll));
    api.post('/', catchAsync(controller.create));
    api.put('/:slug', catchAsync(controller.update));
    api.delete('/:slug', catchAsync(controller.delete));

    return api;
}