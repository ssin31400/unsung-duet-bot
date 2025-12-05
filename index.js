// 필요한 클래스 import
import { Client, Events, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
const __dirname = path.resolve();

// .env 파일에서 환경 변수를 로드합니다.
dotenv.config();

const token = process.env.DISCORD_TOKEN;

// 토큰이 설정되지 않았으면 오류를 출력하고 종료합니다.
if (!token) {
  console.error(
    "오류: DISCORD_TOKEN이 .env 파일에 설정되어 있지 않습니다. .env 파일을 확인해주세요.",
  );
  process.exit(1);
}

// 새로운 디스코드 클라이언트 인스턴스를 생성합니다.
// 인텐트(Intents)는 봇이 어떤 종류의 이벤트에 접근할 수 있는지를 명시합니다.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // 서버 관련 이벤트 (봇 추가/제거, 서버 정보 변경 등)
    GatewayIntentBits.GuildMessages, // 서버 내 메시지 생성/수정/삭제 이벤트
    GatewayIntentBits.MessageContent, // 메시지의 내용을 읽기 위한 권한 (중요! Discord Developer Portal에서 활성화 필요)
  ],
});

// 클라이언트가 준비되면, 코드를 실행합니다. (딱 한번만)
client.once("clientReady", () => {
  console.log("Ready!");
});

// 서버에서 메시지가 생성될 때마다 실행되는 이벤트 리스너입니다.
client.on(Events.MessageCreate, async (message) => {
  // 메시지를 보낸 이가 봇이라면 아무 작업도 하지 않고 반환합니다 (무한 루프 방지).
  if (message.author.bot) return;

  // 사용자가 "핑" 이라고 메시지를 보내면 "퐁!" 이라고 답장합니다.
  if (message.content === "핑") {
    message.reply("퐁!");
  }

  // 사용자가 "안녕" 이라고 메시지를 보내면, 해당 유저를 언급하며 인사합니다.
  // toLowerCase()를 사용하여 대소문자 구분 없이 처리합니다.
  if (message.content.toLowerCase() === "안녕") {
    message.channel.send(
      `안녕하세요, ${message.author.toString()}님! 반가워요.`,
    );
  }
});

client.commands = new Collection();

// 명령어 파일을 불러옵니다.
const commandsPath = path.join(__dirname, 'src/commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const fileUrl = new URL(`file://${filePath}`).href;
  const command = await import(fileUrl);
  
  // 명령어를 Collection에서 불러와 새로운 아이템으로 세팅합니다.
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
    );
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    // 슬래시 커맨드인지 확인합니다.
    if (!interaction.isChatInputCommand()) return;

    // commands 객체에서 명령어 이름으로 해당 명령어 모듈을 가져옵니다.
    const command = client.commands.get(interaction.commandName);

    // 명령어가 존재하지 않으면 아무것도 하지 않습니다.
    if (!command) {
      console.error(
        `No command matching \\${interaction.commandName} was found.\\`,
      );
      return;
    }

    // 명령어의 execute 함수를 실행합니다.
    await command.execute(interaction);
  } catch (error) {
    console.error("Error handling interaction:", error);
    // 사용자에게 오류 메시지를 보낼 수도 있습니다.
    if (interaction.isRepliable()) {
      await interaction.reply({
        content: "명령어 실행 중 오류가 발생했습니다.",
        ephemeral: true,
      });
    }
  }
});

// .env 파일에서 가져온 토큰을 사용하여 Discord에 로그인합니다.
client
  .login(token)
  .then(() => {
    console.log("봇이 Discord에 성공적으로 연결되었습니다.");
  })
  .catch((error) => {
    console.error("봇 로그인 중 오류 발생:", error);
  });
