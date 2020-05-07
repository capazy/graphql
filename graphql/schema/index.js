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
    title: String!
    description: String!
    experience: String!
    skills: [String!]!
    postulatedUsers: [User!]!
    selectedUser: User!
}

type Project {
    _id: ID!
    title: String!
    description: String!
    type: String!
    deadline: String!
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
    isAvailable: Boolean!
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
    type: String!
    deadline: String!
    published: String!
}

input VacancyInput {
    projectId: ID!
    title: String!
    description: String!
    experience: String!
    skills: [String!]!
}

input createUserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
}

input UpdateUserInput {
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
    users(filter: UserFilter): [User!]!
    projects: [Project!]!
    vacancies: [Vacancy!]!
    joins: [Join!]!
}

type RootMutation {
    createUser(userInput: createUserInput): AuthData!
    updateUser(userInput: UpdateUserInput): User!
    login(loginInput: LoginInput): AuthData! 
    createProject(projectInput: ProjectInput): Project
    createVacancy(vacancyInput: VacancyInput): Vacancy
    joinVacancy(vacancyId: ID!): Join!
    cancelJoin(joinId: ID!): Vacancy!
    cancelVacancy(vacancyId: ID!): Vacancy!
    cancelProject(projectId: ID!): Project!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

module.exports = rootSchema;
