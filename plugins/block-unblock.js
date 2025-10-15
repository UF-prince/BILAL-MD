const { cmd } = require('../command');

// 🔒 BLOCK COMMAND
cmd({
    pattern: "block",
    alias: ["b", "bl", "blo", "bloc", "blok", "blocks", "blocked", "bloks", "blk", "khatam", "bye"],
    desc: "Block user (reply in group or direct in inbox)",
    category: "owner",
    react: "🤐",
    filename: __filename
},
async (conn, m, { reply, react }) => {
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    // 🧠 Agar owner nahi hai
    if (m.sender !== botOwner) {
        await react("🤐");
        return reply("*YEH COMMAND SIRF MERE LIE HAI ☺️*");
    }

    let jid;

    // ✅ Group reply
    if (m.quoted) {
        jid = m.quoted.sender;
    }
    // ✅ Inbox me likha
    else if (m.chat.endsWith("@s.whatsapp.net")) {
        jid = m.chat;
    }
    else {
        await react("🤔");
        return reply("*AGAR AP NE KISI KO BLOCK KARNA HAI 🥺* \n *TO AP ESE LIKHO ☺️* \n \n *❮BLOCK❯ \n \n *TO WO BLOCK HO JAYE GA ☺️*");
    }

    try {
        // 📨 Message before block
        await reply(`*AP MUJHE BAHUT TANG KAR RAHE HAI IS LIE MENE APKO BLOCK KAR DIYA 😒*`);

        // 🔒 Block after delay
        setTimeout(async () => {
            await conn.updateBlockStatus(jid, "block");
            await react("😡");
        }, 1500);

    } catch (err) {
        console.error("*AP ABHI TAK BLOCK NAHI HUWE 😔*", err);
        await react("😔");
        reply("*AP ABHI TAK BLOCK NAHI HUWE 😔*");
    }
});


// 🔓 UNBLOCK COMMAND (FIXED)
cmd({
    pattern: "unblock",
    alias: ["unb", "unbl", "unblo", "unblock", "unblok", "unblocks", "unblocked", "unbloks", "unblk"],
    desc: "Unblock user (reply in group or direct in inbox)",
    category: "owner",
    react: "🤐",
    filename: __filename
},
async (conn, m, { reply, react }) => {
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    // 🧠 Agar owner nahi hai
    if (m.sender !== botOwner) {
        await react("🤐");
        return reply("*YEH COMMAND SIRF MERE LIE HAI ☺️*");
    }

    let jid;

    // ✅ Group reply
    if (m.quoted) {
        jid = m.quoted.sender;
    }
    // ✅ Inbox me likha
    else if (m.chat.endsWith("@s.whatsapp.net")) {
        jid = m.chat;
    }
    else {
        await react("☺️");
        return reply("*AP NE AGAR KISI KO UNBLOCK KARNA HAI 🥺* \n *TO AP ESE LIKHO ☺️* \n \n *❮UNBLOCK❯ \n \n *TO WO UNBLOCK HO JAYE GA ☺️*");
    }

    try {
        // 🔓 Direct unblock without checking list
        await conn.updateBlockStatus(jid, "unblock");
        await react("🥰");
        reply(`*MENE APKO UNBLOCK KAR DYA HAI ☺️ AB AP MUJHE TANG MAT KARNA PLEASE 🥰 WARNA AP PHIR BLOCK HO JAYE GE 😒*`, { mentions: [jid] });
    } catch (err) {
        console.error("*AP ABHI TAK UNBLOCK NAHI HUWE 🥺*", err);
        await react("🥺");
        reply("*AP ABHI TAK UNBLOCK NAHI HUWE 😔*");
    }
});
