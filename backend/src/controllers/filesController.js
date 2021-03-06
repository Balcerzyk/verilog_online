import File from '../models/file.js';
import Project from '../models/project.js';
import fs from "fs";

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
        // CREATE PROJECT OBJECT
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
            project.topmodule = req.body.topModule;
            console.log(`file '${file._id}' created.`);
        }
        await project.save()
        //CREATE INPUT SIGNALS FILE

        fs.writeFileSync(`./users_projects/${project._id}/input.json`, req.body.signals);


        // CREATE SC_MAIN FILE
        var scMainFile = fs.readFileSync(`./src/sc_main_template.cpp`).toString().split("\n");

        let inputSignalsFile = fs.readFileSync(`./users_projects/${project._id}/input.json`);
        let jsonSignals = JSON.parse(inputSignalsFile);
        let stringSignals = '';
        let signalsAssign = '';

        for(let i=0; i< jsonSignals.length; i++) {
            let signal = jsonSignals[i];
            stringSignals += `\tsc_clock ${signal.name}{"${signal.name}", ${signal.period}, SC_${signal.unit}, ${signal.dutyCycle}, ${signal.start}, SC_${signal.unit}, ${signal.posedgeFirst}};\n`;
            
            signalsAssign += `\ttop->${signal.name}(${signal.name});\n`
        }

        scMainFile.splice(30, 0, signalsAssign);
        scMainFile.splice(24, 0, stringSignals);
        let text = scMainFile.join("\n");
        text = text.replaceAll('top', `${project.topmodule.replace('.v','')}`);

        fs.writeFile(`./users_projects/${project._id}/sc_main.cpp`, text, function (err) {
        if (err) return console.log(err);
        });

        // UPDATE MAKEFILE
        fs.copyFile('src/Makefile_example', `./users_projects/${project._id}/Makefile`, (err) => {
            if (err) throw err;
            console.log('Makefile was copied to destination');
        });
        
        fs.readFile(`./users_projects/${project._id}/Makefile`, 'utf8', function (err, data) {
            if (err) {
              return console.log(err);
            }
            let result = data.replaceAll('top', `${project.topmodule.replace('.v','')}`);
          
            fs.writeFile(`./users_projects/${project._id}/Makefile`, result, 'utf8', function (err) {
               if (err) return console.log(err);
            });
          });

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

function setInputSignals(path, body) {
    fs.writeFileSync(`${path}/input.json`, body.signals);
}

function createSCMain(path, project) {
    let scMainFile = fs.readFileSync(`./src/sc_main_template.cpp`).toString().split("\n");
    let inputSignalsFile = fs.readFileSync(`${path}/input.json`);
    let jsonSignals = JSON.parse(inputSignalsFile);
    let stringSignals = '';
    let signalsAssign = '';

    jsonSignals.forEach( signal => {
        stringSignals += `\tsc_clock ${signal.name}{"${signal.name}", ${signal.period}, SC_${signal.unit}, ${signal.dutyCycle}, ${signal.start}, SC_${signal.unit}, ${signal.posedgeFirst}};\n`;
        signalsAssign += `\ttop->${signal.name}(${signal.name});\n`
    });

    scMainFile.splice(30, 0, signalsAssign);
    scMainFile.splice(24, 0, stringSignals);

    let text = scMainFile.join("\n");
    text = text.replaceAll('top', `${project.topmodule.replace('.v','')}`);

    fs.writeFile(`${path}/sc_main.cpp`, text, function (err) {
        if (err) return console.log(err);
    });
}

function updateMakeFile(path, project) {
    fs.copyFile('src/Makefile_example', `${path}/Makefile`, (err) => {
        if (err) throw err;
        console.log('Makefile was copied to destination');
    });
    
    fs.readFile(`${path}/Makefile`, 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        let result = data.replaceAll('top', `${project.topmodule.replace('.v','')}`);
      
        fs.writeFile(`${path}/Makefile`, result, 'utf8', function (err) {
           if (err) return console.log(err);
        });
      });
}