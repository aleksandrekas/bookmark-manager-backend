import express from "express"
import signRouter from './routes/sign.mjs'
import loginRouter from "./routes/login.mjs";
import { database } from "./db.mjs";
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import getBookmarks from "./routes/getBookmarks.mjs";
import refreshRouter from "./routes/refresh.mjs";
import example from "./routes/test.mjs";
import addBookmarkRouter from "./routes/addBookmark.mjs";
import editBookmarkRouter from "./routes/editBookmark.mjs";
import archiveRoute from "./routes/archive.mjs";
import editRouter from "./routes/edit.mjs";
import deleteRouter from "./routes/delete.mjs";


dotenv.config()




const app = express()
const port = 3000;
app.use(express.json())
app.use(cookieParser())


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true
}));






database.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('ggs nice work')
    }
})

app.use("/api/sign", signRouter)
app.use("/api/login", loginRouter)
app.use("/api/bookmarks", getBookmarks)
app.use("/api/refresh", refreshRouter)
app.use("/api/example",example)
app.use("/api/addBookmark",addBookmarkRouter)
app.use("/api/test",example)
app.use("/api/editBookmark",editBookmarkRouter)
app.use("/api/archive",archiveRoute)
app.use("/api/edit",editRouter)
app.use("/api/delete",deleteRouter)




app.listen(port,()=>{
    console.log(`runing on ${port}`)
})