import express from "express"
import { checks } from "../data/checks.js"
import getStatus from "../scripts/Status.js"
const router = express.Router()

router.get(`/`, (req,res) =>{
    const status = req.query.status//gets the argument like id = "pending"
    let result
    if (status) {
        result = checks.filter((check) => {
            return check.status === status
        })
    } else {
        result = checks
    }
    if (result.length === 0){
        return res.status(404).json({"Error" : "No users"})
    }
    res.status(200).json({"checks" : result})
})

router.get(`/summary`, (req, res) => {
    console.time("first start")
    let pending = 0
    let complete = 0
    let failed = 0
    for (let i = 0; i < checks.length; i++) {
        if (checks[i].status === `pending`) {
            pending++
        } else if (checks[i].status === `complete`) {
            complete++
        } else if (checks[i].status === `failed`) {
            failed++
        }
        else{
            console.log("internal sever error")
            console.log("Issue found with having a value being not pending,complete,failed")
        }
    }
    console.timeEnd("first start")
    res.status(200).json({ pending, complete, failed })
})

router.get(`/fastsummary`, async (req, res) => {
    console.time("fast start")
    const [pending, complete, failed] = await Promise.all([
        getStatus(checks, "pending"),
        getStatus(checks, "complete"),
        getStatus(checks, "failed")
    ])
    console.timeEnd("fast start")
    res.status(200).json({ pending, complete, failed })
})

router.get('/FastSummary',(req,res) =>{
    const prom = []
    prom.push()
})


//this function will group by user in the checks array as same users may have severeal entries
//we wil need to store it as a map
router.get(`/user`,(req,res) => {
    const userMap = new Map()
    for (let i = 0; i < checks.length; i++) {
        const userId = checks[i].userId
        if (userMap.has(userId)) {
            userMap.get(userId).push(checks[i])
        } else {
            userMap.set(userId, [checks[i]])
        }
    }
    if (!userMap){
        return res.status(404).json({"Error" : "Scary we have a null value for Map"})
    }
    if (userMap.length === 0){
        return res.status(400).json({"error" : "no entries"})
    }
    res.status(200).json({ users: Object.fromEntries(userMap) })
})
//we are going to order by time
router.get('/time' , (req,res)=>{
    const orderedByTime = [...checks].sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
    });
    res.status(200).json({"users": orderedByTime})
})
export default router