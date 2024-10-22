// db.js
import mysql from 'mysql2';

const db = mysql.createPool({
  host: 'vm4317.tmdcloud.com',
  user: 'enterpr4_demo',
  password: 'Demo@13$%@#*',
  database: 'enterpr4_demo'
});

export async function getTasks() {
  const [rows] = await db.query('SELECT * FROM logs');
  return rows;
}

// Similarly, you can add updateTask and deleteTask functions
