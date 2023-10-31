// // const mongoDb = require('mongodb');
// const mongoClient = mongoDb.MongoClient;
// // const serverUrl = "mongodb://127.0.0.1:27017/";
// // const dbName = "sample_db";

// mongoClient.connect(
//   serverUrl,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   function (err, db) {}
// );

import { Db, MongoClient } from 'mongodb';
import chalk from 'chalk';
import { Mongoose } from 'mongoose';

class Database {
  db?: Db;

  async init(): Promise<Db | undefined> {
    try {
      const MONGODB =
        process.env.DATABASE ||
        'mongodb://localhost:27017/jwt-login-register-21';
      const mongoClient = await MongoClient.connect(MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      this.db = mongoClient.db('');
      // Mensaje visual con el estado
      console.log('================DATABASE================');
      console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
      console.log(`DATABASE: ${chalk.greenBright(this.db.databaseName)}`);
    } catch (error) {
      console.log('================DATABASE================');
      console.log(`ERROR: ${error}`);
      console.log(`STATUS: ${chalk.redBright('OFFLINE')}`);
      console.log(`DATABASE: ${chalk.redBright(this.db?.databaseName)}`);
    }
    return this.db;
  }
}
export default Database;
