// apk-download.js
// Download APK from Aptoide with react & waiting message

const { cmd } = require("../command");
const axios = require("axios");

cmd({
  pattern: "apk",
  alias: ["app", "apps", "application", "ap"],
  desc: "Download APK from Aptoide.",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  let waitMsg;
  try {
    // React command message 🥺
    await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

    if (!q) return reply("*AGAR AP NE KOI APP DOWNLOAD KARNI HAI 🥺* \n *TO AP ESE LIKHO 😇* \n\n *APK ❮APKI APP KA NAME❯* \n\n *TO APKI APPLICATION DOWNLOAD KAR KE YAHA PER BHEJ DE JAYE GE*");

    // Waiting message
    waitMsg = await conn.sendMessage(from, { text: "*APKI APK DOWNLOAD HO RAHI HAI 🥺 JAB DOWNLOAD COMPLETE HO JAYE GE TO YAHA PER BHEJ DE JAYE GE 😇* \n *THORA SA INTAZAR KARE...☺️*" });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.datalist || !data.datalist.list.length) {
      if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
      return reply("*APKI APK NAHI MILI SORRY 😔*");
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2);

    // Send APK
    await conn.sendMessage(from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: `*👑 APK NAME 👑* \n ${app.name} \n *👑 APK MB 👑*\n (${appSize} MB) \n\n *👑 BY :❯ BILAL-MD 👑*`
    }, { quoted: m });

    // Delete waiting message
    if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });

    // React command message ☺️ after successful download
    await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });

  } catch (error) {
    console.error("*DUBARA KOSHISH KAREIN 🥺💓* \n *APP NAHI MIL RAHI 😔*", error);
    if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
    reply("*DUBARA KOSHISH KAREIN 🥺💓* \n *APP NAHI MIL RAHI 😔*");
    // React error
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
  }
});
