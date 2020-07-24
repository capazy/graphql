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
    companyName: String!
    companyDescription: String!
    companyLocation: String!
    companyLogo: String!
    views: Int
    creator: User!
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
    workExperience: [Experience!]
    education: [Education!]
    createdProjects: [Project!]
    joinedProjects: [Vacancy!]
    joins: [Join!]
    role: String
    files: [File!]!
}

type File {
    _id: ID
    name: String
    url: String
}

type Experience {
    _id: ID!
    title: String!
    companyName: String!
    yearsOfExperience: String!
    description: String!
    skills: [String!]
}

input ExperienceInput {
    title: String!
    companyName: String!
    yearsOfExperience: String!
    description: String!
    skills: [String!]
}

type Education {
    _id: ID!
    degree: String!
    school: String!
    year: String!
    fieldOfStudy: String!
}

input EducationInput {
    degree: String!
    school: String!
    year: String!
    fieldOfStudy: String!
}

type AuthData {
    userId: ID!
    token: String!
    tokenExp: Int!
}

type Email {
    status: String!
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

input CreateUserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
}

input UpdateUserInput {
    method: String
    firstName: String
    lastName: String
    description: String
    expertise: String
    skills: [String]
    additionalSkills: [String]
    languages: [String!]
    experience: String
    companyName: String
    companyDepartment: String
    workExperience: [ExperienceInput]
    education: [EducationInput]
    country: String
    profilePictureName: String
    profilePictureUrl: String
    role: String
    files: [FileInput]
}

input FileInput {
    name: String!
    url: String!
}

input LoginInput {
    email: String!
    password: String!
}

type RootQuery {
    user: User!
    allUsers:[User!]!
    users(skill: String!): [User!]!
    userById(userId: ID!): User!
    projects(skill: String!): [Project!]!
    projectById(projectId: ID): Project!
    vacancies: [Vacancy!]!
    joins: [Join!]!
}

type RootMutation {
    createUser(userInput: CreateUserInput): AuthData!
    updateUser(userInput: UpdateUserInput): User!
    createExperience(experienceInput: ExperienceInput): User!
    deleteExperience(experienceId: ID!): User!
    createEducation(educationInput: EducationInput): User!
    deleteEducation(educationId: ID!): User!
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
    deleteUserFile(fileId: ID!): User!
    createJob(jobInput: JobInput): Job!
    sendEmail(email: String!, message: String!): Email!
    sendAdminEmail(email: String!, subject: String!,message: String!): Email!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

module.exports = rootSchema;
