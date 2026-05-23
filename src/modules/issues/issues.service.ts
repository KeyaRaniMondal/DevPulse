import { pool } from "../../config/db";

export const createIssue = async (
  payload: any,
  reporterId: number
) => {
  const result = await pool.query(
    `
    INSERT INTO issues(title,description,type,reporter_id)
    VALUES($1,$2,$3,$4)
    RETURNING *
    `,
    [
      payload.title,
      payload.description,
      payload.type,
      reporterId
    ]
  );

  return result.rows[0];
};

export const getAllIssues = async (
  sort = "newest",
  type?: string,
  status?: string
) => {
  let query = `SELECT * FROM issues`;
  const values: any[] = [];
  const conditions: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += ` ORDER BY created_at ${
    sort === "oldest" ? "ASC" : "DESC"
  }`;

  const issuesResult = await pool.query(query, values);

  const issues = issuesResult.rows;

  const reporterIds = [
    ...new Set(issues.map((i) => i.reporter_id))
  ];

  let reportersMap: any = {};

  if (reporterIds.length > 0) {
    const placeholders = reporterIds
      .map((_, i) => `$${i + 1}`)
      .join(",");

    const usersResult = await pool.query(
      `
      SELECT id,name,role
      FROM users
      WHERE id IN (${placeholders})
      `,
      reporterIds
    );

    usersResult.rows.forEach((u) => {
      reportersMap[u.id] = u;
    });
  }

  return issues.map((issue) => ({
    ...issue,
    reporter: reportersMap[issue.reporter_id]
  }));
};

export const getSingleIssue = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id]
  );

  const issue = result.rows[0];

  if (!issue) {
    return null;
  }

  const reporterResult = await pool.query(
    `
    SELECT id,name,role
    FROM users
    WHERE id = $1
    `,
    [issue.reporter_id]
  );

  return {
    ...issue,
    reporter: reporterResult.rows[0]
  };
};

export const updateIssue = async (
  id: number,
  payload: any
) => {
  const fields = [];
  const values = [];

  let index = 1;

  for (const key in payload) {
    fields.push(`${key} = $${index}`);
    values.push(payload[key]);
    index++;
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  values.push(id);

  const query = `
    UPDATE issues
    SET ${fields.join(",")}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const deleteIssue = async (id: number) => {
  await pool.query(
    `DELETE FROM issues WHERE id = $1`,
    [id]
  );
};