import express from "express"
import { exec } from "child_process"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/status", (req, res) => {
    exec("top -b -n 1", (error, stdout, stderr) => {
        if(!error) {
            res.send(stdout)
            return
        }

        console.log(error)
        console.log(stderr)
        res.status(502).json({error, stderr})
    })
})

app.post("/run", (req, res) => {
    exec(req.body.command, (error, stdout, stderr) => {
        if(!error) {
            res.send(stdout)
            return
        }

        res.status(502).json({error, stderr})
    })
})


async function startup() {
    console.log("starting...")
    exec("hostname", async (error, stdout, stderr) => {
        if(error) {
            console.log(error, stdout, stderr)
            process.exit(1)
        }

        let response = await fetch("http://192.1.1.50:2323/register", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name: stdout.replace(/[\r\n]/g, "")
            })
        })
    
        let confirmation = await response.json()
    
        console.log(confirmation)
    
        app.listen(2324, () => {
            console.log("listening")
        })
    })
}

startup()
