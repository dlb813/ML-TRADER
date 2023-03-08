import dotenv from "dotenv";
dotenv.config()
import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
const app = express();
app.use(cors());
const port = 3000;
import OpenAI from "openai-api";

const OPENAI_API_KEY = 'API KEY';

const limiter = rateLimit({
	windowMs: 1000, 
	max: 5,
})

app.use(limiter)


app.get("/api/generate", async (req, res) => {
	try {

		const openai = new OpenAI(OPENAI_API_KEY);
		
		const searchString = `${req.query.q}`;
		console.log(searchString);
		(async () => {
			const gptResponse = await openai.complete({
				engine: "text-davinci-002",
				prompt: searchString,
				maxTokens: 64,
				temperature: 0,
				topP: 1,
				presencePenalty: 0,
				frequencyPenalty: 0,
				bestOf: 1,
				n: 1,
				stream: false,
			});
			console.log(gptResponse.data.choices[0].text);
		    res.send(gptResponse.data.choices[0].text);
			return
		})();
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: err.message,
		})
	}
})

app.listen(port, () => console.log(`Server listening on port ${port}`));