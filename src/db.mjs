import pg, { Connection } from "pg";


const {Pool} = pg

export const database = new Pool({
    ConnectionString:`//postgres:${process.env.DB_PASS}@db.qwqmhfywgttvhlkbxvhx.supabase.co:5432/postgres`,
    ssl:{
        rejectUnauthorized:false
    }
})
