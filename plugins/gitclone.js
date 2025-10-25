const { cmd } = require("../command");
const fetch = require("node-fetch");

cmd({
  pattern: 'gitclone',
  alias: ["git", "zip", "file"],
  desc: "Download GitHub repository as a zip file.",
  react: '🥺',
  category: "downloader",
  filename: __filename
}, async (conn, m, store, { from, quoted, args, reply }) => {

  if (!args[0]) {
    return reply(`*AGAR AP NE KISI GITHUB REPO KI ZIP FILE DOWNLOAD KARNI HAI 🥺*
    *TO AP ESE LIKHO ☺️*
    
    *.GITCLONE ❮GITHUB REPO LINK❯*
    
   *JAB AP ESE LIKHO GE 😇 TO US REPO KI ZIP FILE DOWNLOAD KAR KE YAHA BHEJ DE JAYE GE 🥰❤️*`);
  }

  if (!/^(https:\/\/)?github\.com\/.+/i.test(args[0])) {
    await conn.sendMessage(from, { react: { text: "😥", key: m.key } });
    return reply(`*SIRF GITHUB REPO KA LINK LIKHO 😥*`);
  }

  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
    const match = args[0].match(regex);
    if (!match) throw new Error("INVALID LINK");

    const [, username, repo] = match;
    const zipUrl = `https://api.github.com/repos/${username}/${repo}/zipball`;

    // HEAD check optional
    const response = await fetch(zipUrl, { method: "HEAD", redirect: "follow" });
    if (!response.ok) throw new Error("PRIVATE REPO");

    const contentDisposition = response.headers.get("content-disposition");
    let fileName = `${repo}.zip`;
    if (contentDisposition) {
      const matchName = contentDisposition.match(/filename="?([^"]+)"?/);
      if (matchName && matchName[1]) fileName = matchName[1];
    }

    await conn.sendMessage(from, { react: { text: "😃", key: m.key } });
    const wait = await conn.sendMessage(from, { text: "*IS REPO KI ZIP FILE DOWNLOAD HO RAHI HAI 🥺 THORA SA INNTAZAR KARE...☺️🌹*", quoted: m });

    await conn.sendMessage(from, {
      document: { url: zipUrl },
      fileName,
      mimetype: 'application/zip',
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363296818107681@newsletter',
          newsletterName: 'BILAL-MD WHATSAPP BOT',
          serverMessageId: 143
        }
      }
    }, { quoted: m });

    await conn.sendMessage(from, { delete: wait.key }).catch(() => { });
    await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });

  } catch (error) {
    console.error("❌ Error:", error.message);
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
    reply(error.message.includes("PRIVATE REPO")
      ? "*YEH PRIVATE REPO KA LINK HAI 🥺 SIRF PUBLIC REPO KA LINK LIKHO 😊*"
      : `❌ *Error:* ${error.message}`);
  }
});
