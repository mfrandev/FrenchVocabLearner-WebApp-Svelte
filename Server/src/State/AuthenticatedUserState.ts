import { RoleModel } from "../Database/Model/Users/Role"

export interface AuthenticatedUserData {
    username: string,
    email: string,
    userID?: string,
    roles: RoleModel[]
};