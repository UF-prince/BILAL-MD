// 🔥 Code by WHITESHADOW
const { cmd } = require('../command');
const { runtime, sleep } = require('../lib/functions');

cmd({
  pattern: "uptime",
  alias: ["runtime", "utime", "upt", "upti", "uptim", "uptimes"],
  desc: "Show bot uptime with live updates every 1 second for 30 minutes",
  category: "main",
  react: "🔰",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // 🥺 React at command start
    await conn.sendMessage(from, { react: { text: '🥺', key: m.key } });

    // ⏱️ Initial waiting message
    const msg = await conn.sendMessage(from, {
      text: `*UPTIME CHECK HO RAHA HAI...🥰*`
    }, { quoted: mek });

    // 🔁 30 minutes = 1800 updates (1 per second)
    for (let i = 0; i < 1800; i++) {
      const up = runtime(process.uptime());
      await sleep(1000); // 1 second delay

      await conn.relayMessage(from, {
        protocolMessage: {
          key: msg.key,
          type: 14,
          editedMessage: {
            conversation: `*👑 UPTIME :❯ ${up} 👑*`
          }
        }
      }, {});
    }

    // ☺️ React at end
  } catch (e) {
    console.error("*DUBARA ❮uptime❯ LIKHO 🥺*", e);
    await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
    reply(`*DUBARA ❮uptime❯ LIKHO 🥺*`);
  }
});