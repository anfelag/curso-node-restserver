const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT, adminRole } = require('../middlewares');

const {
    getCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categories');
const { categoryExistsById, categoryExists } = require('../helpers/db-validators');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', getCategories );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( categoryExistsById ),
    validateFields
], getCategoryById);

// Crear categoria - privado - cualquier persona con un token valido
router.post('/',[ 
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], createCategory);

// Actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( categoryExistsById ),
    check('name').custom( categoryExists ),
    validateFields
], updateCategory);

// Borrar una categoria - Admin
router.delete('/:id',[
    validateJWT,
    adminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( categoryExistsById ),
    validateFields
], deleteCategory);


module.exports = router;