export default function trim(req, res, next) {
  const exceptions = ['password'];

  Object.keys(req.body).forEach((key) => {
    if (!exceptions.includes(key) && typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim();
    }
  });

  next();
};
