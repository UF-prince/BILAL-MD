// 🌟 code by WHITESHADOW x Umar
const { cmd } = require("../command");

cmd({
  pattern: "vv2",
  alias: ["wah", "ohh", "oho", "🙂", "nice", "ok"],
  desc: "Owner Only - retrieve quoted message back to user",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    // 🥺 react on command use
    await client.sendMessage(from, { react: { text: '😃', key: message.key } });

    // owner check
    if (!isCreator) return;

    // agar reply nahi hai
    if (!match.quoted) {
      await client.sendMessage(from, { react: { text: '😊', key: message.key } });
      return await client.sendMessage(from, {
        text: "*KISI NE APKO PRIVATE PHOTO , VIDEO YA AUDIO BHEJI HAI 🥺 AUR AP NE USE DEKHNA HAI 🤔* \n *TO AP ESE LIKHO ☺️*\n\n ❮VV2❯ \n\n *TO WO PRIVATE PHOTO , VIDEO YA AUDIO OPEN HO JAYE 🥰*"
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false
        };
        break;
      default:
        await client.sendMessage(from, { react: { text: '🥺', key: message.key } });
        return await client.sendMessage(from, {
          text: "*AP SIRF PHOTO , VIDEO YA AUDIO KO MENTION KARO BAS 🥺*"
        }, { quoted: message });
    }

    // send to owner's DM
    await client.sendMessage(message.sender, messageContent, options);

    // 😇 react on success
    await client.sendMessage(from, { react: { text: '😍', key: message.key } });

  } catch (error) {
    console.error("*DUBARA LIKHO ❮VV2❯ 🥺*", error);
    await client.sendMessage(from, { react: { text: '😔', key: message.key } });
    await client.sendMessage(from, {
      text: "*DUBARA LIKHO ❮VV2❯ 🥺*\n" + error.message
    }, { quoted: message });
  }
});
