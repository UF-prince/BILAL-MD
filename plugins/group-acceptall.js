const { cmd } = require('../command');

// 🟢 Command: Show all pending join requests
cmd({
    pattern: "requestlist",
    alias: ['approvelist', 'addinglist', 'pending', 'pendinglist', 'pendingmembers', 'joinlist'],
    desc: "Shows pending group join requests",
    category: "group",
    react: "☺️",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: '😫', key: m.key } });
            return reply("*AP YEH COMMAND GROUP ME USE KARO ☺️❤️*");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, { react: { text: '🤐', key: m.key } });
            return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, { react: { text: '😎', key: m.key } });
            return reply("*MUJHE ADMIN BANAYEIN TAAKE ME REQUESTS DEKH SAKU 🥺❤️*");
        }

        const requests = await conn.groupRequestParticipantsList(from);

        if (!requests || requests.length === 0) {
            await conn.sendMessage(from, { react: { text: '☺️', key: m.key } });
            return reply("*KOI BHI NEW MEMBER KI REQUEST ABHI NAHI AYI ☺️❤️*");
        }

        let text = `*YEH SAB LOG GROUP ME JOIN HONA CHAHTE HAI 🥺*\n\n🧾 *Total:* ${requests.length}\n\n`;
        requests.forEach((user, i) => {
            text += `${i + 1}. @${user.jid.split('@')[0]}\n`;
        });

        await conn.sendMessage(from, { react: { text: '😃', key: m.key } });
        await conn.sendMessage(from, { text, mentions: requests.map(u => u.jid) });
    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
        return reply("*ERROR: DUBARA KOSHISH KAREIN 😔*");
    }
});

// ✅ Command: Accept all pending join requests
cmd({
    pattern: "acceptall",
    alias: ['approveall', 'addall', 'adal', 'addal', 'joinall', 'joinmembers'],
    desc: "Accepts all pending group join requests",
    category: "group",
    react: "😃",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '😃', key: m.key } });

        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: '😫', key: m.key } });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, { react: { text: '🤐', key: m.key } });
            return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, { react: { text: '😎', key: m.key } });
            return reply("*PEHLE MUJHE ADMIN BANAYEIN ☺️*");
        }

        const requests = await conn.groupRequestParticipantsList(from);

        if (!requests || requests.length === 0) {
            await conn.sendMessage(from, { react: { text: '🤔', key: m.key } });
            return reply("*KOI BHI REQUEST NAHI HAI ACCEPT KARNE K LIE ☺️❤️*");
        }

        const jids = requests.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "approve");

        await conn.sendMessage(from, { react: { text: '🥰', key: m.key } });
        return reply(`*${requests.length} MEMBERS KI REQUESTS ACCEPT KAR LI GAYI HAI 🥰🌹*`);
    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
        return reply("*ERROR: DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});

// ❌ Command: Reject all pending join requests
cmd({
    pattern: "rejectall",
    alias: ['delall', 'deleteall', 'removeall', 'kickall', 'delrequests', 'delrequest'],
    desc: "Rejects all pending group join requests",
    category: "group",
    react: "☹️",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '☹️', key: m.key } });

        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: '😫', key: m.key } });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, { react: { text: '🤐', key: m.key } });
            return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, { react: { text: '😎', key: m.key } });
            return reply("*PEHLE MUJHE ADMIN BANAYEIN ☺️❤️*");
        }

        const requests = await conn.groupRequestParticipantsList(from);

        if (!requests || requests.length === 0) {
            await conn.sendMessage(from, { react: { text: '☺️', key: m.key } });
            return reply("*KOI BHI REQUEST NAHI HAI ☺️*");
        }

        const jids = requests.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "reject");

        await conn.sendMessage(from, { react: { text: '😢', key: m.key } });
        return reply(`*IN ${requests.length} MEMBERS KI REQUESTS REJECT HO CHUKI HAI 🥺❤️*`);
    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '🥺', key: m.key } });
        return reply("*ERROR: DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});