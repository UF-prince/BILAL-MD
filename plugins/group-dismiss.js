const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin", "dmt"],
    desc: "Demotes a group admin to a normal member",
    category: "admin",
    react: "🥺",
    filename: __filename
},
async(conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply
}) => {

    // ✅ Har msg pe react 🥺
    await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

    // Check if the command is used in a group
    if (!isGroup) {
        await conn.sendMessage(from, { react: { text: "😫", key: m.key } });
        return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
    }

    // Check if the user is an admin
    if (!isAdmins) {
        await conn.sendMessage(from, { react: { text: "😥", key: m.key } });
        return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI AP IS GROUP ME ADMIN NAHI HO 🥺*");
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
        await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });
        return reply("*AP NE KIS MEMBER KO ADMINS KI POST SE DISSMISS KARNA HAI 🥺* \n *US ADMIN KO MENTION YA USKE MSG KO REPLY KARO ☺️* \n *AUR ESE LIKHO 🥺* \n\n *❮DEMOTE❯* \n \n *TO US ADMIN KO ADMIN KI POST SE HATA DYA JAYE GA 😇🌹*");
    }

    if (number === botNumber) {
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        return reply("*SORRY G IS ADMIN KO DISSMISS NAHI KAR SAKTE AP 🥺❤️*");
    }

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "demote");
        await conn.sendMessage(from, { react: { text: "☹️", key: m.key } });
        reply(`*APKO +${number} ADMIN SE DISSMISS KAR DYA GAYA HAI 🥺💔*`, { mentions: [jid] });
    } catch (error) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", error);
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
