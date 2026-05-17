import pg, { Connection } from "pg";


const {Pool} = pg

export const database = new Pool({
    connectionString: `postgresql://postgres.qwqmhfywgttvhlkbxvhx:${process.env.DB_PASS}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`,
    ssl:{
        rejectUnauthorized:false
    }
})

