import User from '../models/user.js'

export default {
    async findOne(req, res, next) {
        const user = await User.find({slug: req.params.slug});
        if(!user) return next();
        return res.status(200).send({data: user});
    },
    async findAll(req, res) {
        const users = await User.find().sort({ createdAt: 'desc' });
        return res.status(200).send({ data: users });
    },
    async create(req, res) {
        const user = await new User({
            username: req.body.username
        }).save();

        return res.status(201).send({ data: user, message: `User was created` });
    },
    async update(req, res) {
        const user = await User.find({ 'slug': req.params.slug });
        if (!user) return next();

        user.username = req.body.username;
        await user.save();

        return res.status(200).send({ data: user, message: `User was updated` });
    },
    async delete(req, res) {
        const user = await User.findOne({ 'slug': req.params.slug });
        if (!user) return next();
        await user.remove();

        return res.status(200).send({ message: `User was removed` });
    }
}