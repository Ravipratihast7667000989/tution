import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      image: user.image,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
