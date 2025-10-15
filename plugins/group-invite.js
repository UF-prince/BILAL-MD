const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

cmd({
    pattern: "invite",
    alias: ["glink", "grouplink", "gclink", "gcurl", "ginvite", "gcinvite", "gli", "glinks", "ginvited", "ginvites", "gadd"],
    desc: "Get group invite link.",
    category: "group",
    filename: __filename,
}, async (conn, mek, m, { from, quoted, body, args, q, isGroup, sender, reply }) => {
    try {
        // React command message 🥺
        await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

        // Check if used in group
        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: "😫", key: m.key } });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        }

        // Get group metadata and admins
        const senderNumber = sender.split('@')[0];
        const botNumber = conn.user.id.split(':')[0];
        const groupMetadata = await conn.groupMetadata(from);
        const groupAdmins = groupMetadata.participants.filter(member => member.admin);

        const isBotAdmins = groupAdmins.some(admin => admin.id === botNumber + '@s.whatsapp.net');
        if (!isBotAdmins) {
            await conn.sendMessage(from, { react: { text: "😎", key: m.key } });
            return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");
        }

        const isAdmins = groupAdmins.some(admin => admin.id === sender);
        if (!isAdmins) {
            await conn.sendMessage(from, { react: { text: "🤐", key: m.key } });
            return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        }

        // Get invite code and link
        const inviteCode = await conn.groupInviteCode(from);
        if (!inviteCode) {
            await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
            return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
        }

        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        // Reply with the link
        await reply(`*YEH RAHA GROUP KA LINK 🥺* \n *AP IS LINK KO APNE FRIENDS KO BHEJO AUR BOLO YEH GROUP JOIN KARE ☺️♥️*\n${inviteLink}`);

        // React message after successful link retrieval ☺️
        await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });

    } catch (error) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", error);
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        reply(`*DUBARA KOSHISH KAREIN 🥺❤️* ${error.message || "Unknown error"}`);
    }
});