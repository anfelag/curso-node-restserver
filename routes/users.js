
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validateFields,
    validateJWT,
    adminRole,
    hasRole
} = require('../middlewares');

const { isValidRole, emailExists, userExistsById } = require('../helpers/db-validators');

const { 
    usersGet, 
    usersPut, 
    usersPost, 
    usersPatch, 
    usersDelete 
} = require('../controllers/users');

const router = Router();

router.get('/', usersGet );

router.post('/', [ // El check es un Middleware
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria y debe contener más de 6 caracteres').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( emailExists ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( isValidRole ),
    validateFields
], usersPost );

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userExistsById ),
    check('rol').custom( isValidRole ),
    validateFields
], usersPut );

router.patch('/', usersPatch );

router.delete('/:id', [
    validateJWT,
    adminRole,
    hasRole('ADMIN_ROLE','SALES_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userExistsById ),
    validateFields
], usersDelete );


module.exports = router;