import Project from '../models/project.js';
import fs from "fs";

const projectsPath = "./users_projects"

export default {
    async findOne(req, res, next) {
        const project = await Project.find({slug: req.params.slug});
        if(!project) return next();
        return res.status(200).send({data: project});
    },
    async findAll(req, res) {
        const projects = await Project.find().sort({ createdAt: 'desc' });
        return res.status(200).send({ data: projects });
    },
    async create(req, res) {
        console.log(req.body.name)
        if (!fs.existsSync(projectsPath)) {
            console.log("directory 'users_projects' doesn't exists");
            fs.mkdirSync(projectsPath);
            console.log("directory 'users_projects' created.");
        }

        const project = await new Project({
            name: req.body.name,
            userid: req.body.userid,
            structure: req.body.structure,
            files: req.body.files,
        }).save();

        console.log(project)
        fs.mkdirSync(projectsPath + '/' + project.slug);
        console.log(`project '${project.slug}' created.`);

        return res.status(201).send({ data: project, message: `Project was created` });
    },
    async update(req, res) {
        

    },
    async delete(req, res) {
        
    }
}