const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const mongoose = require('mongoose');

// credencials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS  

const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.6d3qy1p.mongodb.net/casa-do-lago?retryWrites=true&w=majority`;

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(connectionString)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch(err => {
        console.error('Database connection error', err);
      });
  }
}

module.exports = new Database();