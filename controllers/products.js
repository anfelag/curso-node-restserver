const { response } = require('express');

const { Product, Category } = require('../models');


const getProducts = async( req, res = response ) => {

    const { limit = 5, from = 0 } = req.query;

    const query = { status: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
            .populate('user', 'name')
            .populate('category', 'name')
            .skip( Number(from) )
            .limit( Number(limit) ) 
    ]);

    res.json({
        total,
        products
    })
}

const getProductById = async( req, res = response ) => {

    const { id } = req.params;

    const product = await Product.findById( id )
        .populate('user', 'name')
        .populate('category', 'name');

    res.json( product );
}

const createProduct = async( req, res = response ) => {

    const { status, user, ...rest } = req.body;

    const productDB = await Product.findOne({ name: rest.name.toUpperCase() });
    if ( productDB ) {
        return res.status(400).json({
            msg: `El producto ${ productDB.name }, ya existe`
        });
    }
    
    // Generar la data a guardar
    const data = {
        ...rest,
        name: rest.name.toUpperCase(),
        user: req.user._id,
    }

    const product = new Product( data );

    // Guardar en DB
    await product.save();

    res.status(201).json( product );
}

const updateProduct = async( req, res = response) => {

    const { id } = req.params;
    const { status, user, ...rest } = req.body;

    if ( rest.name ) {
        rest.name = rest.name.toUpperCase();
    }

    const data = {
        ...rest,
        user: req.user._id
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json(product);
}

const deleteProduct = async( req, res = response ) => {

    const { id } = req.params;

    const product = await Product.findByIdAndUpdate( id, { status: false }, { new: true} );

    res.json( product );
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}