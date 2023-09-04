const { response } = require("express");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { uploadFile } = require("../helpers/upload-file");

const { User, Product } = require('../models');


const fileUpload = async( req, res = response ) => {

    try {
        
        // const name = await uploadFile( req.files, ['txt', 'md'], 'texts' );
        const name = await uploadFile( req.files, undefined, 'imgs' );
        res.json({ name });
    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const updateImage = async( req, res = response ) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        break;

        case 'products':
            model = await Product.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó valdiar esto'});
    }

    // Limpiar imagenes previas
    if ( model.img ) {
        // Borrar la imagen del servidor
        const pathImg = path.join( __dirname, '../uploads', collection, model.img );

        if ( fs.existsSync( pathImg ) ) {
            fs.unlinkSync( pathImg );
        }
    }

    const name = await uploadFile( req.files, undefined, collection );
    model.img = name;

    await model.save();

    res.json( model );
}

const updateImageCloudinary = async( req, res = response ) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        break;

        case 'products':
            model = await Product.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó valdiar esto'});
    }

    // Limpiar imagenes previas
    if ( model.img ) {
        const nameArr = model.img.split('/');
        const name = nameArr[ nameArr.length - 1 ];
        const [ public_id ] = name.split('.');
        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.file;

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    model.img = secure_url;

    await model.save();

    res.json( model );
}

const showImage = async( req, res = response ) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        break;

        case 'products':
            model = await Product.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó valdiar esto'});
    }

    // Limpiar imagenes previas
    if ( model.img ) {
        // Borrar la imagen del servidor
        const pathImg = path.join( __dirname, '../uploads', collection, model.img );

        if ( fs.existsSync( pathImg ) ) {
            return res.sendFile( pathImg );
        }
    }

    const pathImg = path.join( __dirname, '../assets/no-image.jpg')

    res.sendFile( pathImg );
}


module.exports = {
    fileUpload,
    updateImage,
    showImage,
    updateImageCloudinary
}