const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');


const saltRounds = 10;
const jwtokenSecret = 'JCe2CmtmaySz6iA8BR49vb6892W1V1Gr';

function hashText(text) {

    const hash = bcrypt.hashSync(text, saltRounds);
    return hash;   
};


function checkPassword(planePassword, hashedPassword) {
    const isValid = bcrypt.compareSync(planePassword, hashedPassword);
    return isValid;
}





function genrateUserToken(userPayload) {
    const token = jwt.sign(userPayload, jwtokenSecret, {expiresIn: '2h'});
    return token;
};

function verifyUserToken(token) {
    const payload  = jwt.verify(token, jwtokenSecret);

    return {
        firstName: payload.firstName,
        lastName: payload.lastName,
        userId: payload.userId,
    };

}



module.exports = {
    hashText,
    genrateUserToken,
    checkPassword,
    verifyUserToken
}