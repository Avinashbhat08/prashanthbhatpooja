import { setCorsHeaders, signToken } from '../_lib/jwt.js';
import { defaultUsers } from '../_lib/store.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const matchedUser = defaultUsers.find((u) => u.email.toLowerCase() === email);

    if (!matchedUser || matchedUser.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken({
      id: matchedUser.id,
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
      },
    });
  } catch (error) {
    console.error('Login handler error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error while logging in' });
  }
}
