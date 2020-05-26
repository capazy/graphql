const { buildSchema } = require('graphql');

const rootSchema = buildSchema(`
type Join {
    _id: ID!
    project: Project!
    vacancy: Vacancy!
    user: User!
    status: String!
    createdAt: String!
    updatedAt: String!  
}

type Vacancy {
    _id: ID!
    project: Project!
    title: String!
    experience: String!
    skills: [String!]!
    timeCommitment: Float!
    timeCommitmentUnits: String!
    postulatedUsers: [User!]
    selectedUser: User
}

type Project {
    _id: ID!
    title: String!
    description: String!
    type: String!
    startDate: String!
    endDate: String!
    published: String!
    isOpen: Boolean!
    skills: [String!]!
    creator: User!
    vacancies: [Vacancy!]!
}

type User {
    _id: ID
    email: String!
    password: String
    firstName: String
    lastName: String
    description: String
    expertise: String
    skills: [String!]
    additionalSkills: [String!]
    languages: [String!]
    experience: String
    companyName: String
    companyDepartment: String
    country: String
    isAvailable: Boolean
    createdProjects: [Project!]
    joinedProjects: [Vacancy!]
    joins: [Join!]
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
    startDate: String!
    endDate: String!
    published: String!
}

input UpdateProjectInput {
    projectId: ID
    title: String!
    description: String!
    type: String!
    startDate: String!
    endDate: String!
    published: String!
}

input VacancyInput {
    projectId: ID
    title: String
    experience: String
    skills: [String!]
    timeCommitment: Float
    timeCommitmentUnits: String
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
    expertise: String
    skills: [String!]
    additionalSkills: [String!]
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

type RootQuery {
    user: User!
    users(skill: String!): [User!]!
    userById(userId: ID!): User!
    projects(skill: String!): [Project!]!
    vacancies(projectId: ID!): [Vacancy!]!
    joins: [Join!]!
}

type RootMutation {
    createUser(userInput: createUserInput): AuthData!
    updateUser(userInput: UpdateUserInput): User!
    login(loginInput: LoginInput): AuthData! 
    createProject(projectInput: ProjectInput): Project!
    updateProject(projectInput: UpdateProjectInput): Project!
    createVacancy(vacancyInput: VacancyInput): Vacancy!
    joinVacancy(vacancyId: ID!): Join!
    cancelJoin(joinId: ID!): Vacancy!
    cancelVacancy(vacancyId: ID!): Vacancy!
    cancelProject(projectId: ID!): Project!
    selectUser(selectedUserId: ID!, vacancyId: ID!): Vacancy!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

module.exports = rootSchema;
