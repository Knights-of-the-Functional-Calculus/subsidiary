const fs = require('fs');
const path = require('path');
const assetType = 'GameObject';

exports.validateAssets = async(validator) => {
    const cachedPaths = [];
    fs.readdir(__dirname, (err, files) => {
        console.log('Validating Widget assets:');
        files.forEach(file => {
            if (file[0] !== '_' && file[0] !== '.' && file.slice(-5) === '.json') {
                const fullFilePath = path.join(__dirname, file);
                cachedPaths.push(fullFilePath);
                const object = require(fullFilePath);
                const result = validator.validate(object, `/${assetType}`);
                if (result.valid) {
                    console.log(file, 'is valid.');
                } else {
                    console.log(file, 'is not valid!');
                }
            }
        });
    });
    cachedPaths.forEach(cachedPath => {
        delete require.cache[require.resolve(cachedPath)];
    });
}