import secrets from "../../secrets.json" with { type: "json" };
import * as readline from "node:readline";
import process from "node:process";
import https from "node:https";
import * as fs from "node:fs";
// console.log(secrets);
const googleApiKey = secrets.apikeygoogle;
const cx = secrets.cx;
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
// rl.question("What is your question?", (input) => {
// 	encodedInput = encodeURIComponent(input);
// 	googleSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${cx}&q=${encodedInput}`;
// 	console.log(googleSearchUrl);
// 	https
// 		.get(googleSearchUrl, (res) => {
// 			res.setEncoding("utf8");
// 			let rawData = "";
// 			res.on("data", (chunk) => {
// 				rawData += chunk;
// 			});
// 			res.on("end", () => {
// 				try {
// 					const jsonData = JSON.parse(rawData);
// 					console.log(jsonData);
// 					let markdownData = "";
// 					for (const result of jsonData.items) {
// 						if (result.link.includes("stackoverflow")) {
// 							console.log(result.link);
// 							const link = result.link;
// 							const re = /questions\/(\d+)\//gm;
// 							const matches = [...link.matchAll(re)];
// 							const answersApiUrl = `https://api.stackexchange.com/2.3/questions/${matches[0][1]}/answers?order=desc&sort=activity&site=stackoverflow&filter=!SVaIDoFj13J(oaHlhy`;
// 							const questionsApiUrl = `https://api.stackexchange.com/2.3/questions/${matches[0][1]}?order=desc&sort=activity&site=stackoverflow&filter=!LaSRDK2naPjOAez8wiY29e`;
// 							console.log(answersApiUrl);
// 							console.log(questionsApiUrl);
// 							https.get(
// 								questionsApiUrl,
// 								{
// 									headers: {
// 										Accept: "application/json",
// 										"User-Agent": "curl/7.64.1",
// 									},
// 								},
// 								(res) => {
// 									let rawData = "";
// 									res.setEncoding("utf8");
// 									res.on("data", (chunk) => {
// 										rawData += chunk;
// 									});
// 									res.on("end", () => {
// 										console.log(res.headers);
// 										console.log(res.statusCode);
// 										const regexCode = /<pre><code>([\S\s]+?)<\/code><\/pre>/g;
// 										const substCode = `\`\`\`\n$1\`\`\``;
// 										const parsedData = JSON.parse(rawData);
// 										for (const question of parsedData.items) {
// 											markdownData += `# ${question.title}\n`;
// 											console.log(question.title);
// 											const body = question.body;
// 											const stripedBody = body.replace(regexCode, substCode);
// 											markdownData += stripedBody;
// 										}
// 										https.get(
// 											answersApiUrl,
// 											{
// 												headers: {
// 													Accept: "application/json",
// 													"User-Agent": "curl/7.64.1",
// 												},
// 											},
// 											(res) => {
// 												let rawData = "";
// 												res.setEncoding("utf8");
// 												res.on("data", (chunk) => {
// 													rawData += chunk;
// 												});
// 												res.on("end", () => {
// 													console.log(res.headers);
// 													console.log(res.statusCode);
// 													const parsedData = JSON.parse(rawData);
// 													for (const answer of parsedData.items) {
// 														const body = answer.body;
// 														const stripedBody = body.replace(
// 															regexCode,
// 															substCode,
// 														);
// 														markdownData += stripedBody;
// 													}
// 												});
// 											},
// 										);
// 									});
// 								},
// 							);

