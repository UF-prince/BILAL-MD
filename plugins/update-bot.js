const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require("../data/updateDB");

// =========================================
// 🔄 AUTO UPDATE COMMAND FOR BILAL-MD BOT
// =========================================
cmd({
  pattern: "update",
  alias: ["upgrade", "sync"],
  react: "🆕",
  desc: "Update the bot to the latest version.",
  category: "misc",
  filename: __filename,
}, async (client, m, store, { reply, isOwner }) => {
  try {
    if (!isOwner) return reply("⚠️ This command is for the bot owner only.");

    await reply("🔍 Checking for updates from GitHub...");

    // Fetch the latest commit hash from your GitHub repo
    const { data: commitData } = await axios.get(
      "https://api.github.com/repos/BilalTech05/BILAL-MD/commits/main"
    );
    const latestCommit = commitData.sha;
    const currentCommit = await getCommitHash();

    if (latestCommit === currentCommit) {
      return reply("✅ Your bot is already up-to-date!");
    }

    await reply("🚀 New version found! Updating BILAL-MD...");

    // Download latest ZIP from GitHub
    const zipUrl = "https://github.com/BilalTech05/BILAL-MD/archive/refs/heads/main.zip";
    const zipPath = path.join(__dirname, "update.zip");
    const { data: zipData } = await axios.get(zipUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(zipPath, zipData);

    await reply("📦 Extracting new files...");
    const extractPath = path.join(__dirname, "update-temp");
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);

    // ⚙️ Correct folder name inside ZIP (GitHub appends "-main")
    const sourcePath = path.join(extractPath, "BILAL-MD-main");
    const destinationPath = path.join(__dirname, "..");

    // Copy files safely
    await reply("🔄 Replacing old files with the latest ones...");
    copyFolderSync(sourcePath, destinationPath);

    // Save new commit hash
    await setCommitHash(latestCommit);

    // Cleanup
    fs.unlinkSync(zipPath);
    fs.rmSync(extractPath, { recursive: true, force: true });

    await reply("✅ Update complete! Restarting the bot...");
    process.exit(0);
  } catch (error) {
    console.error("❌ Update error:", error);
    reply("⚠️ Update failed. Please try again or update manually.");
  }
});

// =============================
// 📂 Copy Folder Helper
// =============================
function copyFolderSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const items = fs.readdirSync(source);
  for (const item of items) {
    // Skip personal files
    if (["config.js", "app.json", ".env"].includes(item)) {
      console.log(`⏩ Skipping ${item} to preserve settings.`);
      continue;
    }

    const srcPath = path.join(source, item);
    const destPath = path.join(target, item);

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
