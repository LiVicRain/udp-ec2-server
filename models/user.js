const pool = require("../databases/mysql");
const SQL = require("sql-template-strings");

class User {
  async getById(id) {
    const conn = await pool.getConnection();
    try {
      const sql = SQL`
      SELECT * FROM users
       WHERE id = ${id};
      `;
      const [rows] = await conn.query(sql);
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      conn.release();
    }
  }

  async getByUniqueIdentifier(unique_identifier) {
    const conn = await pool.getConnection();
    try {
      const sql = SQL`
      SELECT * FROM users
       WHERE unique_identifier = ${unique_identifier};
      `;
      const [rows] = await conn.query(sql);
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      conn.release();
    }
  }

  async create(user) {
    const { id, name, email, profile_image, pick_point, gender, birth_date, phone_number, type, login_platform, unique_identifier, jwt_refresh_token } = user;
    const conn = await pool.getConnection();
    try {
      const sql = SQL`
      INSERT INTO users
        (id, name, email, profile_image, pick_point, gender, birth_date,
        phone_number, type, login_platform, unique_identifier, jwt_refresh_token, 
        create_at, update_at) VALUES (
          ${id},
          ${name},
          ${email},
          ${profile_image},
          ${pick_point},
          ${gender},
          ${birth_date},
          ${phone_number},
          ${type},
          ${login_platform},
          ${unique_identifier},
          ${jwt_refresh_token},
          NOW(),
          NOW()
        );
      SELECT * FROM users
        WHERE id = ${id};
    `;
      const [rows] = await conn.query(sql);
      return rows[1][0];
    } catch (error) {
      throw error;
    } finally {
      conn.release();
    }
  }

  async updateProfile(id, user) {
    const { name, profile_image, gender, birth_date, phone_number } = user;
    const conn = await pool.getConnection();
    try {
      const sql = SQL`
      UPDATE users SET
        name = ${name},
        profile_image = ${profile_image},
        gender = ${gender},
        birth_date = ${birth_date},
        phone_number = ${phone_number},
        update_at = NOW()
        WHERE id = ${id};
        SELECT * FROM users
        WHERE id = ${id};
        `;
      const [rows] = await conn.query(sql);
      return rows[1][0];
    } catch (error) {
      throw error;
    } finally {
      conn.release();
    }
  }

  async updateToken(id, refreshToken) {
    const conn = await pool.getConnection();
    try {
      const sql = SQL`
        UPDATE users SET
          jwt_refresh_token = ${refreshToken},
          update_at = NOW()
          WHERE id = ${id};
        SELECT * FROM users
        WHERE id = ${id};
      `;
      await conn.query(sql);
      const [rows] = await conn.query(sql);
      return rows[1][0];
    } catch (error) {
      throw error;
    } finally {
      conn.release();
    }
  }

  async delete(id) {
    const conn = await pool.getConnection();
    try {
      const sql = SQL`
      DELETE FROM users
        WHERE id = ${id}`;
      const [result] = await conn.query(sql);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    } finally {
      conn.release();
    }
  }
}

module.exports = new User();
