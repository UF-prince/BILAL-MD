const { cmd } = require('../command');
const converter = require('../data/converter');

cmd({
    pattern: 'tomp3',
    alias: ['toaudio', 'tosong', 'tomusic'], // ✅ alias added
    desc: 'Convert video to audio (mp3)',
    category: 'audio',
    filename: __filename
}, async (client, match, message, { from }) => {
    // 🎯 Input validation
    if (!match.quoted) {
        return await client.sendMessage(from, {
            text: "*KISI BHI VIDEO KO MENTION KARO 🥺* \n *AUR ESE LIKHO ☺️* \n \n  *❮TOMP3❯* \n \n *TO WO VIDEO AUDIO ME BADAL JAYE GE 🥰*"
        }, { quoted: message });
    }

    if (!['videoMessage', 'audioMessage'].includes(match.quoted.mtype)) {
        await client.sendMessage(from, { react: { text: "😫", key: message.key } }); // 😫 react added
        return await client.sendMessage(from, {
            text: "*SIRF VIDEO KO MENTION KARO ☺️🌹*"
        }, { quoted: message });
    }

    if (match.quoted.seconds > 300) {
        await client.sendMessage(from, { react: { text: "😥", key: message.key } }); // 😥 react added
        return await client.sendMessage(from, {
            text: "*APKI VIDEO 2 MINT KI HONI CHAHYE ☺️🌹* \n *YEH VIDEO 5 MINT SE ZYADA HAI 🥺❤️*"
        }, { quoted: message });
    }

    // 🕒 Send processing message
    const waitMsg = await client.sendMessage(from, {
        text: "*VIDEO AB AUDIO ME CONVERT HO RAHI HAI...☺️*"
    }, { quoted: message });

    try {
        const buffer = await match.quoted.download();
        const ext = match.quoted.mtype === 'videoMessage' ? 'mp4' : 'm4a';
        const audio = await converter.toAudio(buffer, ext);

        // 🎧 Send result
        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });

        // 🗑️ Delete wait message
        await client.sendMessage(from, { delete: waitMsg.key });

        // 😊 Success reaction
        await client.sendMessage(from, { react: { text: "☺️", key: message.key } });

    } catch (e) {
        console.error('Conversion error:', e.message);

        // 😔 Error reaction & message
        await client.sendMessage(from, { react: { text: "😔", key: message.key } });
        await client.sendMessage(from, {
            text: "*DUBARA KOSHISH KAREIN 🥺❤️*"
        }, { quoted: message });
    }
});
