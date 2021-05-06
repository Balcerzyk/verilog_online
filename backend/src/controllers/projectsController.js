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
        const projects = await Project.find().sort({ createdAt: 'desc' });
        return res.status(200).send({ data: projects });
    },
    async create(req, res) {
        console.log(req.user)
        if (!fs.existsSync(projectsPath)) {
            console.log("directory 'users_projects' doesn't exists");
            fs.mkdirSync(projectsPath);
            console.log("directory 'users_projects' created.");
        }

        const project = await new Project({
            name: req.body.name,
            userid: req.body.userid,
            files: []
        }).save();

        fs.mkdirSync(projectsPath + '/' + project._id);
        console.log(`project '${project._id}' created.`);

        return res.status(201).send({ data: project, message: `Project was created` });
    },
    async update(req, res) {
        

    },
    async delete(req, res) {
        
    },

    async execute(req, res) {
        // console.log(res.body.name)
        // exec(`cd users_projects/aaaq && verilator -Wall --cc our.v --exe --build sim_main.cpp`, (err, stdout, stderr) => {
        //     if (err) {
        //         res.send(stderr)
        //         return;
        //     }
        //     exec(`cd users_projects/aaaq/obj_dir && ./Vour`, (err, stdout, stderr) => {
        //         if (err) {
        //           res.send(stderr)
        //           return;
        //         }
        //         res.send(stdout)
        //         return;
        //       });
        //     return;
        //   }); 

        exec(`cd users_projects/${req.params.id} && make`, (err, stdout, stderr) => { //verilator -Wall --sc --trace --exe sc_main.cpp top.v && make -j -C obj_dir -f Vtop.mk Vtop
            if (err) {
                res.send(stderr)
                return;
            }
            exec(`cd users_projects/${req.params.id}/obj_dir && ./Vtop`, (err, stdout, stderr) => {
                if (err) {
                  res.send(stderr)
                  return;
                }
                res.send(stdout)
                return;
              });
            return;
          }); 

        //res.send('wyniczek')       
    }
}