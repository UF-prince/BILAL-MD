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
  pattern: 'play',
  alias: ['song', 'music', 'audio', 'yta', 'ytmp3', 'ytmusic', 'ytsong', 'ytaudio', 'ytsearch', 'ytmp'],
  desc: 'Download YouTube audio using Izumi API.',
  category: 'download',
  react: '🥺',
  filename: __filename
},
async (conn, mek, m, { from, args, reply, quoted }) => {
  let waitingMsg, thumbMsg, captionMsg;
  try {
    await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

    if (!args[0]) {
      return reply(
        "*AP KO KOI AUDIO DOWNLOAD KARNI HAI 🥺*\n" +
        "*TO AP ESE LIKHO ☺️*\n\n" +
        "*PLAY ❮APKE AUDIO KA NAM❯*\n\n" +
        "*AP COMMAND ❮PLAY❯ LIKH KAR USKE AGE APNE AUDIO KA NAM LIKH DO ☺️ FIR WO AUDIO DOWNLOAD KAR KE YAHA PER BHEJ DE JAYE GE 🥰💞*"
      );
    }

    let provided = args.join(' ').trim() || (quoted && (quoted.text || quoted.caption)) || '';
    let ytUrl = extractUrl(provided);

    waitingMsg = await conn.sendMessage(
      from,
      { text: "*APKA AUDIO DOWNLOAD HO RAHA HAI 🥺 JAB DOWNLOAD COMPLETE HO JAYE GA ☺️ TO YAHA BHEJ DIYA JAYE GA 🥰♥️*\n*THORA SA INTAZAR KARE.....😊*" },
      { quoted: m }
    );
    await conn.sendMessage(from, { react: { text: "😃", key: m.key } });

    if (!ytUrl) {
      const search = await yts(provided);
      if (!search?.all?.length) {
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        return reply("*APKA AUDIO MUJHE NAHI MILA 🥺 AP APNA AUDIO DUBARA DOWNLOAD KARO ☺️*");
      }
      ytUrl = search.all[0].url;
    }

    const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(ytUrl)}&format=mp3`;
    const { data } = await axios.get(apiUrl, { headers: { accept: '*/*' }, timeout: 30000 });

    if (!data?.status || !data?.result?.download) {
      await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
      if (waitingMsg) await conn.sendMessage(from, { delete: waitingMsg.key });
      return reply("*APKA AUDIO MUJHE NAHI MILA 🥺 AP APNA AUDIO DUBARA DOWNLOAD KARO ☺️*");
    }

    const { title, thumbnail, author, metadata, download } = data.result;

    // 🔹 Thumbnail caption (audio info)
    const thumbCaption = `*__________________________________*\n*👑 AUDIO KA NAME 👑*\n *${title}*\n*__________________________________*\n*👑 CHANNEL :❯ ${author?.channelTitle || 'Unknown'}*\n*__________________________________*\n*👑 VIEWS:❯ ${metadata?.view || '—'}*\n*__________________________________*\n*👑 LIKES :❯ ${metadata?.like || '—'}*\n*__________________________________*\n*👑 TIME:❯ ${metadata?.duration || '—'}*\n*__________________________________*`;

    thumbMsg = await conn.sendMessage(from, { image: { url: thumbnail }, caption: thumbCaption }, { quoted: m });

    try {
      // 🔹 Final audio caption (downloaded message)
      const finalCaption = `*_________________________________________*\n*👑 AUDIO KA NAME 👑* \n*${title}*\n*_________________________________________*\n*MENE APKA AUDIO DOWNLOAD KAR DIA HAI OK ☺️ OR KOI AUDIO CHAHYE TO MUJHE BATANA 😍 KAR DE GE DOWNLOAD KOI MASLA NAHI BEE HAPPY DEAR 🥰💞*\n*_________________________________________*\n*👑 BY :❯ BILAL-MD 👑*\n*_________________________________________*`;

      await conn.sendMessage(from, {
        audio: { url: download },
        mimetype: 'audio/mpeg',
        fileName: `${title.replace(/[\\/:*?"<>|]/g, '')}.mp3`,
        ptt: false
      }, { quoted: m });

      // Caption message alag bhejna (audio ke baad)
      captionMsg = await conn.sendMessage(from, { text: finalCaption }, { quoted: m });

      // waiting msg delete (success hone ke baad)
      if (waitingMsg) await conn.sendMessage(from, { delete: waitingMsg.key });

      await conn.sendMessage(from, { react: { text: "🥰", key: m.key } });

    } catch (err) {
      await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
      await reply("*ERROR: AUDIO SEND KARNE ME PROBLEM A GAYI 🥺 DUBARA TRY KARO ☹️*");
    }

  } catch (e) {
    console.error('play cmd error =>', e?.message || e);
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
    if (waitingMsg) await conn.sendMessage(from, { delete: waitingMsg.key });
    await reply("*ERROR: KUCH GALAT HO GAYA 🥺 DUBARA KOSHISH KARO ☹️*");
  }
});