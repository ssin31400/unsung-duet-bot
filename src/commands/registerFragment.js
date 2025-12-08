// src/commands/registerFragment.js
import { SlashCommandBuilder } from "discord.js";

// 시프터/바인더 파일 불러오기

let name = "";
let fragments = [];

// 명령어의 기본 정보를 정의합니다.
export const data = new SlashCommandBuilder()
  .setName("rgFrag") // 슬래시 명령어 이름
  .setDescription("슬래시(/) 기준으로 프래그먼트를 등록합니다.") // 명령어에 대한 설명
  .addStringOption(
    (option) =>
      option
        .setName("캐릭터 이름")
        .setDescription("시프터 또는 바인더의 이름을 입력합니다.")
        .setRequired(true), // 선택적 옵션
  )
  .addStringOption(
    (option) =>
      option
        .setName("프래그먼트")
        .setDescription("입력 예시 ex) 내용1/내용2/내용3.../내용6")
        .setRequired(true), // 선택적 옵션
  );

// 명령어가 실행될 때 호출될 함수입니다.
export async function execute(interaction) {
  name = interaction.options.getString("캐릭터 이름");
  const fragStr = interaction.options.getString("프래그먼트");
  fragments = fragStr.split("/");

  await interaction.reply({
    content: `${name} 캐릭터의 프래그먼트가 등록되었습니다.`,
  });
}
