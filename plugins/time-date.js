const { cmd } = require('../command');

cmd({
    pattern: "time",
    desc: "Check the current local time.",
    category: "utility",
    react: "☺️", // ✅ Success reaction
    filename: __filename,
}, 
async (conn, mek, m, { reply, from }) => {
    try {
        const now = new Date();
        const localTime = now.toLocaleTimeString("en-US", { 
            hour: "2-digit", 
            minute: "2-digit", 
            second: "2-digit", 
            hour12: true,
            timeZone: "Asia/Karachi"
        });

        // 🕒 Send message + react on user message
        await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
        reply(`*PAKISTAN ME ABHI YEH TIME HAI 🥰* \n *${localTime}*`);

    } catch (e) {
        console.error("*DUBARA KOSHISH KARE 🥺*", e);

        // 😔 React and error message
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        reply("*DUBARA KOSHISH KARE 🥺*");
    }
});


cmd({
    pattern: "date",
    desc: "Check the current date.",
    category: "utility",
    react: "☺️", // ✅ Success reaction
    filename: __filename,
}, 
async (conn, mek, m, { reply, from }) => {
    try {
        const now = new Date();
        const currentDate = now.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        // 📅 Send message + react on user message
        await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
        reply(`*PAKISTAN ME AJ KI DATE YEH HAI 🥰* \n *${currentDate}*`);

    } catch (e) {
        console.error("*DUBARA KOSHISH KARE 🥺*", e);

        // 😔 React and error message
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        reply("*DUBARA KOSHISH KARE 🥺*");
    }
});