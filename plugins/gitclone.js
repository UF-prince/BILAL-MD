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

  // ⚙️ Agar user ne sirf '.gitclone' likha (without link)
  if (!args[0]) {
    return reply(`*AGAR AP NE KISI GITHUB REPO KI ZIP FILE DOWNLOAD KARNI HAI 🥺*
    *TO AP ESE LIKHO ☺️*
    
    *.GITCLONE ❮GITHUB REPO LINK❯*
    
   *JAB AP ESE LIKHO GE 😇 TO US REPO KI ZIP FILE DOWNLOAD KAR KE YAHA BHEJ DE JAYE GE 🥰❤️*`);
  }

  // 🔸 Invalid link format
  if (!/^(https:\/\/)?github\.com\/.+/.test(args[0])) {
    await conn.sendMessage(from, { react: { text: "😥", key: m.key } });
    return reply(`*SIRF GITHUB REPO KA LINK LIKHO 🥺 AP GHALAT LINK LIKH RAHE HO 😥*`);
  }

  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
    const match = args[0].match(regex);
    if (!match) {
      await conn.sendMessage(from, { react: { text: "☹️", key: m.key } });
      throw new Error("*YEH GITHUB REPO KA LINK NAHI ☹️*");
    }

    const [, username, repo] = match;
    const zipUrl = `https://api.github.com/repos/${username}/${repo}/zipball`;

    // 🧩 Check repository status
    const response = await fetch(zipUrl, { method: "HEAD" });
    if (!response.ok) {
      await conn.sendMessage(from, { react: { text: "😓", key: m.key } });
      throw new Error("*YEH PRIVATE REPO KA LINK HAI 🥺 AP SIRF PUBLIC REPO KA LINK DO 😓*");
    }

    const contentDisposition = response.headers.get("content-disposition");
    const fileName = contentDisposition
      ? contentDisposition.match(/filename=(.*)/)[1]
      : `${repo}.zip`;

    // 🟢 Show waiting message
    await conn.sendMessage(from, { react: { text: "😃", key: m.key } });
    const waitingMsg = await conn.sendMessage(from, {
      text: "*APKI REPO KI ZIP FILE DOWNLOAD HO RAHI HAI 😃*",
      quoted: m
    });

    // 📨 Send ZIP File
    await conn.sendMessage(from, {
      document: { url: zipUrl },
      fileName: fileName,
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

    // 🧹 Auto delete waiting message after file send
    try {
      await conn.sendMessage(from, { delete: waitingMsg.key });
    } catch (e) {
      console.log("⚠️ Failed to delete waiting message:", e);
    }

    await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });

  } catch (error) {
    console.error("❌ Error:", error.message);
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });

    if (error.message.includes("PRIVATE REPO")) {
      reply(`*AP NE PRIVATE REPO KA LINK LIKHA HAI 🥺 AP SIRF PUBLIC REPO KA LINK LIKHO 😊*`);
    } else {
      reply(`*AP NE PRIVATE REPO KA LINK LIKHA HAI 🥺 AP SIRF PUBLIC REPO KA LINK LIKHO 😊*`);
    }
  }
});
