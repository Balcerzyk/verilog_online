import mongoose from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';

const User = mongoose.Schema({
    username: String,

},{
    timestamps: true
})

User.plugin(URLSlugs('username', {field: 'slug', update: true}));

export default mongoose.model("User", User);