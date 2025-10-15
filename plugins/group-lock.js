const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');

cmd({
    pattern: "lockgc",
    alias: ["lock"],
    react: "☺️", // default react when command runs
    desc: "Lock the group (Prevents new members from joining).",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        // ✅ Not a group
        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: '😫', key: m.key } });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        }

        // ✅ User not admin
        if (!isAdmins) {
            await conn.sendMessage(from, { react: { text: '🤐', key: m.key } });
            return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        }

        // ✅ Bot not admin
        if (!isBotAdmins) {
            await conn.sendMessage(from, { react: { text: '😎', key: m.key } });
            return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");
        }

        // ✅ Group lock successful
        await conn.groupSettingUpdate(from, "locked");
        await conn.sendMessage(from, { react: { text: '☺️', key: m.key } });
        return reply("*IS GROUP KI PROFILE AUR GROUP KA NAME AB KOI BHI MEMBER CHANGE YA EDIT NAHI KAR SAKTA ☺️ SIRF ADMINS GROUP KI PROFILE AUR NAME CHANGE KAR SAKTE HAI 😇🌹*");

    } catch (e) {
        console.error("LockGC Error:", e);
        await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
        return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});