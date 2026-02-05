import crypto from 'crypto';

// Generate a simple token from password
export function generateToken(password) {
  const secret = process.env.ADMIN_TOKEN_SECRET || 'default-secret';
  return crypto.createHmac('sha256', secret).update(password).digest('hex');
}

// Verify the token
export function verifyToken(token) {
  const expectedToken = generateToken(process.env.ADMIN_PASSWORD);
  return token === expectedToken;
}

// Auth middleware
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.slice(7);

  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  next();
}
