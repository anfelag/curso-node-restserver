const { Role, User, Category, Product } = require('../models');

/**
 * Usuario
 */
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

/**
 * Categoria
 */
const categoryExistsById = async( id = '' ) => {

    const categoryExists = await Category.findById( id );
    if ( !categoryExists ) {
        throw new Error(`El id no existe`);
    }
}

const categoryExists = async( name = '' ) => {

    const categoryExists = await Category.findOne({ name: name.toUpperCase() });
    if ( categoryExists ) {
        throw new Error(`La categoria ${ name } ya está registrada`);
    }
}

/**
 * Producto
 */
const productExistsById = async( id = '' ) => {

    const productExists = await Product.findById( id );
    if ( !productExists ) {
        throw new Error(`El id no existe`);
    }
}

const productExists = async( name = '' ) => {

    const productExists = await Product.findOne({ name: name.toUpperCase() });
    if ( productExists ) {
        throw new Error(`El producto ${ name } ya está registrado`);
    }
}

module.exports = {
    isValidRole,
    emailExists,
    userExistsById,
    categoryExistsById,
    categoryExists,
    productExistsById,
    productExists
}