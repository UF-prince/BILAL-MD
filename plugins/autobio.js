const { cmd } = require("../command");

// 🧠 Auto Bio Updater
cmd({
  pattern: "autobio",
  alias: ["bioauto", "setautobio"],
  desc: "Show or set auto bio status (on/off).",
  category: "owner",
  react: "🥺",
  filename: __filename
}, async (conn, m, store, { args }) => {
  try {
    // 🥺 React on command
    await conn.sendMessage(m.chat, { react: { text: '🥺', key: m.key } });

    // Sirf owner check
    if (!m.key.fromMe) return m.reply("❌ Sirf owner hi is command ka use kar sakta hai!");

    const state = args[0]?.toLowerCase();

    // Agar argument missing ya invalid ho
    if (!state || !["on", "off"].includes(state)) {
      return m.reply(`*AUTOBIO ON KARNE SE 🥺 APKI WHATSAPP KI BIO ☺️ AUTO UPDATE HOTI RAHE GE 🥰 AP ISKO OFF BHI KAR SAKTE HAI 😇*\n*JESE ☺️* \n*❮AUTOBIO ON❯*\n*❮AUTOBIO OFF❯*\n\n*ABHI APKI AUTOBIO ${global.autoBio ? "ON" : "OFF"} HAI ☺️*`);
    }

    // State set karo
    global.autoBio = state === "on";

    // Agar on hai to bio update start karo
    if (state === "on") updateBio(conn);

    // Success react on command message
    await conn.sendMessage(m.chat, { react: { text: '☺️', key: m.key } });

    return m.reply(`*AUTO BIO AB ${state.toUpperCase()} HO CHUKI HAI ☺️*`);
    
  } catch (e) {
    console.error("❌ AutoBio Error:", e);
    await conn.sendMessage(m.chat, { react: { text: '😔', key: m.key } });
    return m.reply("*DUBARA KOSHISH KARE 🥺*");
  }
});

// 🕐 Bio Updater Function
async function updateBio(conn) {
  if (!global.autoBio) return;

  try {
    const uptime = process.uptime();
    const muptime = clockString(uptime * 1000);
    const botname = global.config?.botname || "BILAL-MD";

    const bio = `👑 I AM ACTIVE NOW (${muptime}) 👑`;
    await conn.updateProfileStatus(bio);
    console.log(`BILAL-MD BIO UPDATED: ${bio}`);
  } catch (err) {
    console.error("⚠️ Failed to update bio:", err.message);
  }

  // Har 1 minute baad update
  setTimeout(() => updateBio(conn), 60 * 1000);
}

// ⏱️ Time Formatter
function clockString(ms) {
  const d = Math.floor(ms / 86400000);
  const h = Math.floor(ms / 3600000) % 24;
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;

  let str = "";
  if (d) str += `${d}D `;
  if (h) str += `${h}H `;
  if (m) str += `${m}M `;
  if (s) str += `${s}S`;
  return str.trim();
}