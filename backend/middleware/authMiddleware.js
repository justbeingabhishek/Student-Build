import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      sucess: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      req.userid = decoded.id;
      next();
    } else {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: "Invalid token",
    });
  }

}

export default authMiddleware;
