const fs = require('fs');
const path = require('path');
const assetType = 'Level';

exports.validateAssets = async(validator) => {
    fs.readdir(__dirname, (err, files) => {
        console.log('Validating Level assets:');
        files.forEach(file => {
            if (file[0] !== '_' && file[0] !== '.' && file.slice(-5) === '.json') {
                const object = require(path.join(__dirname, file));
                const result = validator.validate(object, `/${assetType}`);
                if (result.valid) {
                    console.log(file, 'is valid.');
                } else {
                    console.log(file, 'is not valid!');
                }
            }
        });
    });
}