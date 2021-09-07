const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const { generatePath } = require('react-router-dom');

// generating examples of projects and times

let times = [
  {
    id: Date.now().toString(),
    description: 'description1',
    amount: 5
  },
];

let projects = [
  {
    id: Date.now().toString(),
    name: 'name1',
    description: 'description1',
    times: [...times]
  },
];

const typeDefs = gql`
  type Project {
    id: String
    name: String
    description: String
    times: [Time!]
  }
  type Time {
    id: String
    description: String
    amount: Int
  }
  # queries
  type Query {
    projects: [Project]!
    times: [Time]!
  }
  # mutations
  type Mutation {
    createProject(name: String!, description: String!):String
    removeProject(id: String!):String
    updateProject(id: String!, name: String!, description: String!):String
    createTime(id: String!,description: String!, amount: Int!):String
    removeTime(id: String!, projectid: String!):String
  }
`;

const resolvers = {
  Query: {
    projects: () => projects,
    times: () => times
  },

  Mutation: {
    createProject: (parent, args, context, info) => {
      return projects.push({
        id: Date.now().toString(),
        name: args.name,
        description: args.description,
        times: [...times]
      });
    },
    removeProject: (parent, args, context, info) => {
      for (let i in projects) {
        if (projects[i].id === args.id) {
          projects.splice(i, 1);
        }
      }
      return args.id;
    },
    updateProject: (parent, args, context, info) => {
      for (let i in projects) {
        if (projects[i].id === args.id) {
          projects[i].name = args.name;
          projects[i].description = args.description;
        }
      }
      return args.id;
    },
    createTime: (parent, args, context, info) => {
      let project = projects.find(x => x.id === args.id);
      project.times.push({
        id: Date.now().toString(),
        description: args.description,
        amount: args.amount
      });
      return;
    },
    removeTime: (parent, args, context, info) => {
      let project = projects.find(x => x.id === args.projectid);
      for (let i in project.times) {
        if (project.times[i].id === args.id) {
          project.times.splice(i, 1);
        }
      }
      return args.id;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.use(cors());

app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);