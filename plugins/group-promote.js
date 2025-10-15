const { cmd } = require('../command');

cmd({
    pattern: "promote",
    alias: ["p", "makeadmin", "admin"],
    desc: "Promotes a member to group admin",
    category: "admin",
    react: "🥺",
    filename: __filename
},
async(conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply
}) => {

    // ✅ Har msg pe react 👑
    await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

    // Check if the command is used in a group
    if (!isGroup) {
        await conn.sendMessage(from, { react: { text: "😫", key: m.key } });
        return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️*");
    }

    // Check if the user is an admin
    if (!isAdmins) {
        await conn.sendMessage(from, { react: { text: "😥", key: m.key } });
        return reply("*YEH COMMAND SRF GROUP ADMINS USE KAR SAKTE HAI AP ADMIN NAHI HO 🥺*");
    }

    // Check if the bot is an admin
    if (!isBotAdmins) {
        await conn.sendMessage(from, { react: { text: "😎", key: m.key } });
        return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");
    }

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, '');
    } else {
        await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
        return reply("*AP KIS MEMBER KO IS GROUP KA ADMIN BANANA CHAHTE HAI 🤔* \n *PEHLE US MEMBER KO MENTION USE MSG KO REPLY KAR KE ☺️🌹* \n *PHIR ESE LIKHO 🥰* \n \n *❮ADMIN❯* \n \n *TO WO MEMBER GROUP ME ADMIN BAN JAYE GA 😇♥️*");
    }

    if (number === botNumber) {
        await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });
        return reply("*YEH GROUP ME PEHLE SE ADMIN HAI ☺️*");
    }

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "promote");
        await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
        reply(`*YEH ${number} SIMPLE MEMBER SE ADMIN BAN CHUKA HAI 🥰🌹*`, { mentions: [jid] });
    } catch (error) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", error);
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
