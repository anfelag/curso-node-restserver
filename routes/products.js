const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT, adminRole } = require('../middlewares');
const { categoryExistsById, productExistsById, productExists } = require('../helpers/db-validators');

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products');



const router = Router();

router.get('/', getProducts);

router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( productExistsById ),
    validateFields
], getProductById);

router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un id valido').isMongoId(),
    check('category').custom( categoryExistsById ),
    validateFields
], createProduct);

router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( productExistsById ),
    check('name').custom( productExists ),
    validateFields
], updateProduct);

router.delete('/:id',[
    validateJWT,
    adminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( productExistsById ),
    validateFields
], deleteProduct);


module.exports = router;