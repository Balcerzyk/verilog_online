import mongoose from 'mongoose';

const File = mongoose.Schema({
    name: String,
    projectid: String,
    path: String
},{
    timestamps: true
})


export default mongoose.model("File", File);