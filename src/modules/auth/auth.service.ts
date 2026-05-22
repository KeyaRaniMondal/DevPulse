import bcrypt from "bcrypt";
import { pool } from "../../config/db";
import { env } from "../../config/env";
import { generateToken } from "../../utils/jwt";

export const signupUser = async (payload: any) => {
  const existing = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [payload.email]
  );

  if (existing.rows.length > 0) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    env.SALT_ROUNDS
  );

  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,role)
    VALUES($1,$2,$3,$4)
    RETURNING id,name,email,role,created_at,updated_at
    `,
    [
      payload.name,
      payload.email,
      hashedPassword,
      payload.role
    ]
  );

  return result.rows[0];
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const matched = await bcrypt.compare(
    password,
    user.password
  );

  if (!matched) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    id: user.id,
    name: user.name,
    role: user.role
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  };
};