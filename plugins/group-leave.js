const { sleep } = require('../lib/functions');
const config = require('../config')
const { cmd, commands } = require('../command')

cmd({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc"],
    desc: "Leave the group",
    react: "😫",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply
}) => {
    try {
        // 1️⃣ Check if group
        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: "😫", key: m.key } });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️*");
        }

        // 2️⃣ Check if bot owner
        const botOwner = conn.user.id.split(":")[0]; 
        if (senderNumber !== botOwner) {
            await conn.sendMessage(from, { react: { text: "😎", key: m.key } });
            return reply("*YE COMAND SIRF MERE LIE HAI 😎*");
        }

        // 3️⃣ Leaving group
        await conn.sendMessage(from, { react: { text: "🥰", key: m.key } });
        reply("*MENE YEH GROUP LEFT KAR DIA HAI 🥺 AP SAB KO ALLAH KHUSH RAHE AMEEN 🤲 ALLAH HAFIZ TAKE CARE ALL ☹️💔*");
        await sleep(1500);
        await conn.groupLeave(from);

        // 4️⃣ After leaving
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        await conn.sendMessage(from, { text: "*ALLAH HAFIZ KHUSH RAHO AP SAB 🥺 MENE YE GROUP LEFT KAR DIA HAI 😔💔*" });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        reply(`*DUBARA KOSHISH KARE 😔*`);
    }
});
