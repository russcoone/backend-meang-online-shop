// import chalk from 'chalk';
// import { MongoClient } from 'mongodb';

// class Database {
//   async init() {
//     const MONGO_DB =
//       process.env.DATABASE ||
//       'mongodb+srv://root:Casas7897419632@cluster0.eyr6v.mongodb.net/test';
//     const client = await MongoClient.connect(MONGO_DB, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     const db = client.db();

//     if (client.isConnected()) {
//       console.log(`===================DATA BASE======================`);
//       console.log(`STATUS ${chalk.greenBright('ONLINE')}`);
//       console.log(`DATABASE ${chalk.greenBright(db.databaseName)}`);
//     }
//     return db;
//   }
// }

// export default Database;

import { Db, MongoClient } from 'mongodb';
import chalk from 'chalk';
import { Mongoose } from 'mongoose';

class Database {
  db?: Db;

  async init(): Promise<Db | undefined> {
    console.log('================DATABASE================');

    try {
      const MONGODB =
        process.env.DATABASE ||
        'mongodb://localhost:27017/jwt-login-register-21';
      const mongoClient = await MongoClient.connect(MONGODB);

      this.db = mongoClient.db();
      // Mensaje visual con el estado
      console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
      console.log(`DATABASE: ${chalk.greenBright(this.db.databaseName)}`);
    } catch (error) {
      console.log(`ERROR: ${error}`);
      console.log(`STATUS: ${chalk.redBright('OFFLINE')}`);
      console.log(`DATABASE: ${chalk.redBright(this.db?.databaseName)}`);
    }
    return this.db;
  }
}
export default Database;
