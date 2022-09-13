export const onlyAllowApplicationJSON = (req: any, res: any, next: any) => {
    // if(req.headers['content-type'] === 'application/json') {
        next();
    // } else {
    //     return next(new Error('not json'));
    // }
    
}