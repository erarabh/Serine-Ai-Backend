// middleware/auth.js 
import jwt from 'jsonwebtoken';

/**
 * requireAuth middleware verifies the JWT sent in the Authorization header.
 * It expects a header formatted as: "Bearer <token>"
 */
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the Supabase JWT secret stored in your environment variables.
																	
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET || "20Dn5USO3xu050vy/VWIJg/8gg1bdhhvhn/4DVT75Lwn41q2QKvuf7OoW0Vp7pZYktXdT0A7Sw0nb9Iun2zocg==");
    req.user = decoded;  // The decoded payload should include user information, such as email and role.
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export default requireAuth;
