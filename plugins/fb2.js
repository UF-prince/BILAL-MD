const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

const api = `https://nethu-api-ashy.vercel.app`;

// Facebook link detect
function extractFacebookLink(text) {
  if (!text) return null;
  const regex = /(https?:\/\/(?:www\.)?(?:facebook\.com|fb\.watch|fb\.com)\/[^\s]+)/i;
  const m = text.match(regex);
  return m ? m[0] : null;
}

// Core download handler
async function handleFbDownload(conn, from, mek, url) {
  try {
    if (!url) return;

    // react downloading
    try { await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } }); } catch(e){}

    // waiting message
    let waitMsg;
    try { waitMsg = await conn.sendMessage(from, { text: "*APKI FACEBOOK KI VIDEO DOWNLOAD HO RAHI HAI....☺️🌹*" }, { quoted: mek }); } catch(e){}

    // fetch video info
    const fb = await fetchJson(`${api}/download/fbdown?url=${encodeURIComponent(url)}`);

    if (!fb?.result || (!fb.result.hd && !fb.result.sd)) {
      try { if(waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key }); } catch(e){}
      try { await conn.sendMessage(from, { react: { text: "😔", key: mek.key } }); } catch(e){}
      return conn.sendMessage(from, { text: "*APKI FACEBOOK VIDEO NAHI MILI 😔*", quoted: mek });
    }

    const videoUrl = fb.result.hd || fb.result.sd;

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption: "*👑 BY :❯ BILAL-MD 👑*"
    }, { quoted: mek });

    // success react
    try { await conn.sendMessage(from, { react: { text: "😍", key: mek.key } }); } catch(e){}

    // delete waiting
    try { if(waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key }); } catch(e){}

  } catch (err) {
    console.error("FB Download error:", err);
    try { await conn.sendMessage(from, { react: { text: "😔", key: mek.key } }); } catch(e){}
    try { await conn.sendMessage(from, { text: "*APKI FACEBOOK VIDEO NAHI MILI 😔*", quoted: mek }); } catch(e){}
  }
}

// Command fb2
cmd({
  pattern: "fb2",
  alias: ["fbb2", "fbvideo2"],
  desc: "Download FB video HD/SD",
  category: "download",
  react: "🥺",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("*AP KO KOI FACEBOOK VIDEO DOWNLOAD KARNI HAI 🤔* \n *TO AP ESE LIKHO ☺️🌹* \n \n *FB2 ❮APKI FACEBOOK VIDEO KA LINK❯* \n \n*TO APKI FACEBOOK VIDEO DOWNLOAD KAR KE YAHA BHEJ DE JAYE GE 😇💓*");
  await handleFbDownload(conn, from, mek, q);
});

// Auto-scan any incoming text
cmd({
  on: "message",
  filename: __filename
}, async (conn, mek, m) => {
  try {
    // Extract text from all possible message types
    const body = m.text || m.message?.conversation || m.message?.extendedTextMessage?.text;
    if (!body) return;

    // Ignore commands
    const firstChar = body.trim().charAt(0);
    if ([".", "!", "/", "#"].includes(firstChar)) return;

    const fbLink = extractFacebookLink(body);
    if (!fbLink) return; // not FB

    await handleFbDownload(conn, m.from, mek, fbLink);

  } catch (err) {
    console.error("Auto FB scan error:", err);
  }
});
