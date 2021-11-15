var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = require('./user.js')
var dishSchema = require('./dishes.js')

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}, {timestamps: true});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;