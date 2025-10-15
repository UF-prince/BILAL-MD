const axios = require('axios');
const { sleep } = require('../lib/myfunc');
const { cmd } = require('../command');

cmd({
    pattern: "pair",
    desc: "Get WhatsApp pairing code",
    category: "tools",
    react: "💓", // ✅ Default react when command is detected
    filename: __filename
},
async (conn, m, store, { from, q, reply }) => {
    try {
        // ⚡ React when command starts
        await m.react("🥺");

        if (!q) {
            await m.react("🥺");
            return reply("*APKO BILAL-MD BOT KA PAIR CODE CHAHYE ☺️🌹* \n *TO ESE LIKHOO AP 😊🌺* \n\n *❮PAIR +923078071982❯* \n\n*IS NUMBER KI JAGAH AP APNA NUMBER LIKHNA 😊🌹* \n *TO APKE NUMBER PAR BILAL-MD BOT KA PAIR CODE BAN HO JAYE GA*");
        }

        const numbers = q.split(',')
            .map((v) => v.replace(/[^0-9]/g, ''))
            .filter((v) => v.length > 5 && v.length < 20);

        if (numbers.length === 0) {
            await m.react("😥");
            return reply("*AP SAHI NAHI LIKH RAHE 🥺🌹*");
        }

        for (const number of numbers) {
            const whatsappID = number + '@s.whatsapp.net';

            let existsResult = [];
            try {
                existsResult = await conn.onWhatsApp(whatsappID);
            } catch (e) {
                console.error("onWhatsApp error:", e);
            }

            if (!existsResult[0]?.exists) {
                await m.react("😫");
                await reply(`*IS ${number} NUMBER PER WHATSAPP NAHI BANI HUI ☺️♥️*`);
                continue;
            }

            // 🌀 React to show generation started
            await m.react("😃");
            await reply("*BOT KA PAIR CODE APKE WHATSAPP NUMBER KE SATH CONNECT HO RAHA HAI....☺️🌹*");

            try {
                const response = await axios.get(`https://pair-vd1s.onrender.com/code?number=${number}`, { timeout: 20000 });

                if (response.data && response.data.code) {
                    const code = String(response.data.code).trim();

                    if (!code || code === "Service Unavailable") {
                        throw new Error('Service Unavailable');
                    }

                    // ✅ React on success
                    await m.react("🥰");

                    // 1️⃣ Send code
                    await conn.sendMessage(from, {
                        text: `\`\`\`${code}\`\`\``
                    }, { quoted: m });

                    await sleep(800);

                    // 2️⃣ Send notice message
                    const notice = `*BILAL-MD BOT KA PAIR CODE APKE NUMBER E SATH CONNECT HO CHUKA HAI 🥰🌹*\n*AP IS PAIR CODE KO APNE WHATSAPP ME 30 SECONDS K ANDAR LINK KAR LO 🥺*\n*WARNA CODE EXPIRE HO JAYE GA*\n*AGAR EXPIRE B HO JAYE TO AP DUBARA ❮PAIR❯ COMMAND KA ISTEMAL KAR KE DUBARA PAIR CODE NEW BANA SAKTE HAI 🥰💓♥️*\n\n*👑 BILAL-MD WHATSAPP BOT 👑*`;

                    await conn.sendMessage(from, {
                        text: notice
                    }, { quoted: m });

                } else {
                    throw new Error('*DUBARA KOSHISH KARE 🥺♥️*');
                }
            } catch (apiError) {
                console.error('API Error:', apiError);
                await m.react("😔");
                const errorMessage = apiError.message === 'Service Unavailable'
                    ? "*DUBARA KOSHISH KARE 🥺♥️*"
                    : "*DUBARA KOSHISH KARE 🥺♥️*";
                await reply(errorMessage);
            }
        }
    } catch (err) {
        console.error("Pair command error:", err);
        await m.react("😢");
        reply("*DUBARA KOSHISH KARE 🥺♥️*");
    }
});
