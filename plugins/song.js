const { cmd } = require('../command');
const fetch = require('node-fetch');
const yts = require('yt-search');

cmd({
  pattern: "song",
  alias: ["play", "mp3", "audio", "music", "s", "so", "son", "songs"],
  react: "🎶",
  desc: "Download YouTube song (Audio) via Nekolabs API",
  category: "download",
  use: ".song <query>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("*AP KO KOI AUDIO DOWNLOAD KARNI HAI 🥺*\n*TO AP ESE LIKHO ☺️*\n\n*PLAY ❮APKE AUDIO KA NAM❯*\n\n*AP COMMAND ❮PLAY❯ LIKH KAR USKE AGE APNE AUDIO KA NAM LIKH DO ☺️ FIR WO AUDIO DOWNLOAD KAR KE YAHA PER BHEJ DE JAYE GE 🥰💞*");

    // 🔹 API Call (Nekolabs)
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    // ✅ Validate response
    if (!data?.success || !data?.result?.downloadUrl) {
      return reply("*APKA AUDIO NAHI MILA 🥺❤️*");
    }

    const meta = data.result.metadata;
    const dlUrl = data.result.downloadUrl;

    // 🔹 Try fetching the thumbnail
    let buffer;
    try {
      const thumbRes = await fetch(meta.cover);
      buffer = Buffer.from(await thumbRes.arrayBuffer());
    } catch {
      buffer = null;
    }

    // 🔹 Song info card
    const caption = `*👑 AUDIO INFO 👑*
*👑 NAME :❯ ${meta.title}*
*👑CHANNEL :❯ ${meta.channel}*
*👑 TIME :❯ * ${meta.duration}*
*👑 BILAL-MD WHATSAPP BOT 👑*`;

    // 🖼️ Send thumbnail + info
    await conn.sendMessage(from, {
      image: buffer,
      caption
    }, { quoted: mek });

    // 🎧 Send MP3 file
    await conn.sendMessage(from, {
      audio: { url: dlUrl },
      mimetype: "audio/mpeg",
      fileName: `${meta.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp3`
    }, { quoted: mek });

  } catch (err) {
    console.error("*DUBARA KOSHISH KARO 🥺❤️*", err);
    reply("*DUBARA KOSHISH KARO 🥺❤️*");
  }
});
