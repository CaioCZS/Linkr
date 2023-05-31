import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  getUserById,
  getUserByEmail,
} from "../repository/auth.repository.js";
import {
  createSession,
  getSessionByToken,
} from "../repository/session.repository.js";

const key = process.env.JWT_SECRET || "super_secret_key";

export async function signUp(req, res) {
  try {
    const { email } = req.body;
    const { rows } = await getUserByEmail(email);

    if (rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    await createUser(req.body);

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function signIn(req, res) {
  try {
    console.log("LOGUEMO");
    const { email, password } = req.body;

    const { rows } = await getUserByEmail(email);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, key);

    await createSession(user.id, token);

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function signOut(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    await deleteSession(token);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUser(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const session = await getSessionByToken(token);

    if (!session) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await getUserById(session.user_id);

    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUserByParams(req, res) {
  const { id } = req.params;

  try {
    const token = req.headers.authorization.split(" ")[1];

    const session = await getSessionByToken(token);

    if (!session) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await getUserById(id);

    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
