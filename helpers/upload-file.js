const path = require('path');
const { v4: uuidv4 } = require('uuid');


const uploadFile = ( files, validExtensions = ['png','jpg','jpeg','gif'], folder = '' ) => {

    return new Promise ( (resolve, reject) => {

        const { file } = files;
    
        const cutName = file.name.split('.');
        const extension = cutName[ cutName.length - 1 ];
    
        if ( !validExtensions.includes( extension ) ) {
            reject(`La extensión ${ extension } no es permitida - ${ validExtensions }`);
        }
        
        const tmpName = uuidv4() + '.' + extension;
    
        const uploadPath = path.join( __dirname, '../uploads/', folder, tmpName );
    
        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
    
            resolve( tmpName );
        });
    });
}



module.exports = {
    uploadFile
}