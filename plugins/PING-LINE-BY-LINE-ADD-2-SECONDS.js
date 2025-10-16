const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
  pattern: "ping",
  desc: "Check bot response with live line updates",
  category: "main",
  react: "🥰",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // 🥺 React jab command chale
    await conn.sendMessage(from, { react: { text: '🥰', key: m.key } });

    // 💬 Lines jo 1 msg me 2 seconds gap se update hoti jayengi
    const lines = [
      "*ASSALAMUALAIKUM ☺️*",
      "\n*KESE HAI AP ☺️*",
      "\n*UMEED HAI KE AP KHARIYAT SE HOGE INSHALLAH 🤲🥰*",
      "\n*ALLAH APKO AUR APKE CHAHNE WALO KO HAMESHA KHUSH RAKHE AMEEN 🤲🥰*",
      "\n*APNA KHAYAL RKHO AUR KHUSH RAHO AMEEN 🤲🥰*",
      "\n*AUR BATAYE KESE GUZAR RAHI HAI APKI ZINDAGI 🥰*",
      "\n*NAMAZ BHI PARHA KARO 🥰💞*",
      "\n*AUR QURAN MAJEED KI TILAWAT BHI KIA KARO 🥰💞*",
      "\n*ALLAH PAK KI IBADAT BHI KIA KARO 🥰💞*",
      "\n*BEE HAPPY MY DEAR ☺️💞*"
    ];

    // 🌸 Empty message bhejna
    let currentText = "";
    const msg = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

    // 🕒 Har 2 seconds me line add hoti rahegi
    for (const line of lines) {
      currentText += line + "\n";
      await sleep(2000); // 2 seconds delay
      await conn.relayMessage(from, {
        protocolMessage: {
          key: msg.key,
          type: 14,
          editedMessage: { conversation: currentText }
        }
      }, {});
    }

    // ☺️ End me confirm react
    await conn.sendMessage(from, { react: { text: '😇', key: m.key } });

  } catch (e) {
    console.error("Ping command error:", e);
    await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
    reply("*ERROR: DUBARA KOSHISH KARE 😔*");
  }
});