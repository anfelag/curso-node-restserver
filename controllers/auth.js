const { response } = require("express");
const User = require('../models/user');

const bcryptjs = require('bcryptjs');

const { generateJWT } = require("../helpers/generate-JWT");




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
};


module.exports = {
    login
}