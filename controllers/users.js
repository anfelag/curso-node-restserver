const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const usersGet = async(req, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    // Se usa Promise.all para ejecutar más de una promesa al mismo tiempo
    // El metodo skip se usa para indicar desde que registro se retornaran los datos
    // El metodo limit se usa para limitar un numero de registros retornados
    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
            .skip( Number( from ) )
            .limit( Number( limit ) )
    ]);

    res.json({
        total,
        users
    });
}

const usersPost = async(req, res = response) => {

    const { name, email, password, rol } = req.body;
    const user = new User({ name, email, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // Guardar en DB
    await user.save();

    res.json({
        user
    });
}

const usersPut = async(req, res = response) => {

    const { id } = req.params;
    const { __id, password, google, email, ...resto } = req.body;

    // TODO: validar contraseña base de datos
    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, resto, { returnDocument: 'after'});

    res.json( user );
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usersDelete = async(req, res = response) => {

    const { id } = req.params;

    // Borrar fisicamente
    // const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id, { status: false } );

    res.json( user );
}


module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}