// code by WHITESHADOW 

const axios = require("axios");
const { cmd } = require("../command");
const { sleep } = require('../lib/functions');

cmd({
  pattern: "screenshot",
  react: "☺️",
  alias: ["ss", "ssweb"],
  desc: "Capture a full-page screenshot of a website.",
  category: "main",
  use: ".screenshot <url>",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const url = args[0];
    if (!url) return reply("*APKO KISI WEBSITE KA SCREENSHOT CHAHYE 🥺* \n *TO AP ESE LIKHO ☺️* \n \n*SS ❮APKI WEBSITE KA LINK❯* \n\n*JAB AP ESE LIKHO GE 🥺 TO APKI WEBSITE KA SCREENSHOT LE KER ☺️ YAHA PER BHEJ DIYA JAYE GA 🥰*");
    if (!url.startsWith("http")) return reply("*AP NE GHALAT LINK LIKHA HAI 🥺*");

    // ASCII loading bars with percentage
    const loadingBars = [
        { percent: 10, bar: "*[▓░░░░░░░░░]*", text: "*✦ CAPTURING...🥺" },
        { percent: 20, bar: "*[▓▓░░░░░░░░]*", text: "*✦ CONNECTING TO WEBSITE...🌹*" },
        { percent: 30, bar: "*[▓▓▓░░░░░░░]*", text: "*✦ LOADING WEBSITE PAGE....😃*" },
        { percent: 40, bar: "*[▓▓▓▓░░░░░░]*", text: "*✦ TESTING WEBSITE....☺️*" },
        { percent: 50, bar: "*[▓▓▓▓▓░░░░░]*", text: "*✦ TESTING LINK...🙂*" },
        { percent: 60, bar: "*[▓▓▓▓▓▓░░░░]*", text: "*✦ SHOWING....😊*" },
        { percent: 70, bar: "*[▓▓▓▓▓▓▓░░░]*", text: "*✦ CROPPING WEBSITE PAGE...😥" },
        { percent: 80, bar: "*[▓▓▓▓▓▓▓▓░░]*", text: "✦ Finalizing screenshot..." },
        { percent: 90, bar: "*[▓▓▓▓▓▓▓▓▓░]*", text: "*✦ SENDING SCREENSHOT...😎*" },
        { percent: 100, bar: "*[▓▓▓▓▓▓▓▓▓▓]*", text: "*✦ COMPLETED BY BILAL-MD 👑*" }
    ];

    // Send initial message
    const loadingMsg = await conn.sendMessage(from, {
        text: "*WEBSITE KA SCREENSHOT LIA JA RAHA HAI...☺️*"
    }, { quoted: mek });

    // Animate loading progress
    for (const frame of loadingBars) {
        await sleep(800);
        await conn.relayMessage(from, {
            protocolMessage: {
                key: loadingMsg.key,
                type: 14,
                editedMessage: {
                    conversation: `*👑 ${frame.bar} ${frame.percent}%\n${frame.text} 👑*`
                }
            }
        }, {});
    }

    // Final update before sending
    await sleep(800);
    await conn.relayMessage(from, {
        protocolMessage: {
            key: loadingMsg.key,
            type: 14,
            editedMessage: {
                conversation: "*WEBSITE KA SCREENSHOT LE LIA GAYA HAI 🥺 AB YAHA PER SEND HO RAHA HAI....☺️*"
            }
        }
    }, {});

    await sleep(1000);

    // Send the actual screenshot
    await conn.sendMessage(from, {
        image: { url: `https://image.thum.io/get/fullpage/${url}` },
        caption: "*👑 SCREENSHOT BY 👑*\n" +
                "*👑 BILAL-MD WHATSAPP BOT 👑*"
    }, { quoted: mek });

  } catch (error) {
    console.error("*DUBARA KOSHISH KARE 😔*", error);
    reply("*DUBARA KOSHISH KARE 😔*");
  }
});

// KEITH-XMD
