const { buildSchema } = require('graphql');

const rootSchema = buildSchema(`
type Join {
    _id: ID!
    project: Project!
    user: User!
    createdAt: String!
    updatedAt: String!  
}

type Project {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
    joinedUsers: [User!]!
}

type User {
    _id: ID
    email: String!
    password: String
    createdProjects: [Project!]
}

type AuthData {
    userId: ID!
    token: String!
    tokenExp: Int!
}

input ProjectInput {
    title: String!
    description: String!
    price: Float!
    date: String! 
}

input UserInput {
    email: String!
    password: String!
}

type RootQuery {
    projects: [Project!]!
    users: [User!]!
    joins: [Join!]!
    login(email: String!, password: String!): AuthData! 
}

type RootMutation {
    createProject(projectInput: ProjectInput): Project
    createUser(userInput: UserInput): User
    joinProject(projectId: ID!): Join!
    cancelJoin(joinId: ID!): Project!
    cancelProject(projectId: ID!): Project!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

module.exports = rootSchema;
