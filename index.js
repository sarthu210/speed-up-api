import express from "express";
import axios from "axios";
import redis from "redis";

const port = 3000;
const app = express();

let newclinet;
(async () => {
    newclinet = redis.createClient();

    newclinet.on("error", (error) => {
        console.log(error);
    });
    await newclinet.connect();
})();

app.get("/get-data", async (req, res) => {
    
    try {
        const cacheData = await newclinet.get("getData");

        if (cacheData) {
            return res.status(200).json({ data: JSON.parse(cacheData) });
        }

        const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
        const getData = response.data;
        await newclinet.set("getData", JSON.stringify(getData));

        return res.status(200).json({data: response.data});
    } 
    catch (error) {
        console.error(error); 
        return res.status(500).json({ error: "not responding" });
    }
});

app.listen(port, () => {
    console.log(`app is running on ${port}`);
});
