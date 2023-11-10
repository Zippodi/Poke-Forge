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
  return new Promise((resolve, reject) => {
    if (!validateTeamBody(team)) {
      reject('Invalid team body');
    }
    let connection = db.getDatabaseConnection();
    connection.getConnection((err, conn) => {
      conn.beginTransaction(async (err) => {
        if (err) {
          reject(err);
        }
        //insert User
        let salt = crypto.randomBytes(64);
        salt = salt.toString('hex');
        let hashedPassword = hashPassword(password, salt);
        conn.query('INSERT INTO team(username, password, salt) VALUES (?, ?, ?)', [username, hashedPassword, salt], async (err, results, fields) => {
          if (err) {
            return conn.rollback(() => { reject(err); });
          }
          const newUserId = results.insertId;
          conn.commit((err) => {
            if (err) {
              return conn.rollback(() => { reject(err); });
            }
            resolve(newUserId);
          });
        });
      });
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
