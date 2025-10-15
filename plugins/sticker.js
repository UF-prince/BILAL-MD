const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const Config = require('../config');

// 🧩 Sticker Command — FINAL READY VERSION
cmd(
  {
    pattern: 'sticker',
    alias: ['s', 'stickergif'],
    desc: 'Create a sticker from an image, video, or URL.',
    category: 'sticker',
    use: '<reply media or URL>',
    filename: __filename,
  },
  async (conn, mek, m, { quoted, args, q, reply, from }) => {
    try {
      // 🥺 React on command message
      await conn.sendMessage(from, { react: { text: '🥺', key: m.key } });

      // ⚠️ No reply case
      if (!mek.quoted) {
        await conn.sendMessage(from, { react: { text: '🥺', key: m.key } });
        return reply(
          `*AP KISI PHOTO YA VIDEO KO MENTION KARO 🥺*\n\n` +
          `*PHIR LIKHO ☺️* \n \n *❮STICKER❯*\n\n` +
          `*JAB AP STICKER LIKHO GE 😇 TO APKI PHOTO YA VIDEO STICKER BAN JAYE GI 🌹*`
        );
      }

      const mime = mek.quoted.mtype;
      const pack = Config.STICKER_NAME || "👑 BILAL-MD 👑";

      // 🖼️ Image or Video Type
      if (mime === "imageMessage" || mime === "stickerMessage" || mime === "videoMessage") {

        // 🕒 Waiting message
        const waitMsg = await conn.sendMessage(from, {
          text: `*APKA STICKER BAN RAHA HAI ☺️*\n*THORA SA INTAZAR KARE......😇*`,
          quoted: mek
        });

        const media = await mek.quoted.download();
        const sticker = new Sticker(media, {
          pack: pack,
          type: StickerTypes.FULL,
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 75,
          background: 'transparent',
        });

        const buffer = await sticker.toBuffer();

        // 😍 Success — send sticker
        await conn.sendMessage(from, { sticker: buffer }, { quoted: mek });

        // ☺️ React success
        await conn.sendMessage(from, { react: { text: '☺️', key: m.key } });

        // 🧹 Delete waiting msg after sticker successfully sent
        await new Promise(r => setTimeout(r, 2000));
        await conn.sendMessage(from, { delete: waitMsg.key });

      } else {
        await conn.sendMessage(from, { react: { text: '😥', key: m.key } });
        return reply("*SIRF PHOTO YA VIDEO KO MENTION KARO BAS 🥺*");
      }

    } catch (error) {
      console.error("Sticker Error:", error);
      await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
      return reply("*DUBARA KOSHISH KARE 🥺*");
    }
  }
);