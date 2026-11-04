import jwt from "jsonwebtoken";

function authMiddleware (req,res,next){
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({
            message: "No token provided",
            
        })
    }

    try {
    const decodedToken  = token.split(" ")[1];
    const decoded = jwt.verify(decodedToken,process.env.JWT_SECRET);
    if (decoded.id) {
      req.userid = decoded.id;
      return next();
    } else {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

export default authMiddleware