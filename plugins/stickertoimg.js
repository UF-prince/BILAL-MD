const { cmd } = require('../command');
const stickerConverter = require('../data/sticker-converter');

cmd({
    pattern: 'stoimg',
    alias: ['stickertophoto', 'stopic', 's2img', 's2pic'],
    desc: 'Convert sticker to image',
    category: 'media',
    react: '🥺',
    filename: __filename
}, async (client, match, message, { from }) => {
    try {
        // 🥺 Command reaction
        await client.sendMessage(from, { react: { text: "🥺", key: message.key } });

        // 🧾 Input validation
        if (!message.quoted)
            return await client.sendMessage(from, { 
                text: "*KISI STICKER KO REPLY KARO 🥺* \n *AUR ESE LIKHO ☺️* \n \n *❮STOIMG❯* \n \n *JAB ESE LIKHO GE TO APKA STICKER PHOTO ME BADAL JAYE GA ☺️💓*" 
            }, { quoted: message });

        if (message.quoted.mtype !== 'stickerMessage') {
            // 😫 React jab user ne sticker mention nahi kiya
            await client.sendMessage(from, { react: { text: "😫", key: message.key } });
            return await client.sendMessage(from, { 
                text: "*SIRF STICKER KO MENTION REPLY KR KE 🥺* \n *FIR YEH LIKHO ☺️🌹* \n *❮STOIMG❯*" 
            }, { quoted: message });
        }

        // 🕒 Waiting message
        const waitMsg = await client.sendMessage(from, {
            text: "*APKA STICKER PHOTO ME BADAL RAHA HAI...☺️*"
        }, { quoted: message });

        // 📥 Download sticker buffer
        const stickerBuffer = await message.quoted.download();
        const imageBuffer = await stickerConverter.convertStickerToImage(stickerBuffer);

        // 🖼️ Send final image
        await client.sendMessage(from, {
            image: imageBuffer,
            caption: "👑 *BY :❯ BILAL-MD 👑*"
        }, { quoted: message });

        // 🗑️ Delete waiting message
        await client.sendMessage(from, { delete: waitMsg.key });

        // ☺️ Success react
        await client.sendMessage(from, { react: { text: "☺️", key: message.key } });

    } catch (error) {
        console.error("❌ Sticker conversion error:", error);

        // 😔 Error react and message
        await client.sendMessage(from, { react: { text: "😔", key: message.key } });
        await client.sendMessage(from, { text: "*DUBARA KOSHISH KARE 🥺*" }, { quoted: message });
    }
});
