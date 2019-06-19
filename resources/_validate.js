const Validator = require('jsonschema').Validator;
const validator = new Validator();
validator.addSchema(require('./gameObjects/_GameObjectSchema.json'));
validator.addSchema(require('./levels/_LevelSchema.json'));
validator.addSchema(require('./events/_EventSpec.json'));

const GameObjectsValidate = require('./gameObjects/_validate.js');
const LevelsValidate = require('./levels/_validate.js');

GameObjectsValidate.validateAssets(validator);
LevelsValidate.validateAssets(validator);