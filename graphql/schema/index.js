const { buildSchema } = require('graphql');

const rootSchema = buildSchema(`
type Join {
    _id: ID!
    project: Project!
    vacancy: Vacancy!
    user: User!
    createdAt: String!
    updatedAt: String!  
}

type Vacancy {
    _id: ID!
    project: Project!
    skills: [String!]!
    postulatedUsers: [User!]!
    selectedUser: User!
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
    vacancies: [Vacancy!]!
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

input VacancyInput {
    projectId: ID!
    skills: [String!]!
}

input UserInput {
    email: String!
    password: String!
    firstName: String
    lastName: String
    description: String
    skills: [String!]
    languages: [String!]
    experience: String
    companyName: String
    companyDepartment: String
    country: String
}

input LoginInput {
    email: String!
    password: String!
}

input UserFilter {
    country: FilterType
}

input FilterType {
    ne: String
    eq: String
}

type RootQuery {
    projects: [Project!]!
    users(filter: UserFilter): [User!]!
    joins: [Join!]!
    vacancies: [Vacancy!]!
}

type RootMutation {
    createUser(userInput: UserInput): AuthData!
    login(loginInput: LoginInput): AuthData! 
    createProject(projectInput: ProjectInput): Project
    createVacancy(vacancyInput: VacancyInput): Vacancy
    joinProject(vacancyId: ID!): Join!
    cancelJoin(joinId: ID!): Vacancy!
    cancelProject(projectId: ID!): Project!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

module.exports = rootSchema;
