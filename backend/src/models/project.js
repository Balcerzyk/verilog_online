import mongoose from 'mongoose';

const Project = mongoose.Schema({
    name: String,
    userid: String,
    topmodule: String,
    files: [{fileid: String, name: String}]
},{
    timestamps: true
})


export default mongoose.model("Project", Project);