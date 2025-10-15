const { cmd } = require('../command');
const { fetchGif, gifToSticker } = require('../lib/sticker-utils');

cmd({
    pattern: "attp",
    alias: ["attptext", "textsticker", "namesticker", "stickername", "at", "att", "atp"],
    desc: "Convert text into animated sticker (GIF style).",
    category: "sticker",
    react: "✨",
    use: ".attp <text>",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        // 🥺 React on command
        await conn.sendMessage(m.chat, { react: { text: '🥺', key: m.key } });

        // 😥 If no text provided
        if (!args[0]) {
            await conn.sendMessage(m.chat, { react: { text: '🥺', key: m.key } });
            return reply(`*APKO APKE NAME KA STICKER BANANA HAI 🥺* \n *TO AP ESE LIKHO ☺️* \n\n *ATTP ❮APKA NAME❯* \n \n *JAB AP ESE LIKHO GE 🥺 TO APKE NAME KA STICKER BAN JAYE GA 🥰*`);
        }

        // ⏳ Waiting message
        const waitMsg = await conn.sendMessage(m.chat, {
            text: `*APKA STICKER BAN RAHA HAI*\n*THORA SA INTAZAR KARE...☺️*`,
            quoted: mek
        });

        // 🌀 Create GIF Sticker
        const gifBuffer = await fetchGif(`https://api-fix.onrender.com/api/maker/attp?text=${encodeURIComponent(args.join(" "))}`);
        const stickerBuffer = await gifToSticker(gifBuffer);

        // ✅ Send sticker
        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: mek });

        // ☺️ React on success
        await conn.sendMessage(m.chat, { react: { text: '☺️', key: m.key } });

        // 🧹 Delete waiting msg
        await new Promise(r => setTimeout(r, 2000));
        await conn.sendMessage(m.chat, { delete: waitMsg.key });

    } catch (error) {
        console.error("*DUBARA KOSHISH KARE 🥺*", error);
        await conn.sendMessage(m.chat, { react: { text: '😔', key: m.key } });
        return reply("*DUBARA KOSHISH KARE 🥺*");
    }
});
