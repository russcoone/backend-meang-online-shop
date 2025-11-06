import { IContext } from './interfaces/context.interface';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import environment from './config/environments';
import schema from './schema';
import expressPlayground from 'graphql-playground-middleware-express';
import { ApolloServer, PubSub } from 'apollo-server-express';
import Database from './lib/database';
import chalk from 'chalk';

//configuracion de las variables de enterno (lectura)

if (process.env.NODE_ENV !== 'production') {
  const env = environment;
  console.log(env);
}

async function init() {
  const app = express();
  const pubsub = new PubSub();
  app.use('*', cors());
  app.use(compression());

  const database = new Database();

  const db = await database.init();

  const context = async ({ req, connection }: IContext) => {
    const token = req ? req.headers.authorization : connection.authorization;
    return { db, token, pubsub };
  };

  const server = new ApolloServer({
    schema,
    introspection: true,
    context,
  });

  await server.start();

  server.applyMiddleware({ app });

  app.get(
    '/',
    expressPlayground({
      endpoint: '/graphql',
    })
  );

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);
  const PORT = process.env.PORT || 8080;
  httpServer.listen(
    {
      port: PORT,
    },
    () => {
      console.log('=================SERVER API GRAPHQL============');
      console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
      console.log(`MESSAGE: ${chalk.greenBright('API MEANG - ONLINE SHOP')}`);
      console.log(`GraphQL Server => @: http://localhost:${PORT}/graphql`);
      console.log(`WS Connection => @://localhost:${PORT}/graphql`)
    }
  );
}

init();
