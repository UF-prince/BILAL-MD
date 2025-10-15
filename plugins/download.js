// download.js
// Crash-free download plugin for Heroku

const { fetchJson } = require("../lib/functions");
const cheerio = require("cheerio");
const axios = require("axios");
const { cmd, commands } = require('../command');

cmd({
  pattern: "tiktok",
  alias: ["tt"],
  desc: "TikTok download temporarily disabled",
  category: "download",
  filename: __filename
}, async (conn, m, store, { reply }) => {
  return reply("⚠️ TikTok download temporarily unavailable.");
});

cmd({
  pattern: "ig",
  alias: ["insta", "Instagram"],
  desc: "To download Instagram videos.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("*KISI BHI INSTAGRAM VIDEO KA LINK COPY KARO AUR ESE LIKHO ☺️❤️* \n*.IG ❮LINK❯*");
    }

    await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });

    const response = await axios.get(`https://api.davidcyriltech.my.id/instagram?url=${q}`);
    const data = response.data;

    if (!data || data.status !== 200 || !data.downloadUrl) {
      return reply("*APKI INSTAGRAM WALI VIDEO MUJHE NAHI MILI SORRY 😔*");
    }

    await conn.sendMessage(from, {
      video: { url: data.downloadUrl },
      mimetype: "video/mp4",
      caption: "*👑 BILAL-MD WHATSAPP BOT 👑*"
    }, { quoted: m });

  } catch (error) {
    console.error("Error IG:", error);
    reply("ERROR");
  }
});

// Twitter download
cmd({
  pattern: "twitter",
  alias: ["tweet", "twdl"],
  desc: "Download Twitter videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return reply("❌ Please provide a valid Twitter URL.");
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result) {
      return reply("⚠️ Failed to retrieve Twitter video. Please check the link and try again.");
    }

    const { desc, thumb, video_sd, video_hd } = data.result;

    const caption = `╭━━━〔 *TWITTER DOWNLOADER* 〕━━━⊷\n`
      + `┃▸ *Description:* ${desc || "No description"}\n`
      + `╰━━━⪼\n\n`
      + `📹 *Download Options:*\n1️⃣ SD\n2️⃣ HD\n🎵 Audio Options: 3️⃣ Audio\n4️⃣ Document\n5️⃣ Voice`;

    const sentMsg = await conn.sendMessage(from, { image: { url: thumb }, caption }, { quoted: m });
    const messageID = sentMsg.key.id;

    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg.message) return;
      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, { react: { text: '⬇️', key: receivedMsg.key } });

        switch (receivedText) {
          case "1":
            await conn.sendMessage(senderID, { video: { url: video_sd }, caption: "📥 SD Downloaded" }, { quoted: receivedMsg });
            break;
          case "2":
            await conn.sendMessage(senderID, { video: { url: video_hd }, caption: "📥 HD Downloaded" }, { quoted: receivedMsg });
            break;
          case "3":
            await conn.sendMessage(senderID, { audio: { url: video_sd }, mimetype: "audio/mpeg" }, { quoted: receivedMsg });
            break;
          case "4":
            await conn.sendMessage(senderID, { document: { url: video_sd }, mimetype: "audio/mpeg", fileName: "Twitter_Audio.mp3", caption: "📥 Audio Downloaded" }, { quoted: receivedMsg });
            break;
          case "5":
            await conn.sendMessage(senderID, { audio: { url: video_sd }, mimetype: "audio/mp4", ptt: true }, { quoted: receivedMsg });
            break;
          default:
            reply("❌ Invalid option! Reply with 1,2,3,4,5.");
        }
      }
    });

  } catch (error) {
    console.error("Error Twitter:", error);
    reply("❌ Error while downloading Twitter video.");
  }
});

// MediaFire download
cmd({
  pattern: "mediafire",
  alias: ["mfire"],
  desc: "To download MediaFire files.",
  react: "📁",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("*MEDIAFIRE FILE KA LINK DO*");

    await conn.sendMessage(from, { react: { text: "🤔", key: m.key } });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result || !data.result.dl_link) return reply("*DUBARA TRY KARO ☺️❤️*");

    const { dl_link, fileName, fileType } = data.result;

    await conn.sendMessage(from, {
      document: { url: dl_link },
      mimetype: fileType || "application/octet-stream",
      fileName: fileName || "mediafire_download",
      caption: `📥 Downloading ${fileName || "file"}...`
    }, { quoted: m });

  } catch (error) {
    console.error("Error MediaFire:", error);
    reply("❌ Error while downloading MediaFire file.");
  }
});

// APK download
cmd({
  pattern: "apk",
  alias: ["app", "apps", "application", "ap"],
  desc: "Download APK from Aptoide.",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("*AGAR AP NE KOI APP DOWNLOAD KARNI HAI 🥺* \n *TO AP ESE LIKHO 😇* \n \n *APK ❮APKI APP KA NAME❯* \n\n *TO APKI APPLICATION DOWNLOAD KAR KE YAHA PER BHEJ DE JAYE GE*");

    await conn.sendMessage(from, { react: { text: "🌹", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.datalist || !data.datalist.list.length) return reply("*APKI APK NAHI MILI SORRY 😔*");

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2);

    await conn.sendMessage(from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: `${app.name} (${appSize} MB) \n *👑 BILAL-MD 👑*`
    }, { quoted: m });

  } catch (error) {
    console.error("*DUBARA KOSHISH KAREIN 🥺💓* \n *APP NAHI MIL RAHI 😔*", error);
    reply("*DUBARA KOSHISH KAREIN 🥺💓* \n *APP NAHI MIL RAHI 😔*");
  }
});

// Google Drive download
cmd({
  pattern: "gdrive",
  desc: "Download Google Drive files.",
  react: "🌐",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Provide a valid Google Drive link.");

    await conn.sendMessage(from, { react: { text: "⬇️", key: m.key } });

    const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`;
    const response = await axios.get(apiUrl);
    const downloadUrl = response.data.result?.downloadUrl;

    if (!downloadUrl) return reply("⚠️ No download URL found.");

    await conn.sendMessage(from, {
      document: { url: downloadUrl },
      mimetype: response.data.result.mimetype,
      fileName: response.data.result.fileName,
      caption: "*© Powered By BILAL-MD*"
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error GDrive:", error);
    reply("❌ Error while downloading Google Drive file.");
  }
});
