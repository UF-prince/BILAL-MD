const config = require('../config');
const { cmd, commands } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "menu",
    alias: ["m","me","men","meno","menu1","menus","list","li","lis","lists","allcmd","allcmds","totalcmds","cmd","cmds","show","showcmd"],
    desc: "Show interactive menu system line by line",
    category: "menu",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Platform function
        function getPlatform() {
            if (process.env.HEROKU_APP_NAME) return "Heroku";
            if (process.env.KOYEB_API) return "Koyeb";
            if (process.env.RENDER) return "Render";
            if (process.env.TERMUX) return "Termux";
            return "Panel";
        }

        const displayName = m.pushName || m.sender.split('@')[0] || 'User';

        // Menu text
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
*┃👑│ • LEFT*
*┃👑│ • JOIN*
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

*👑 clICK HERE FOR HELP 👑*

*👑 SUPPORT WEBSITE 👑*
*https://akaserein.github.io/Bilal/*

*👑 SUPPORT CHANNEL 👑* 
*https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G*

*👑 SUPPORT GROUP 👑*
*https://chat.whatsapp.com/BwWffeDwiqe6cjDDklYJ5m?mode=ems_copy_t*

*👑 BILAL-MD WHATSAPP BOT 👑*`;

        // 1️⃣ Send image with caption first
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/kunzpz.png' },
            caption: "*👑 BILAL-MD MENU 👑*"
        }, { quoted: mek });

        // 2️⃣ Wait 1 second
        await sleep(1000);

        // 3️⃣ Send menu line-by-line
        const lines = menuText.split("\n");
        let currentText = "";
        const msg = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        for (const line of lines) {
            currentText += line + "\n";
            await sleep(500); // 0.5 sec
            // Edit menu message
            await conn.relayMessage(from, {
                protocolMessage: {
                    key: msg.key,
                    type: 14,
                    editedMessage: { conversation: currentText }
                }
            }, {});
        }

    } catch (e) {
        console.error('Menu Error:', e);
        reply(`❌ Menu error: ${e.message}`);
    }
});
