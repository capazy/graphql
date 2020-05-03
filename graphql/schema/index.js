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
    skills: [String!]!
    type: String!
    spots: Float!
    published: String!
    isOpen: Boolean!
    creator: User!
    joinedUsers: [User!]!
}

type User {
    _id: ID
    email: String!
    password: String
    firstName: String!
    lastName: String!
    description: String!
    skills: [String!]!
    languages: [String!]!
    experience: String!
    companyName: String!
    companyDepartment: String!
    country: String!
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
    skills: [String!]!
    type: String!
    spots: Float!
    published: String!
}

input UserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    description: String!
    skills: [String!]!
    languages: [String!]!
    experience: String!
    companyName: String!
    companyDepartment: String!
    country: String!
}

input LoginInput {
    email: String!
    password: String!
}

type RootQuery {
    projects: [Project!]!
    users: [User!]!
    joins: [Join!]!
    login(loginInput: LoginInput): AuthData! 
}

type RootMutation {
    createProject(projectInput: ProjectInput): Project
    createUser(userInput: UserInput): AuthData!
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
