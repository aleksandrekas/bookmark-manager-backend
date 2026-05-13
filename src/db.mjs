import mysql from "mysql2";




export const database = mysql.createConnection({
    host:'db.qwqmhfywgttvhlkbxvhx.supabase.co',
    user:'postgres',
    password:'CswkSaFa3T2zNi6E',
    database:'postgres'
})
