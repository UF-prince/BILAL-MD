const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fancy",
  alias: ["font", "style", "textfont", "fancyname", "ftext", "fancymsg", "fonts"],
  react: "🥺",
  desc: "Convert text into various fancy fonts.",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, quoted, args, q, reply }) => {
  try {
    if (!q) {
      return reply(
        "*APKO APNE NAME KO FANCY TEXT ME STYLISH BANANA HAI ☺️♥️*\n" +
        "*TO AP ESE LIKHO 🥰🌹*\n\n" +
        "*❮FANCY BILAL-MD❯*\n\n" +
        "*JAB ESE LIKHE GE TO APKA NAMES FANCY TEXT ME SHOW HOGE ☺️♥️*"
      );
    }

    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(q)}`;
    const response = await axios.get(apiUrl);

    if (!response.data.status || !response.data.result) {
      await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
      return reply("*DUBARA KOSHISH KARE 🥺💓*");
    }

    // ✅ Sirf font text show karega
    const fonts = response.data.result.map(item => item.result).join("\n\n");

    const resultText = `*APKE NAME KE FANCY TEXT ☺️💞*\n\n${fonts}\n\n*👑 BILAL-MD WHATSAPP BOT 👑*`;

    // Send fancy text result
    await conn.sendMessage(from, { text: resultText }, { quoted: m });

    // 😊 Success reaction
    await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });

  } catch (error) {
    console.error("❌ Fancy command error:", error.message);

    // 😔 Error reaction + message
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
    reply("*DUBARA KOSHISH KARE 🥺💓*");
  }
});
