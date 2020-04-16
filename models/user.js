var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
userSchema.methods.getUserByName=function(username,callback){
    const query ={
        username:username
    }
    User.findOne({query},callback);
}

module.exports = mongoose.model('User', userSchema);


// module.exports.getUserByName= function(username,callback){
//     const query ={
//         username:username
//     }
//     User.findOne({query},callback);
// }