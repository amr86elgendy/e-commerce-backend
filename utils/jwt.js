import jwt from 'jsonwebtoken';

export const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  return token;
};

export const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

export const attachCookiesToResponse = ({ res, user }) => {
  
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;
  
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    // domain: 'https://elgendy-admin-dashboard.vercel.app/',
    signed: true,
  });
};

