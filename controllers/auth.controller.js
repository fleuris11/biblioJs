import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";


const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;



const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const signAccess = (user) => {
  if (!ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET not set. Add it to your .env");
  }
  return jwt.sign({ sub: user.id, email: user.email }, ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" });
};

const signRefresh = (user) => {
  if (!REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET not set. Add it to your .env");
  }
  return jwt.sign(
    { sub: user.id, email: user.email, type: "refresh" },
    REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );
};

export const AuthController = {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;

      const exists = await UserModel.findByEmail(email);
      if (exists) return res.status(409).json({ message: "Email already used" });

      const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
      const password_hash = await bcrypt.hash(password, rounds);

      const user = await UserModel.create({ email, password_hash });

      return res.status(201).json({
        message: "User created",
        user: { id: user.id, email: user.email },
      });
    } catch (e) {
      next(e);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });

      const access_token = signAccess(user);
      const refresh_token = signRefresh(user);

      return res.json({ access_token, refresh_token });
    } catch (e) {
      next(e);
    }
  },

  async refresh(req, res, next) {
    try {
      const { refresh_token } = req.body;

      let payload;
      try {
        payload = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
      } catch {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      if (payload.type !== "refresh") {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const user = { id: payload.sub, email: payload.email };
      const access_token = signAccess(user);
      const new_refresh_token = signRefresh(user);

      return res.json({ access_token, refresh_token: new_refresh_token });
    } catch (e) {
      next(e);
    }
  },
};
