const { cmd } = require('../command');

cmd({
    pattern: 'readmore',
    alias: ['rm'],
    desc: 'Generate a custom ReadMore text preserving line spaces',
    category: 'tools',
    react: '🥺',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Show "typing..." while processing
        await conn.sendPresenceUpdate('composing', from);

        // Remove command name (.readmore or .rm)
        const input = m.text?.replace(/^(\.readmore|\.rm)\s*/i, '');
        if (!input || input.trim() === '') {
            await conn.sendPresenceUpdate('paused', from);
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply('*AP NE READMORE TEXT BANANA HAI* \n *TO AP ESE LIKHO ☺️♥️* \n\n*❮READMORE BILAL + MD❯* \n\n *AGAR AP ESE LIKHO GE TO APKA READMORE MSG BAN JAYE GA 🥰🌹*');
        }

        // Split using '+'
        const [visible, hidden] = input.split('+');
        const more = String.fromCharCode(8206).repeat(4000); // triggers readmore collapse

        // Preserve user-entered newlines
        const output = hidden
            ? `${visible || ''}${more}${hidden}`
            : `${more}${visible || ''}`;

        // Stop typing before sending reply
        await conn.sendPresenceUpdate('paused', from);

        // Send final message
        await reply(output);

        // React with success emoji 🌹
        await conn.sendMessage(from, { react: { text: '☺️', key: m.key } });

    } catch (err) {
        console.error('❌ Error in readmore:', err.message);

        // Stop typing
        await conn.sendPresenceUpdate('paused', from);

        // React with ⚠️ on error
        await conn.sendMessage(from, { react: { text: '😔', key: m.key } });

        reply('*APKA READMORE TEXT NAHI BANA 😔💔*');
    }
});
