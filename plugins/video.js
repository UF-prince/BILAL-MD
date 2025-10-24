const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "video",
    react: "🥺",
    desc: "Download YouTube video (auto type select)",
    category: "download",
    use: ".video <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("*AP NE KOI VIDEO DOWNLOAD KARNI HAI 🥺*\n" +
        "*TO AP ESE LIKHO 😇*\n\n" +
        "*VIDEO ❮APKE VIDEO KA NAM❯*\n\n" +
        "*AP COMMAND ❮VIDEO❯ LIKH KAR USKE AGE APNI VIDEO KA NAME LIKH DO ☺️ FIR WO VIDEO DOWNLOAD KAR KE YAHA BHEJ DE JAYE GE 🥰💞*");

        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });

        const search = await yts(q);
        if (!search.videos.length) return reply("*APKI VIDEO MUJHE NAHI MILI 😔💔*");

        const data = search.videos[0];
        const ytUrl = data.url;

        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.media?.video_url) {
            return reply("*DUBARA KOSHISH KARO ☹️*");
        }

        const result = apiRes.result.media;

        await conn.sendMessage(from, { react: { text: "☹️", key: mek.key } });

        await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: `*__________________________________*\n*👑 VIDEO KA NAME 👑* \n *${title}*\n*__________________________________*\n*👑 CHANNEL :❯ ${author?.channelTitle || 'Unknown'}*\n*__________________________________*\n👑 VIEWS:❯ *${metadata?.view || '—'}*\n*__________________________________*\n*👑 LIKES :❯ ${metadata?.like || '—'}*\n*__________________________________*\n*👑 TIME:❯ ${metadata?.duration || '—'}*\n*__________________________________*`
        }, { quoted: m });

        // 🔹 Try sending as normal video first
        try {
            await conn.sendMessage(from, { react: { text: "😃", key: mek.key } });
            await conn.sendMessage(from, {
                video: { url: result.video_url },
                mimetype: "video/mp4",
                caption: `*👑 BY :❯ BILAL-MD 👑*`
            }, { quoted: m });

        } catch (sendError) {
            console.warn("*APKI VIDEO DOWNLOAD HO RAHI HAI 🥺 THORA SA INTAZAR KARE...☺️🌹");
            await conn.sendMessage(from, { react: { text: "📦", key: mek.key } });

            // 🔹 Fallback: send as document type
            await conn.sendMessage(from, {
                document: { url: result.video_url },
                mimetype: "video/mp4",
                fileName: `${data.title}.mp4`,
                caption: `*👑 BY :❯ BILAL-MD 👑*`
            }, { quoted: m });
        }

        await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });

    } catch (error) {
        console.error("*DUBARA KOSHISH KARO 🥺❤️*", error);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*DUBARA KOSHISH KARO 🥺❤️*");
    }
});
