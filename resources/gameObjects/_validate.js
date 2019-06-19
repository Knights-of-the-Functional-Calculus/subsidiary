const CharactersValidate = require('./characters/_validate.js');
const WidgetsValidate = require('./widgets/_validate.js');

exports.validateAssets = async(validator) => {
    CharactersValidate.validateAssets(validator);
    WidgetsValidate.validateAssets(validator);
}