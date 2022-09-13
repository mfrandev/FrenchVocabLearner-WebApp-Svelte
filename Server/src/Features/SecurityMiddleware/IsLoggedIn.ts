// Simple middleware to check that the incoming request is from a logged in user
export const isLoggedIn = (req: any, res: any, next: any) => {
    if('UserState' in req.session) {
        next();
    } else {
        return res.status(401).send({message: 'please login before accessing this page'}) // handle error
    }
}