import Project from '../models/project.js';
import fs from "fs";
import { exec } from 'child_process';

const projectsPath = "./users_projects"

export default {
    async findOne(req, res, next) {
        const project = await Project.find({id: req.params.id});
        if(!project) return next();
        return res.status(200).send({data: project});
    },
    async findAll(req, res) {
        const projects = await Project.find({'userid': req.user.id}).sort({ createdAt: 'desc' });
        return res.status(200).send({ data: projects });
    },
    async create(req, res) {
        if (!fs.existsSync(projectsPath)) {
            console.log("directory 'users_projects' doesn't exists");
            fs.mkdirSync(projectsPath);
            console.log("directory 'users_projects' created.");
        }

        const project = await new Project({
            name: req.body.name,
            userid: req.user.id,
            files: []
        }).save();

        fs.mkdirSync(projectsPath + '/' + project._id);
        console.log(`project '${project._id}' created.`);

        return res.status(201).send({ data: project, message: `Project was created` });
    },

    async execute(req, res) {
        exec(`cd users_projects/${req.params.id} && make`, (err, stdout, stderr) => { //verilator -Wall --sc --trace --exe sc_main.cpp top.v && make -j -C obj_dir -f Vtop.mk Vtop     //cd users_projects/${req.params.id} && make`
            if (err) {
                res.status(422).send(stderr)
                return;
            }
            exec(`cd users_projects/${req.params.id}/obj_dir && ./Vtop`, (err, stdout, stderr) => {
                if (err) {
                    res.status(422).send(stderr)
                    return;
                }
                res.status(200).send(stdout)
                return;
              });
            return;
          });      
    },

    async wavefroms(req, res) {
        let path = `users_projects/${req.params.id}/logs/vlt_dump.vcd`

        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                res.status(500);
                res.send();
              return
            } 
            res.status(200);
            res.sendFile(path, { root: '.' });
        }); 
    }
}