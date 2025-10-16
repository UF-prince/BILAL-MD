// 🌟 coded by WHITESHADOW x Umar
const { cmd } = require("../command");

cmd({
  pattern: "vv",
  alias: ["viewonce", "view", "open"],
  react: "🥺",
  desc: "Owner Only - retrieve quoted message back to user",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    // 🥺 react on command use
    await client.sendMessage(from, { react: { text: "🥺", key: message.key } });

    // sirf owner check
    if (!isCreator) {
      await client.sendMessage(from, { react: { text: "😎", key: message.key } });
      return await client.sendMessage(from, {
        text: "*YEH COMMAND SIRF MERE LIE HAI ☺️*"
      }, { quoted: message });
    }

    // agar reply nahi hai
    if (!match.quoted) {
      await client.sendMessage(from, { react: { text: "☺️", key: message.key } });
      return await client.sendMessage(from, {
        text: "*AP KISI PRIVATE PHOTO , VIDEO , YA AUDIO KO MENTION KAR KE 🥺* \n*PHIR ESE LIKHO ☺️* \n\n*❮VV❯* \n\n*PHIR DEKHO KAMAL 😎*"
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
          caption: match.quoted.text || "",
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;

      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || "",
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
        await client.sendMessage(from, { react: { text: "😥", key: message.key } });
        return await client.sendMessage(from, {
          text: "*PEHLE KISI VIEW ONCE YA PRIVATE VIDEO AUDIO YA PRIVATE FILE KO MENTION KARO 🥺*"
        }, { quoted: message });
    }

    // media bhejna
    await client.sendMessage(from, messageContent, options);

    // ☺️ react on success
    await client.sendMessage(from, { react: { text: "😃", key: message.key } });

  } catch (error) {
    console.error("vv Error:", error);
    await client.sendMessage(from, { react: { text: "😔", key: message.key } });
    await client.sendMessage(from, {
      text: "❌ ERROR:\n" + error.message
    }, { quoted: message });
  }
});
