import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import axios from "axios";

async function startServer() {
  const app = express();

  const typeDefs = `
    type Todo {
      id: ID!
      title: String!
      completed: Boolean!
    }

    type Query {
      getTodos: [Todo]
    }
  `;

  const resolvers = {
    Query: {
      getTodos: async () =>
        (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  app.use(express.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(8000, () => console.log("Server Strated at Port 8000"));
}

startServer();
