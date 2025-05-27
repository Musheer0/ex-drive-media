import dotenv from 'dotenv';
import { logger } from './logger.js';
import { DecodeJwtToken } from './create-jwt-token.js';

dotenv.config();

export const auth = async (req, options = { strict: false }) => {
  try {
    const bearer = req.headers?.['authorization'];
    const token = req.cookies?.token || (typeof bearer === 'string' && bearer.startsWith('Bearer ') ? bearer.slice(7) : null);

    if (!token) return null;

    const decoded = await DecodeJwtToken(token);
    if (!decoded) return null;

    if (options.strict) {
      const response = await fetch(`${process.env.AUTH_SERVICE}/api/token/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        logger.warn(`Token verification failed with status ${response.status}`);
        return null;
      }

      const user = await response.json();
      if (user.message) return null;

      return {
        id: decoded.user_id,
        token: decoded.token,
        email: user?.data?.email,
        image: user?.data?.image,
        name: user?.data?.name,
      };
    }

    return {
      id: decoded.user_id,
      token: decoded.token,
    };
  } catch (err) {
    logger.error('Auth Middleware Error:', err);
    return null;
  }
};
