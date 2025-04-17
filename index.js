import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import axios from "axios";

async function startServer() {
  const app = express();

  const typeDefs = `
    type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        phone: String!
        website: String!
    }

    type Todo {
      id: ID!
      title: String!
      completed: Boolean!
    }

    type Query {
      getTodos: [Todo]
      getUsers : [User]
      getUser(id: ID!): User
    }
  `;

  const resolvers = {
    Query: {
      getTodos: async () =>
        (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,

      getUsers: async () =>
        (await axios.get("https://jsonplaceholder.typicode.com/users")).data,

      getUser: async (parent, { id }) =>
        (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
          .data,
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
