const config = require('../config');
const { cmd, commands } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "menu",
    alias: ["m", "me", "men", "meno", "menu1", "menus", "list", "li", "lis", "lists", "allcmd", "allcmds", "totalcmds", "cmd", "cmds", "show", "showcmd"],
    desc: "Show interactive menu system line by line",
    category: "menu",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Platform & User
        function getPlatform() {
            if (process.env.HEROKU_APP_NAME) return "Heroku";
            if (process.env.KOYEB_API) return "Koyeb";
            if (process.env.RENDER) return "Render";
            if (process.env.TERMUX) return "Termux";
            return "Panel";
        }
        const displayName = m.pushName || m.sender.split('@')[0] || 'User';

        // Full menu text
        const menuText = `*╭━━━〔 👑 BiLAL-MD 👑 〕━━━┈⊷*
*┃👑╭──────────────*
*┃👑│ USER:❯ ${config.OWNER_NAME}*
*┃👑│ USER:❯ ${config.OWNER_NUMBER}*
*┃👑│ MODE :❯ ${config.MODE}*
*┃👑│ PREFiX :❯ ${config.PREFIX}*
*┃👑│ COMMANDS :❯ ${commands.length}*
*┃👑│ PLATFORM :❯ ${getPlatform()}*
*┃👑╰──────────────*
*╰━━━━━━━━━━━━━━━┈⊷*

*HI ${displayName} G 🥰*
*MERE BOT KA MENU ☺️*
*YEH HAI G 🌹*

*╭━━〔 👑 DOWNLOAD 👑 〕━━┈⊷*
*┃👑│ • FB*
*┃👑│ • TIKTOK*
*┃👑│ • APK*
*┃👑│ • IMG*
*┃👑│ • SONG*
*┃👑│ • VIDEO*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 GROUP 👑 〕━━┈⊷*
*┃👑│ • INVITE*
*┃👑│ • ADD*
*┃👑│ • KICK*
*┃👑│ • PROMOTE*
*┃👑│ • DEMOTE*
*┃👑│ • DISMISS*
*┃👑│ • MUTE*
*┃👑│ • UNMUTE*
*┃👑│ • LOCKGC*
*┃👑│ • UNLOCKGC*
*┃👑│ • TAGALL*
*┃👑│ • HTAG*
*┃👑│ • PENDING*
*┃👑│ • ACCEPTALL*
*┃👑│ • REJECTALL*
*┃👑│ • GDESC*
*┃👑│ • GNAME*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 USER 👑 〕━━┈⊷*
*┃👑│ • BLOCK*
*┃👑│ • UNBLOCK*
*┃👑│ • GETPP*
*┃👑│ • RESTART*
*┃👑│ • UPDATE*
*┃👑│ • AUTOBIO*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 AI 👑 〕━━┈⊷*
*┃👑│ • AI*
*┃👑│ • GPT*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 LOGO 👑 〕━━┈⊷*
*┃👑│ • LOGO1*
*┃👑│ • LOGO2*
*┃👑│ • LOGO3*
*┃👑│ • LOGO4*
*┃👑│ • LOGO5*
*┃👑│ • LOGO6*
*┃👑│ • LOGO7*
*┃👑│ • LOGO8*
*┃👑│ • LOGO9*
*┃👑│ • LOGO10*
*┃👑│ • LOGO11*
*┃👑│ • LOGO12*
*┃👑│ • LOGO13*
*┃👑│ • LOGO14*
*┃👑│ • LOGO15*
*┃👑│ • LOGO16*
*┃👑│ • LOGO17*
*┃👑│ • LOGO18*
*┃👑│ • LOGO19*
*┃👑│ • LOGO20*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 CONVERTER 👑 〕━━┈⊷*
*┃👑│ • STICKER*
*┃👑│ • STOIMG*
*┃👑│ • TAKE*
*┃👑│ • TOMP3*
*┃👑│ • FANCY*
*┃👑│ • TRT*
*┃👑│ • EMIX*
*┃👑│ • ATTP*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 XTRA 👑 〕━━┈⊷*
*┃👑│ • TIME*
*┃👑│ • DATE*
*┃👑│ • SS*
*┃👑│ • READMORE*
*┃👑│ • TINYURL*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 MAIN 👑 〕━━┈⊷*
*┃👑│ • PING*
*┃👑│ • ALIVE*
*┃👑│ • UPTIME*
*┃👑│ • REPO*
*┃👑│ • OWNER*
*┃👑│ • MENU*
*┃👑│ • RESTART*
*╰━━━━━━━━━━━━━━━┈⊷*

*👑 FOR HELP CLICK HERE 👑*
*https://akaserein.github.io/Bilal/*

*👑 BILAL-MD WHATSAPP BOT 👑*`;

// Emojis array
const emojis = ["🥰","🌹","♥️","💓","😍","💞","🌺","😘","❤️","💘","💞","💕","❣️","💗","💓","😇","☺️","😊","😃","🔰","👑","🙂","🥳"];

// 1️⃣ Send image first
await conn.sendMessage(from, {
    image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/kunzpz.png' },
    caption: "*👑 BILAL-MD MENU 👑*"
}, { quoted: mek });

// 2️⃣ Send loading message
const loadingMsg = await conn.sendMessage(from, {
    text: "*MENU ME COMMANDS ADD HO RAHE HAI 🥺*\n*THORA SA INTAZAR KARE....🥰*"
}, { quoted: mek });

// 3️⃣ Split menu by lines & send line-by-line
const lines = menuText.split("\n");
let currentText = "";
const msg = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

for (const line of lines) {
    currentText += line + "\n";
    await sleep(1000); // 1 sec delay

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    // Edit menu message
    await conn.relayMessage(from, {
        protocolMessage: {
            key: msg.key,
            type: 14,
            editedMessage: { conversation: currentText }
        }
    }, {});

    // React line-by-line with emoji
    await conn.sendMessage(from, { react: { text: randomEmoji, key: msg.key } });
}

// 4️⃣ Menu complete → delete loading message
await conn.sendMessage(from, { react: { text: "✅", key: msg.key } }); // final react
await conn.sendMessage(from, { text: "Menu complete ✔️" }); // optional confirm msg
await conn.relayMessage(from, {
    protocolMessage: {
        key: loadingMsg.key,
        type: 2 // delete message type
    }
}, {});

    } catch (e) {
        console.error('Menu Error:', e);
        reply(`❌ Menu error: ${e.message}`);
    }
});