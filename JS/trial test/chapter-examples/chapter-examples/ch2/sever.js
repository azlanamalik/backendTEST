import express from "express";
import checkrouter from "./routes/checks.js";
import { checks } from "./data/checks.js";
const app = express()
app.use(express.json())
let nextId = 1
const PORT = 3000

app.get(`/health`, (req,res)=>{
    res.status(200).json({"Message" : "ok"})

})
app.use('/checks' , checkrouter)
app.post(`/health`,(req,res)=>{
    const reqbodyname = req.body?.name
    if (!reqbodyname){
        return res.status(400).json({"Message":"Name field required"})
    } 
    const check = {id: String(nextId++) , reqbodyname, status : `pending`}//nextid is postfix so it will be next after
    checks.push(check)
    res.status(201).json({"Message": "successfully created"})
})

app.get(`/health/:id` , (req,res) =>{
    const inpid = req.params.id
    const IsInChecks = checks.filter((c) =>{
        return c.id === inpid
    })
    if (IsInChecks.length === 0){
        return res.status(404).json({"Message":"user not found"})
    }
    res.status(200).json({"Details": IsInChecks})
})
app.get(`/score`, (req,res) =>{
    const pass = req.query.status
    let final_arr;
    if (pass === "pass"){
        final_arr = checks.filter((check) => {
            if (check.score === null){
                return false
            }
            else{
                return check.score > 0.5
            }
        })
    }else if (pass === "fail") {
        final_arr = checks.filter((check) => {
            if (check.score === null){
                return false
            }
            else{
                return check.score < 0.5
            }
        })
        
    }else{
        return res.status(404).json({"error"  : "error in the parsing of the parameters"})
    }
    if (!final_arr){
        return res.status(404).json({"error" : "evil sever error NULL assign"})
    }
    res.status(200).json({"message" : final_arr})


})


app.listen(PORT, ()=>{
    console.log(`Server started on ${PORT}`)
})
