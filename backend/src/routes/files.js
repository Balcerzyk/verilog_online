import { Router } from 'express';
import multer from 'multer';
import controller from '../controllers/filesController.js';
import { catchAsync } from '../middlewares/errors.js';
import jwtAuthentication from '../middlewares/auth.js'

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

    api.get('/:id', jwtAuthentication, catchAsync(controller.findOne));
    api.get('/', jwtAuthentication, catchAsync(controller.findAll));
    api.get('/getContent/:id', jwtAuthentication, catchAsync(controller.getContent));
    api.post('/', jwtAuthentication, upload.array('files', 12), catchAsync(controller.create));
    api.put('/:id', jwtAuthentication, catchAsync(controller.update));
    api.delete('/:id', jwtAuthentication, catchAsync(controller.delete));

    return api;
}