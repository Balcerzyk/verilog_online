import File from '../models/file.js';

export default {
    async findOne(req, res, next) {
        
    },
    async findAll(req, res) {
        const files = await File.find().sort({ createdAt: 'desc' });
        return res.status(200).send({ data: files });
    },
    async create(req, res) {console.log(req.body.projectslug)
        const file = await new File({
            name: req.body.name,
            projectslug: req.body.projectslug,
            path: `./users_projects/${req.body.projectslug}/${req.body.name}`
        }).save();

        console.log(`file '${file._id}' created.`);
        return res.status(201).send({ data: file, message: `File was created` });
    },
    async update(req, res) {
        
    },
    async delete(req, res) {
        
    }
}