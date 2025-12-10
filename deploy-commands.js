// src/deploy-commands.js
// 명령어를 추가할 때마다 실행
import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
const __dirname = path.resolve();
const commands = [];

// .env 파일에서 환경 변수를 로드합니다.
dotenv.config();

// 명령어 파일을 불러옵니다.
const commandsPath = path.join(__dirname, "src/commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const fileUrl = new URL(`file://${filePath}`).href;
  const command = await import(fileUrl);

  // 명령어 데이터를 JSON으로 바꿔서 배열에 저장합니다.
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

export async function deployCommands(guildId) {
  try {
    console.log(`Started refreshing application`);

    // 특정 서버에 명령어를 등록합니다.
    // 모든 서버에 등록하려면 Routes.applicationCommands(config.DISCORD_CLIENT_ID)를 사용합니다.
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId),
      {
        body: commands,
      },
    );

    console.log(`Successfully reloaded application`);
  } catch (error) {
    console.error(error);
  }
}

// 함수 바깥에서 실행합니다.
await deployCommands(process.env.DISCORD_GUILD_ID);
