import File from '../models/file.js';
import Project from '../models/project.js';

export default {
    async findOne(req, res, next) {
        const file = await File.findOne({_id: req.params.id});
        if(!file) return next();
        return res.status(200).send({data: file});
    },
    async findAll(req, res) {
        const files = await File.find().sort({ createdAt: 'desc' });
        return res.status(200).send({ data: files });
    },
    async create(req, res) {
        const project = await Project.findOne({_id: req.body.projectId});
        if(project) {
            project.files = [];
        }
        for(let i=0; i<req.files.length; i++) {
            const file = await new File({
                name: req.files[i].originalname,
                projectid: req.body.projectId,
                path: `./users_projects/${req.body.projectId}/${req.files[i].originalname}`
            }).save();
    
            project.files.push({name: file.name, fileid: file._id})
            console.log(`file '${file._id}' created.`);
        }
        project.save()
        return res.status(201).send({ message: `File was created` });
    },
    async update(req, res) {
        
    },
    async delete(req, res) {
        
    },

    async getContent(req, res) {
        const file = await File.findOne({_id: req.params.id});
        res.status(200).sendFile(file.path, { root: '.' });
    }
}