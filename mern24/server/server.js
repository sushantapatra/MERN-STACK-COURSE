const express = require("express");
const app = express();

app.get("/", (req, res) => {
	res.status(200).send("Welcome to Mern Stack");
});

const PORT = 8080;
app.listen(PORT, () => {
	console.log(`server running at port : ${PORT}`);
});
