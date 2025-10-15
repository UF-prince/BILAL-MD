const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "updategname",
    alias: ["upgname", "gname"],
    react: "🥺",
    desc: "Change the group name.",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, args, q, reply }) => {
    try {
        // React based on conditions
        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: "😫", key: m.key } });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, { react: { text: "🤐", key: m.key } });
            return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, { react: { text: "😎", key: m.key } });
            return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");
        }
        if (!q) return reply("*AP NE GROUP KA NAME CHANGE KARNA HAI TO ESE CHANGE KARO ☺️❤️* \n *.GNAME ❮GROUP KA NEW NAME❯* \n *JAB AP ESE LIKHE GE TO GROUP KA NAME CHANGE HO JAYE GA ☺️🌹*");

        // Update group name
        await conn.groupUpdateSubject(from, q);

        // Reply with updated name
        const updatedMsg = `*GROUP KA NAME CHANGE HO CHUKA HAI 🥺* \n *AGAR KISI KO KOI MASLA HO  😒 TO ABHI BATA DE MUJHE 🥺* \n *MENE IS GROUP KA NEW NAME YEH RAKHAA HAI 🥰👇*\n\n${q}`;
        await reply(updatedMsg);

        // React command message after successful update
        await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });

    } catch (e) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", e);
        // React with 😔 on error
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
