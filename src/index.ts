import express from "express"
import dotenv from "dotenv"

const app = express()

const init = async () => {
  dotenv.config()

  const port = process.env.PORT || 3000

  app.get("/", (req, res) => res.send("Hello from Catch JSONL Parser!"))
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}

init()
