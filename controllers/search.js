const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const COLLECTIONS = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUsers = async( term = '', res = response ) => {

    const isMongoId = ObjectId.isValid( term );

    if ( isMongoId ) {
        const user = await User.findById( term );
        return res.json({
            result: ( user ) ? [ user ] : []
        });
    }

    // Insensible a las mayusculas 'i'
    const regex = new RegExp( term, 'i' );

    const user = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    });

    res.json({ results: user });
}

const searchCategories = async( term = '', res = response ) => {
    
    const isMongoId = ObjectId.isValid( term );

    if ( isMongoId ) {
        const category = await Category.findById( term );
        return res.json({
            result: ( category ) ? [ category ] : []
        });
    }

    const regex = new RegExp( term, 'i' );

    const category = await Category.find({ name: regex, status: true });

    res.json({ results: category });
}

const searchProducts = async( term = '', res = response ) => {

    const isMongoId = ObjectId.isValid( term );

    if ( isMongoId ) {
        const product = await Product.findById( term )
                                    .populate('category', 'name');
        return res.json({
            result: ( product ) ? [ product ] : []
        });
    }

    const regex = new RegExp( term, 'i' );

    const product = await Product.find({ name: regex, status: true })
                                .populate('category', 'name');

    res.json({ results: product });
}

const search = async( req, res = response ) => {

    const { collection, term } = req.params;

    if ( !COLLECTIONS.includes( collection ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ COLLECTIONS }`
        })
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
        break;
        case 'categories':
            searchCategories(term, res);
        break;
        case 'products':
            searchProducts(term, res);
        break;

        default:
            res.status(500).json({ msg: 'Se le olvido hacer esta búsqueda' })
    }
}


module.exports = {
    search
}