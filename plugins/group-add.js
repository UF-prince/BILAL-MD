const { cmd } = require('../command');
const fetch = require('node-fetch');
const { getBinaryNodeChild, getBinaryNodeChildren } = require('@whiskeysockets/baileys');

cmd({
    pattern: "add",
    desc: "Add a user to the group (admin only)",
    category: "group",
    react: "🥺",
    filename: __filename
}, 
async (conn, mek, m, { from, q, sender, reply, isGroup }) => {
    try {
        // React command msg 🥺
        await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: "🤐", key: m.key } });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KARE 🤐*");
        }

        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants.map(p => p.id);

        if (!q) return reply("*AGAR AP NE KISI KO IS GROUP MEADD KARNA HAI 🥺💞* \n *TO AP ESE LIKHO 😍🌺* \n \n *❮ADD +9230xxxx❯* \n \n *IS NUMBER KI JAGAH AP NE JIS KO ADD KARNA HAI 😇🌹* \n *USKA NUMBER COMMAND ❮ADD❯ KE BAD LIKHO 🥰💓* \n *TO WO NUMBER IS GROUP ME ADD KAR DIYA JAYE GA ☺️♥️*");

        // Clean and prepare numbers
        let numbers = q.split(',')
            .map(v => v.replace(/[^0-9]/g, ''))
            .filter(v => v.length > 4 && v.length < 20 && !participants.includes(v + "@s.whatsapp.net"));

        if (numbers.length === 0) {
            await conn.sendMessage(from, { react: { text: "😃", key: m.key } });
            return reply("*YEH NUMBER IS GROUP ME PEHLE SE MOJUD HAI 😃*");
        }

        let users = (await Promise.all(
            numbers.map(async v => [
                v,
                await conn.onWhatsApp(v + "@s.whatsapp.net")
            ])
        ))
        .filter(v => v[1][0]?.exists)
        .map(v => v[0] + "@s.whatsapp.net");

        if (users.length === 0) {
            await conn.sendMessage(from, { react: { text: "😫", key: m.key } });
            return reply("*IS NUMBER PER WHATSAPP NAHI BANI HUI 😫*");
        }

        // Try to add users
        const response = await conn.query({
            tag: "iq",
            attrs: {
                type: "set",
                xmlns: "w:g2",
                to: from,
            },
            content: users.map(jid => ({
                tag: "add",
                attrs: {},
                content: [{ tag: "participant", attrs: { jid } }]
            }))
        });

        const add = getBinaryNodeChild(response, "add");
        const participant = getBinaryNodeChildren(add, "participant");

        for (const user of participant.filter(item => item.attrs.error == 403)) {
            const jid = user.attrs.jid;
            const content = getBinaryNodeChild(user, "add_request");
            const invite_code = content.attrs.code;
            const invite_code_exp = content.attrs.expiration;

            let teks = `ADD NAHI HUWA 🥺 @${jid.split('@')[0]} Q K IS GROUP ME SIRF ADMINS CONTACTS KO ADD KAR SAKTE HAI 🥺💓*`;
            await conn.sendMessage(from, { text: teks, mentions: [jid] }, { quoted: mek });
            await conn.sendMessage(from, { react: { text: "😥", key: m.key } });

            // Optional: auto invite
            // await conn.sendGroupV4Invite(from, jid, invite_code, invite_code_exp, groupMetadata.subject, 'Invitation to join group', jpegThumbnail)
        }

        if (users.length > 0) {
            await conn.sendMessage(from, {
                text: `*YEH NUMBER IS GROUP ME ADD HO CHUKA HAI* \n*MOST WELCOME NEW MEMBER ☺️♥️* \n${users.map(u => "@" + u.split("@")[0]).join(", ")}`,
                mentions: users
            }, { quoted: mek });
            await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
        }

    } catch (e) {
        console.error("*YEH NUMBER GROUP ME ADD NAHI HO RAHA 🥺*", e);
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        reply("*YEH NUMBER GROUP ME ADD NAHI HO RAHA 🥺*");
    }
});
