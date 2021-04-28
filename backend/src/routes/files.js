import { Router } from 'express';
import multer from 'multer';
import controller from '../controllers/filesController.js';
import { catchAsync } from '../middlewares/errors.js';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./users_projects/${req.body.projectId}`)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
  
var upload = multer({ storage: storage })

export default () => {
    const api = Router();

    api.get('/:id', catchAsync(controller.findOne));
    api.get('/', catchAsync(controller.findAll));
    api.get('/getContent/:id', catchAsync(controller.getContent));
    api.post('/', upload.array('files', 12), catchAsync(controller.create));
    api.put('/:id', catchAsync(controller.update));
    api.delete('/:id', catchAsync(controller.delete));

    return api;
}