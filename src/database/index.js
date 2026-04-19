/**
 * Loads Sequelize models and associations (single import point for scripts / app).
 */
import sequelize from "../config/db.js";
import db from "./models/index.js";

export { sequelize };
export default db;
