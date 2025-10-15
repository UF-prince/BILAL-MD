// code by WHITESHADOW
const { cmd } = require('../command');
const { runtime, sleep } = require('../lib/functions');

cmd({
  pattern: "uptime",
  alias: ["runtime", "up"],
  desc: "Show bot uptime with live updates",
  category: "main",
  react: "⏱️",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Send initial message
    const msg = await conn.sendMessage(from, {
      text: `⏳ Calculating uptime...`
    }, { quoted: mek });

    // Update loop: update message every second for 60 seconds
    for (let i = 0; i < 60; i++) {
      const up = runtime(process.uptime());
      const barLength = 20; // Length of ASCII bar
      const progress = Math.floor((i / 60) * barLength);
      const bar = "▓".repeat(progress) + "░".repeat(barLength - progress);

      await sleep(1000); // wait 1 second
      await conn.relayMessage(from, {
        protocolMessage: {
          key: msg.key,
          type: 14,
          editedMessage: {
            conversation: `⏱️ UPTIME: ${up}\n[${bar}] ${Math.floor((i / 60) * 100)}%`
          }
        }
      }, {});
    }

    // Final message
    const finalUptime = runtime(process.uptime());
    await conn.relayMessage(from, {
      protocolMessage: {
        key: msg.key,
        type: 14,
        editedMessage: {
          conversation: `✅ UPTIME: ${finalUptime}\n✦ Bot is running smoothly!`
        }
      }
    }, {});

  } catch (e) {
    console.error("Uptime Error:", e);
    reply(`❌ Error: ${e.message}`);
  }
});
