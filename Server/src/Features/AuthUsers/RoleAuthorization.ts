import { RoleModel } from "../../Database/Model/Users/Role";

/**
 * Takes the set of user roles and the set of authorized roles and looks for an intersection
 * @param userRoles 
 * @param rolesAllowed 
 * @returns 
 */
export const verifyRoles = (userRoles: RoleModel[], rolesAllowed: string[]) => {

    //Returns whether the length of the set of intersecting elements in greater than 0
    //i.e., user has at least 1 permission required to access the resource
    return userRoles.filter(elem => rolesAllowed.includes(elem.Name)).length > 0;

}