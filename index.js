// 필요한 클래스 import
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

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
client.once("ready", () => {
  console.log("Ready!");
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
