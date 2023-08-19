
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validate-fields');
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
    validarCampos
], usersPost );

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userExistsById ),
    check('rol').custom( isValidRole ),
    validarCampos
], usersPut );

router.patch('/', usersPatch );

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userExistsById ),
    validarCampos
], usersDelete );


module.exports = router;