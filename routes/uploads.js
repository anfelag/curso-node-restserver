const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateFile } = require('../middlewares');
const { collectionsAllowed } = require('../helpers/db-validators');

const { fileUpload, updateImage, showImage, updateImageCloudinary } = require('../controllers/uploads');

const router = Router();

router.post('/', validateFile, fileUpload);

router.put('/:collection/:id',[
    validateFile,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom( c => collectionsAllowed( c, ['users', 'products'] )  ),
    validateFields
], updateImageCloudinary);
// ], updateImage);

router.get('/:collection/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom( c => collectionsAllowed( c, ['users', 'products'] )  ),
    validateFields
], showImage);

module.exports = router;