// https.get(result.link, (res) => {
// 	let rawData = "";
// 	res.on("data", (chunk) => {
// 		rawData += chunk;
// 	});
// 	res.on("end", () => {
// 		console.log(rawData);
// 	});
// });
// const pagemap = result.pagemap;
// if (pagemap) {
// 	if (pagemap.question) {
// 		const question = pagemap.question[0];
// 		if (question) {
// 			console.log("# Question");
// 			console.log(question.name);
// 			console.log(question.text);
// 			let anwserCount = 0;
// 			for (const answer of pagemap.answer) {
// 				console.log(`Answer ${anwserCount++}:`);
// 				console.log(answer.text);
// 			}
// 		}
// 	}
// }
// 						}
// 					}
// 				} catch (error) {
// 					console.error(error.message);
// 				}
// 			});
// 		})
// 		.on("error", (error) => {
// 			console.error(error.message);
// 		});
// 	rl.close();
// });
function fetchUrl(url, headers = {}) {
	return new Promise((resolve, reject) => {
		https
			.get(url, { headers }, (res) => {
				let rawData = "";
				res.setEncoding("utf8");
				res.on("data", (chunk) => {
					rawData += chunk;
				});
				res.on("end", () => {
					try {
						resolve(JSON.parse(rawData));
					} catch (error) {
						reject(error);
					}
				});
			})
			.on("error", (error) => {
				reject(error);
			});
	});
}

async function fetchStackOverflowData(questionId) {
	const headers = {
		Accept: "application/json",
		"User-Agent": "curl/7.64.1",
	};
	const regexCode = /<pre><code>([\S\s]+?)<\/code><\/pre>/g;
	const substCode = `\`\`\`\n$1\`\`\``;
	const regexCodeInline = /<code>([\S\s]+?)<\/code>/g;
	const substCodeInline = `**$1**`;
	const regexP = /<p>([\S\s]+?)<\/p>/g;
	const substP = `$1`;

	// API URLs for questions and answers
	const answersApiUrl = `https://api.stackexchange.com/2.3/questions/${questionId}/answers?order=desc&sort=activity&site=stackoverflow&filter=!SVaIDoFj13J(oaHlhy`;
	const questionsApiUrl = `https://api.stackexchange.com/2.3/questions/${questionId}?order=desc&sort=activity&site=stackoverflow&filter=!nNPvSNPI7A`;

	let markdownData = "";

	try {
		// Fetch question
		const questionData = await fetchUrl(questionsApiUrl, headers);
		console.log(questionData);
		for (const question of questionData.items) {
			markdownData += `# ${question.title}\n`;
			let body = question.body.replace(regexCode, substCode);
			body = body.replace(regexCodeInline, substCodeInline);
			body = body.replace(regexP, substP);
			markdownData += body;
		}

		// Fetch answers
		const answerData = await fetchUrl(answersApiUrl, headers);
		let count = 1;
		for (const answer of answerData.items) {
			if (count > 2) {
				break;
			}
			markdownData += `## Answer ${count}\n`;
			let body = answer.body.replace(regexCode, substCode);
			body = body.replace(regexCodeInline, substCodeInline);
			body = body.replace(regexP, substP);
			markdownData += body;
			count++;
		}
	} catch (error) {
		console.error("Error fetching data from StackOverflow:", error.message);
	}

	return markdownData;
}

async function main() {
	rl.question("What is your question? ", async (input) => {
		const encodedInput = encodeURIComponent(input);
		const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${cx}&q=${encodedInput}`;

		try {
			// Fetch Google Search results
			const searchResults = await fetchUrl(googleSearchUrl);
			let markdownData = "";

			const stackOverflowPromises = [];

			// Iterate through search results to find StackOverflow links
			for (const result of searchResults.items) {
				if (result.link.includes("stackoverflow")) {
					const re = /questions\/(\d+)\//gm;
					const matches = [...result.link.matchAll(re)];

					if (matches.length > 0) {
						const questionId = matches[0][1];
						stackOverflowPromises.push(fetchStackOverflowData(questionId));
					}
				}
			}

			// Wait for all StackOverflow data to be fetched
			const allMarkdownData = await Promise.all(stackOverflowPromises);
			markdownData += allMarkdownData.join("\n");

			// Save markdownData to a file
			fs.writeFileSync("output.md", markdownData, "utf8");
			console.log("Markdown data saved to output.md!");
		} catch (error) {
			console.error("Error:", error.message);
		} finally {
			rl.close();
		}
	});
}

main();
