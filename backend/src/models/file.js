import mongoose from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';

const File = mongoose.Schema({
    name: String,
    projectslug: String,
    path: String
},{
    timestamps: true
})

File.plugin(URLSlugs('name', {field: 'slug', update: true}));

export default mongoose.model("File", File);