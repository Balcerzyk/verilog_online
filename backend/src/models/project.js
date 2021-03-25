import mongoose from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';

const Project = mongoose.Schema({
    name: String,
    userid: String,
    structure: String,
    files: [String],
},{
    timestamps: true
})

Project.plugin(URLSlugs('name', {field: 'slug', update: true}));

export default mongoose.model("Project", Project);