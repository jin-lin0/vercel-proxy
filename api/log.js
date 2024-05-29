import { MongoClient } from "mongodb";
import axios from "axios";

export default async (req, res) => {
  try {
    const client = await MongoClient.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db("vercel");
    const collection = db.collection("log");

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const { method, url } = req;
    const userAgent = req.headers["user-agent"];
    const ipinfoToken = process.env.IPINFO_TOKEN;
    const geoInfo = await axios.get(`https://ipinfo.io/${ip}/geo`, {
      headers: { Authorization: `Bearer ${ipinfoToken}` },
    });

    console.log(geoInfo.data);
    console.log(ip);
    console.log(req.headers["x-forwarded-for"]);

    const logEntry = {
      ip,
      method,
      url,
      userAgent,
      timestamp: new Date().toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
      }),
    };
    await collection.insertOne(Object.assign({}, logEntry, geoInfo.data));
    res.status(200).json(logEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
