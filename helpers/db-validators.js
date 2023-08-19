const Role = require('../models/role');
const User = require('../models/user');


const isValidRole = async(rol = '') => {

    const roleExists = await Role.findOne({ rol });
    if ( !roleExists ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExists = async( email = '' ) => {

    const emailExists = await User.findOne({ email });
    if ( emailExists ) {
        throw new Error(`El correo ya está registrado`);
    }
}

const userExistsById = async( id = '' ) => {

    const userExists = await User.findById( id );
    if ( !userExists ) {
        throw new Error(`El id no existe`);
    }
}


module.exports = {
    isValidRole,
    emailExists,
    userExistsById
}