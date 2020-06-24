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
    description: String
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
    published: String
    isOpen: Boolean!
    views: Int
    skills: [String!]!
    projectPictureName: String
    projectPictureUrl: String
    creator: User!
    vacancies: [Vacancy!]!
    files: [File!]!
    updatedAt: String
}

type Job {
    _id: ID!
    title: String!
    description: String!
    type: String!
    expertise: String!
    skills: [String!]!
    salaryType: String!
    salary: String!
    files: [File!]!
    companyName: String!
    companyDescription: String!
    companyLocation: String!
    companyLogo: String!
    views: Int
    creator: User!
}

type File {
    _id: ID!
    name: String!
    url: String!
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
    profilePictureName: String
    profilePictureUrl: String
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
}

input UpdateProjectInput {
    projectId: ID
    method: String
    title: String
    description: String
    type: String
    views: Int
    startDate: String
    endDate: String
    isOpen: Boolean
    files: [FileInput]
    projectPictureName: String
    projectPictureUrl: String
}

input FileInput {
    name: String!
    url: String!
}

input VacancyInput {
    projectId: ID
    title: String
    description: String
    experience: String
    skills: [String!]
    timeCommitment: Float
    timeCommitmentUnits: String
}

input JobInput {
    title: String!
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
    profilePictureName: String
    profilePictureUrl: String
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
    projectById(projectId: ID): Project!
    vacancies(projectId: ID!): [Vacancy!]!
    joins: [Join!]!
}

type RootMutation {
    createUser(userInput: createUserInput): AuthData!
    updateUser(userInput: UpdateUserInput): User!
    login(loginInput: LoginInput): AuthData! 
    createProject(projectInput: ProjectInput): Project!
    updateProject(projectInput: UpdateProjectInput): Project!
    createVacancy(vacancyInput: VacancyInput): Project!
    joinVacancy(vacancyId: ID!): Join!
    cancelJoin(joinId: ID!): Vacancy!
    cancelVacancy(vacancyId: ID!): Project!
    cancelProject(projectId: ID!): Project!
    selectUser(selectedUserId: ID!, vacancyId: ID!): Vacancy!
    deleteProjectFile(projectId: ID!, fileId: ID!): Project!
    createJob(jobInput: JobInput): Job!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

module.exports = rootSchema;
