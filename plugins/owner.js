const config = require('../config');
const { cmd } = require('../command');

cmd({
  pattern: "owner",
  desc: "Show bot owner contact info",
  category: "info",
  react: "😎",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const ownerName = config.BOT_NAME || "Bot Owner";
    const ownerNumber = config.OWNER_NUMBER || "0000000000";

    // 💬 Send text reply only
    const msgText = `*👑 OWNER NAME 👑* \n *${ownerName}* \n*👑 OWNER NUMBER 👑* \n *${ownerNumber}*`;

    await conn.sendMessage(from, { text: msgText }, { quoted: mek });

    // 😎 React on command message
    await conn.sendMessage(from, { react: { text: "😎", key: m.key } });

  } catch (err) {
    console.error("❌ Owner command error:", err);
    reply("❌ Failed to show owner info!");
  }
});
