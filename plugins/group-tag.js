const { cmd } = require('../command');

cmd({
  pattern: "hidetag",
  alias: ["tag", "h", "htag"],  
  react: "☺️",
  desc: "To Tag all Members for Any Message/Media",
  category: "group",
  use: '.hidetag Hello',
  filename: __filename
},
async (conn, mek, m, {
  from, q, isGroup, isCreator, isAdmins,
  participants, reply
}) => {
  try {
    // 🥺 Command start hone pe react
    await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

    const isUrl = (url) => {
      return /https?:\/\/(www\.)?[\w\-@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w\-@:%_\+.~#?&//=]*)/.test(url);
    };

    if (!isGroup) {
      await conn.sendMessage(from, { react: { text: "😫", key: m.key } });
      return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
    }
    if (!isAdmins && !isCreator) {
      await conn.sendMessage(from, { react: { text: "😥", key: m.key } });
      return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
    }

    const mentionAll = { mentions: participants.map(u => u.id) };

    if (!q && !m.quoted) {
      await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
      return reply("*AP ESE LIKHO 🥰* \n \n *HTAG ❮APKA MSG❯* \n \n *JAB AP ESE LIKHO GE 😊* \n *TO SAB MEMBERS KO APKA MSG TAG HO JAYE GA ☺️🌹*");
    }

    if (m.quoted) {
      const type = m.quoted.mtype || '';
      let buffer, content;

      if (type === 'extendedTextMessage') {
        await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
        return await conn.sendMessage(from, {
          text: m.quoted.text || '*DUBARA KOSHISH KAREIN 🥺❤️*',
          ...mentionAll
        }, { quoted: mek });
      }

      if (['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'].includes(type)) {
        try {
          buffer = await m.quoted.download?.();
          if (!buffer) {
            await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
            return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
          }

          switch (type) {
            case "imageMessage":
              content = { image: buffer, caption: m.quoted.text || "PHOTO", ...mentionAll };
              break;
            case "videoMessage":
              content = { 
                video: buffer, 
                caption: m.quoted.text || "VIDEO", 
                gifPlayback: m.quoted.message?.videoMessage?.gifPlayback || false, 
                ...mentionAll 
              };
              break;
            case "audioMessage":
              content = { 
                audio: buffer, 
                mimetype: "audio/mp4", 
                ptt: m.quoted.message?.audioMessage?.ptt || false, 
                ...mentionAll 
              };
              break;
            case "stickerMessage":
              content = { sticker: buffer, ...mentionAll };
              break;
            case "documentMessage":
              content = {
                document: buffer,
                mimetype: m.quoted.message?.documentMessage?.mimetype || "application/octet-stream",
                fileName: m.quoted.message?.documentMessage?.fileName || "file",
                caption: m.quoted.text || "",
                ...mentionAll
              };
              break;
          }

          if (content) {
            await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
            return await conn.sendMessage(from, content, { quoted: mek });
          }
        } catch (e) {
          await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
          console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", e);
          return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
        }
      }

      await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
      return await conn.sendMessage(from, {
        text: m.quoted.text || "📨 Message",
        ...mentionAll
      }, { quoted: mek });
    }

    if (q) {
      await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
      await conn.sendMessage(from, { text: q, ...mentionAll }, { quoted: mek });
    }

    // ✅ Jab successfully ho jaye to final react
    await conn.sendMessage(from, { react: { text: "💞", key: m.key } });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
    reply(`*DUBARA KOSHISH KAREIN 🥺❤️*\n\n${e.message}`);
  }
});
