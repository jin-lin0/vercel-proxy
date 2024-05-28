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
    console.log(req.headers["x-forwarded-for"], req.connection.remoteAddress);
    const { method, url } = req;
    const userAgent = req.headers["user-agent"];
    const ipinfoToken = process.env.IPINFO_TOKEN;
    const geoInfo = await axios.get(`https://ipinfo.io/${ip}/geo`, {
      headers: { Authorization: `Bearer ${ipinfoToken}` },
    });

    const logEntry = {
      ip,
      method,
      url,
      userAgent,
      geoInfo: geoInfo.data,
      timestamp: new Date(),
    };
    await collection.insertOne(logEntry);
    res.status(200).json(logEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
