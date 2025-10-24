const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');


cmd({
    pattern: "video",
    react: "🥺",
    desc: "Download YouTube MP4",
    category: "download",
    use: ".video <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("*AP NE KOI VIDEO DOWNLOAD KARNI HAI 🥺*\n" +
        "*TO AP ESE LIKHO 😇*\n\n" +
        "*VIDEO ❮APKE VIDEO KA NAM❯*\n\n" +
        "*AP COMMAND ❮VIDEO❯ LIKH KAR USKE AGE APNI VIDEO KA NAME LIKH DO ☺️ FIR WO VIDEO DOWNLOAD KAR KE YAHA BHEJ DE JAYE GE 🥰💞*");

        const search = await yts(q);
        if (!search.videos.length) return reply("*DUBARA KOSHISH KARO 🥺❤️*");

        const data = search.videos[0];
        const ytUrl = data.url;

        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.media?.video_url) {
            return reply("*APKI VIDEO MUJHE NAHI MILI 😔💔*");
        }

        const result = apiRes.result.media;

        const caption = `
        *__________________________________*
*👑 VIDEO KA NAME 👑*
*${data.title}*
*__________________________________*
*👑 VIDEO KA LINK 👑*
*${data.url}*
*__________________________________*
*👑 VIEWS :❯  ${data.views}*
*__________________________________*
*👑 TIME :❯ ${data.timestamp}*
*__________________________________*
*PEHLE IS MSG KO MENTION KARO 🥺 AUR PHIR AGAR NUMBER ❮1❯ LIKHO GE ☺️ TO NORMAL VIDEO AYE GE 🥰 AGAR NUMBER ❮2❯ LIKHO GE 🥺 TO VIDEO FILE ME AYE GE ☺️🌹*
*__________________________________*
*❮1❯ SIMPLE VIDEO*
*__________________________________*
*❮2❯ FILE VIDEO*
*__________________________________*
*👑 BILAL-MD WHATSAPP BOT 👑*
*__________________________________*`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption
        }, { quoted: m });

        const messageID = sentMsg.key.id;

    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg?.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, { react: { text: '⏳', key: receivedMsg.key } });

        switch (receivedText.trim()) {
                case "1":
                    await conn.sendMessage(senderID, {
                        video: { url: result.video_url },
                        mimetype: "video/mp4",
                        ptt: false,
                    }, { quoted: receivedMsg });
                    break;

                case "2":
                    await conn.sendMessage(senderID, {
                        document: { url: result.video_url },
                        mimetype: "video/mp4",
                        fileName: `${data.title}.mp4`
                    }, { quoted: receivedMsg });
                    break;

          default:
            reply("*MERE MSG KO PEHLE MENTION KAR LO 🥺 PHIR SIRF NUMBER ME ❮1❯ YA NUMBER ❮2❯ IN DONO ME SE KOI EK NUMBER LIKHO ☺️🌹*");
        }
      }
    });

  } catch (error) {
    console.error("*APKI VIDEO NAHI MILI MUJHE 🥺*", error);
    reply("*APKI VIDEO NAHI MILI MUJHE 🥺❤️*");
  }
});
