const db = require('../DBConnection');
const User = require('../models/User');
const crypto = require('crypto');


function getUserByCredentials(username, password) {
  return db.query('SELECT * FROM user WHERE username=?', [username]).then(({results}) => {
    const user = new User(results[0]);
    if (user) { // we found our user
      return user.validatePassword(password);
    }
    else { // if no user with provided username
      throw new Error("No such user");
    }
  });
}

function createUser(username, password) {
      //insert User
      let salt = crypto.randomBytes(32);
      
      salt = salt.toString('hex');
      crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) { //problem computing digest, like hash function not available
          reject("Error: " +err);
        }
    
        const hashedPassword = derivedKey.toString('hex');
        return db.query('INSERT INTO user(username, password, salt) VALUES (?, ?, ?)', [username, hashedPassword, salt]).then(({results}) => {
          const user = new User(results[0]);
          if (user) { // we found our user
            return user.validatePassword(password);
          }
          else { // if no user with provided username
            throw new Error("No such user");
          }
        });
        
            
          
          
      });

    
}


function hashPassword(password, salt) {
    
  crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
    if (err) { //problem computing digest, like hash function not available
      reject("Error: " +err);
    }

    const digest = derivedKey.toString('hex');
    return digest;
        
      
      
  });
  
}


module.exports = {
  getUserByCredentials: getUserByCredentials,
  createUser: createUser
};
