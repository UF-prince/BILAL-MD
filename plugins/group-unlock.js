const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "unlockgc",
    alias: ["unlock"],
    react: "☺️",
    desc: "Unlock the group (Allows new members to join).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        // 🔹 Not a group
        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: '😫', key: m.key } });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        }

        // 🔹 Not an admin
        if (!isAdmins) {
            await conn.sendMessage(from, { react: { text: '🤐', key: m.key } });
            return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        }

        // 🔹 Bot is not admin
        if (!isBotAdmins) {
            await conn.sendMessage(from, { react: { text: '😎', key: m.key } });
            return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");
        }

        // 🔹 Unlock group
        await conn.groupSettingUpdate(from, "unlocked");
        await conn.sendMessage(from, { react: { text: '☺️', key: m.key } });
        reply("*AB AP SAB MEMBERS IS GROUP KI PROFILE PIC AUR GROUP KA NAME ☺️ CHANGE YA EDIT KAR SAKTE HO 🥰🌹*");

    } catch (e) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", e);
        await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
        reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
