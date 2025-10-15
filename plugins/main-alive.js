if (global.aliveCommandLoaded) return;
global.aliveCommandLoaded = true;

const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
  pattern: "alive",
  alias: ["status", "online", "a", "active"],
  desc: "Check bot is alive or not with live line updates",
  category: "main",
  react: "🥰",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Lines to add one by one
    const lines = [
      "*ASSALAMUALAIKUM ☺️*",
      "\n*KESE HAI AP 😇*",
      "\n*UMEED HAI KE AP KHARIYAT SE HOGE AUR BEHTAR HOGE 🥰*",
      "\n*AUR APKE GHAR ME BHI SAB KHARIYAT SE HOGE 🥰*",
      "\n*DUWA KRE GE APKE LIE 🤲*",
      "\n*ALLAH AP SAB KO HAMESHA KHUSH RAKHE AMEEN 🤲*",
      "\n*ALLAH AP SAB KI MUSHKIL PARSHANIYA DOOR KARE AMEEN 🤲*",
      "\n*AP APNA BAHUT KHAYAL RAKHIA KARO 🥰*",
      "\n*AUR HAMESHA KHUSH RAHA KARO 🥰*",
      "\n*Q K APKI SMILE BAHUT PYARY HAI MASHALLAH ☺️*",
      "\n*IS LIE APNE CHEHRE PER HAR WAKAT SMILE RAKHO 🥰*",
      "\n*KABHI SAD MAT HOYE 🥺♥️*",
      "\n\n*👑 BILAL-MD WHATSAPP BOT 👑*"
    ];

    // Start with an empty message
    let currentText = "";
    const msg = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

    // Add each line cumulatively every 3 seconds
    for (const line of lines) {
      currentText += line + "\n";  // append new line to previous lines
      await sleep(3000);           // wait 3 seconds
      await conn.relayMessage(from, {
        protocolMessage: {
          key: msg.key,
          type: 14,
          editedMessage: { conversation: currentText }  // update same message
        }
      }, {});
    }

  } catch (e) {
    console.error("*ALIVE CMD ERROR 🥺*", e);
    reply(`*ALIVE CMD ERROR 🥺* ${e.message}`);
  }
});