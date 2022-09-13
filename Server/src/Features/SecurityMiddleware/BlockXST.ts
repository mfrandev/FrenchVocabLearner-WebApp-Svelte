/**
 * This middleware blocks trace requests to avoid Cross-Site Tracing Attacks 
 * (using the TRACE method to bypass the httpOnly setting in each cooking)
 * https://cheatcode.co/tutorials/how-to-implement-secure-httponly-cookies-in-node-js-with-express#handling-trace-requests
 * @param req 
 * @param res 
 * @param next 
 */
 export const blockTraceRequests = (req, res, next) => {

    // NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
    const allowedMethods = [
      "OPTIONS",
      "HEAD",
      "CONNECT",
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
    ];
  
    if (!allowedMethods.includes(req.method)) {
      res.status(405).send(`${req.method} not allowed.`);
    }
  
    next();
  };

