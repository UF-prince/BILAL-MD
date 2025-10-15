const { cmd } = require("../command");
const { sleep } = require("../lib/functions");

cmd({
    pattern: "restart",
    desc: "Restart BILAL-MD",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("*AP YE COMMAND USE NAHI KAR SAKTE 🥺❤️* \n *YEH COMMAND SIRF MERE LIE HAI ☺️❤️*");
        }

        // Command pe 🥺 react
        await conn.sendMessage(m.chat, { react: { text: '☺️', key: m.key } });

        // Waiting msg
        const waitingMsg = await conn.sendMessage(m.chat, { text: "*👑 BILAL-MD WHATSAPP BOT 👑* \n*RESTART HO RAHA HAI...☺️🌹*" });

        const { exec } = require("child_process");
        await sleep(1500);

        // Restart command
        exec("pm2 restart all", async (err) => {
            if (err) {
                console.error(err);
                return reply(`❌ Error: ${err.message}`);
            }

            // Waiting message delete
            await conn.sendMessage(waitingMsg.chat, { delete: waitingMsg.key });

            // Command message react ☺️
            await conn.sendMessage(m.chat, { react: { text: '☺️', key: m.key } });

            // Confirm message
            const confirmMsg = await conn.sendMessage(m.chat, { text: "*BILAL-MD BOT RESTART HO CHUKA HAI 🥰*" });

            // Auto delete confirm msg after 30 sec
            setTimeout(async () => {
                await conn.sendMessage(confirmMsg.chat, { delete: confirmMsg.key });
                await conn.sendMessage(m.chat, { react: { text: '', key: m.key } }); // remove emoji from command message
            }, 30000);
        });
    } catch (e) {
        console.error(e);
        reply(`❌ ${e}`);
    }
});
