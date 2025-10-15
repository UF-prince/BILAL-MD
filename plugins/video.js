const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

function extractUrl(text = '') {
  if (!text) return null;
  const urlRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[\w\-?=&%.#\/]+)|(youtube\.com\/[\w\-?=&%.#\/]+)/i;
  const match = text.match(urlRegex);
  if (!match) return null;
  return match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
}

cmd({
  pattern: 'video',
  alias: ['ytmp4', 'mp4', 'ytv', 'vi', 'v', 'vid', 'vide', 'videos', 'ytvi', 'ytvid', 'ytvide', 'ytvideos', 'searchyt', 'download', 'get', 'need', 'search'],
  desc: 'Download YouTube video using Izumi API (auto document fallback).',
  category: 'download',
  react: '🥺',
  filename: __filename
},
async (conn, mek, m, { from, args, reply, quoted }) => {
  let waitingMsg;
  try {
    await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

    // 🟢 ye new condition add ki gayi hai
    if (!args[0]) {
      return reply(
        "*AP NE KOI VIDEO DOWNLOAD KARNI HAI 🥺*\n" +
        "*TO AP ESE LIKHO 😇*\n\n" +
        "*VIDEO ❮APKE VIDEO KA NAM❯*\n\n" +
        "*AP COMMAND ❮VIDEO❯ LIKH KAR USKE AGE APNI VIDEO KA NAME LIKH DO ☺️ FIR WO VIDEO DOWNLOAD KAR KE YAHA BHEJ DE JAYE GE 🥰💞*"
      );
    }
    // 🟢 bas yahi line add hui hai, aur kuch nahi chhueda

    if (!args[0] && !quoted) {
      return reply(
        "*AP NE KOI VIDEO DOWNLOAD KARNI HAI 🥺*\n" +
        "*TO AP ESE LIKHO 😇*\n\n" +
        "*VIDEO ❮APKE VIDEO KA NAM❯*\n\n" +
        "*AP COMMAND ❮VIDEO❯ LIKH KAR USKE AGE APNI VIDEO KA NAME LIKH DO ☺️ FIR WO VIDEO DOWNLOAD KAR KE YAHA BHEJ DE JAYE GE 🥰💞*"
      );
    }

    let provided = args.join(' ').trim() || (quoted && (quoted.text || quoted.caption)) || '';
    let ytUrl = extractUrl(provided);

    waitingMsg = await conn.sendMessage(
      from,
      { text: "*APKI VIDEO DOWNLOAD HO RAHI HAI 🥺 JAB DOWNLOAD COMPLETE HO JAYE GE ☺️ TO YAHA PER BHEJ DE JAYE GE 🥰♥️*\n*THORA SA INTAZAR KARE.....😊*" },
      { quoted: m }
    );
    await conn.sendMessage(from, { react: { text: "😃", key: m.key } });

    if (!ytUrl) {
      const search = await yts(provided);
      if (!search?.all?.length) {
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        return reply("*APKI VIDEO MUJHE NAHI MIL RAHI 🥺*\n*DUBARA KOSHISH KARE 🥺*");
      }
      ytUrl = search.all[0].url;
    }

    const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(ytUrl)}&format=360`;
    const { data } = await axios.get(apiUrl, { headers: { accept: '*/*' }, timeout: 30000 });

    if (!data?.status || !data?.result?.download) {
      await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
      if (waitingMsg) await conn.sendMessage(from, { delete: waitingMsg.key });
      return reply("*APKI VIDEO MUJHE NAHI MIL RAHI 🥺*\n*DUBARA KOSHISH KARE 🥺*");
    }

    const { title, thumbnail, metadata, author, download } = data.result;

    const caption = `*__________________________________*\n*👑 VIDEO KA NAME 👑* \n *${title}*\n*__________________________________*\n*👑 CHANNEL :❯ ${author?.channelTitle || 'Unknown'}*\n*__________________________________*\n👑 VIEWS:❯ *${metadata?.view || '—'}*\n*__________________________________*\n*👑 LIKES :❯ ${metadata?.like || '—'}*\n*__________________________________*\n*👑 TIME:❯ ${metadata?.duration || '—'}*\n*__________________________________*`;

    await conn.sendMessage(from, { image: { url: thumbnail }, caption }, { quoted: m });

    try {
      await conn.sendMessage(from, {
        video: { url: download },
        fileName: `${title.replace(/[\\/:*?"<>|]/g, '')}.mp4`,
        mimetype: 'video/mp4',
        caption: `*_________________________________*\n*👑 VIDEO KKA NAME 👑* \n*${title}*\n*_________________________________*\n*MENE APKI VIDEO DOWNLOAD KAR DI HAI OK ☺️ OR KOI VIDEO CHAHYE TO MUJHE BATANA 😍 KAR DE GE DOWNLOAD KOI MASLA NAHI BEE HAPPY DEAR 🥰💞* \n*_________________________________*\n *👑 BY :❯ BILAL-MD 👑*\n*_________________________________*`
      }, { quoted: m });

      await conn.sendMessage(from, { delete: waitingMsg.key });
      await conn.sendMessage(from, { react: { text: "🥰", key: m.key } });

    } catch (err) {
      await reply(`*APKI VIDEO BAHUT BARI HAI 🥺 IS LIE DUCUMENT ME SEND HO RAHI HAI ☺️*`);
      await conn.sendMessage(from, {
        document: { url: download },
        mimetype: 'video/mp4',
        fileName: `${title.replace(/[\\/:*?"<>|]/g, '')}.mp4`,
        caption: `${title}\n\n *_________________________________*\n*👑 VIDEO KA NAME 👑* \n*${title}*\n*_________________________________*\n*MENE APKI VIDEO DOWNLOAD KAR DI HAI OK ☺️ OR KOI VIDEO CHAHYE TO MUJHE BATANA 😍 KAR DE GE DOWNLOAD KOI MASLA NAHI BEE HAPPY DEAR 🥰💞* \n*_________________________________*\n *👑 BY :❯ BILAL-MD 👑*\n*_________________________________*`
      }, { quoted: m });

      await conn.sendMessage(from, { delete: waitingMsg.key });
      await conn.sendMessage(from, { react: { text: "🥰", key: m.key } });
    }

  } catch (e) {
    console.error('video cmd error =>', e?.message || e);
    if (waitingMsg) await conn.sendMessage(from, { delete: waitingMsg.key });
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
    reply("*APKI VIDEO MUJHE NAHI MIL RAHI 🥺*\n*DUBARA KOSHISH KARE 🥺*");
  }
});