import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";

const filename= fileURLToPath(import.meta.url);
const dirname= path.dirname(filename);
dotenv.config({ path: path.resolve(dirname, "../../.env") });


class Auth {
  static generateAccessToken(user) {
    const payload = { id: user._id, email: user.email, name: user.name };
    return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  }
    static generateRefreshToken(user) {
        const payload = { id: user._id, email: user.email };
        return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    }
  
static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);    
    } catch (error) {
      throw new Error("Invalid or expired access token");
    }
    }
    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
        } catch (error) {
            throw new Error("Invalid or expired refresh token");
        }
    }
}   

export default Auth;