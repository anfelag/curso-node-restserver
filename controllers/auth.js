const { response } = require("express");
const User = require('../models/user');

const bcryptjs = require('bcryptjs');

const { generateJWT } = require("../helpers/generate-JWT");
const { googleVerify } = require("../helpers/google-verify");




const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            })
        }

        // Si el usuario esta activo
        if ( !user.status ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }

        // Verificar la contraseña
        const validatePassword = bcryptjs.compareSync( password, user.password );
        if ( !validatePassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async( req, res = response ) => {

    const { id_token } = req.body;

    try {
        
        const { name, img, email } = await googleVerify( id_token );

        let user = await User.findOne({ email });

        if ( !user ) {
            // Si no existe se crea el usuario
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true
            }

            user = await User( data );
            await user.save();
        }

        // Si el estado del usuario es false en DB
        if ( !user.status ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        })
    }
}


module.exports = {
    login,
    googleSignIn
}