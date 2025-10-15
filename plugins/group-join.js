const config = require('../config')
const { cmd } = require('../command')
const { sleep } = require('../lib/functions')

// Join group command
cmd({
    pattern: "join",
    react: "☺️",
    alias: ["joinme", "f_join"],
    desc: "To Join a Group from Invite link",
    category: "group",
    use: '.join <Group Link>',
    filename: __filename
}, async (conn, mek, m, { from, q, quoted, isCreator, reply }) => {
    try {
        // Sirf bot creator
        if (!isCreator) {
            await conn.sendMessage(from, { react: { text: "😎", key: mek.key } });
            return reply("*YEH COMMAND SIRF MERE LIE HAI 😎*");
        }

        // Agar owner bina link ke command likhe
        if (!q && !quoted) {
            await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });
            return reply("*AGAR AP NE KOI GROUP JOIN KARNA HAI 🥺* \n *TO AP ESE LIKHO ☺️❤️*\n\n*.JOIN ❮ GROUP LINK ❯* \n\n *JAB AP ESE LIKHO GE 🥺 TO AP GROUP ME JOIN HO JAO GE 🥰💞*");
        }

        let groupLink = "";

        // Agar reply me link hai
        if (quoted && quoted.text) {
            if (quoted.text.includes("https://chat.whatsapp.com/")) {
                groupLink = quoted.text.match(/https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]+)/)[1];
            }
        } else if (q && q.includes("https://chat.whatsapp.com/")) {
            groupLink = q.match(/https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]+)/)[1];
        }

        // Agar link invalid hai
        if (!groupLink) {
            await conn.sendMessage(from, { react: { text: "😥", key: mek.key } });
            return reply("*AGAR AP NE KOI GROUP JOIN KARNA HAI 🥺* \n *TO AP ESE LIKHO ☺️*\n\n*.JOIN ❮GROUP LINK❯* \n\n *JAB AP ESE LIKHO GE 🥺 TO AP GROUP ME JOIN HO JAO GE 🥰*");
        }

        // Accept group invite
        await conn.groupAcceptInvite(groupLink);
        await sleep(1000);
        await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });
        await conn.sendMessage(from, { text: "*GROUP JOIN HO GAYA HAI ☺️*" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*DUBARA KOSHISH KARE 😔*");
    }
});