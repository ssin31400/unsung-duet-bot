// src/commands/registerFragment.js
import { SlashCommandBuilder, MessageFlags } from "discord.js";

import fs from "fs";
import path from "path";
const __dirname = path.resolve();

// 시프터/바인더 파일 불러오기
const shifterPath = path.join(__dirname, "src/json/");
const shifterFile = fs.readFileSync(shifterPath + "shifter.json", "utf8");
const shifter = JSON.parse(shifterFile);
// const binderPath = path.join(__dirname, 'src/json/binder.json');
// const binderFile = fs
//   .readFileSync(binderPath);

const FRAGMENT_COUNT = 6;
let name = "";
let fragments = [];

// 명령어의 기본 정보를 정의합니다.
export const data = new SlashCommandBuilder()
  .setName("rgfrag") // 슬래시 명령어 이름
  .setDescription("슬래시(/) 기준으로 프래그먼트를 등록합니다.") // 명령어에 대한 설명
  .addStringOption(
    (option) =>
      option
        .setName("name")
        .setDescription("시프터 또는 바인더의 이름을 입력합니다.")
        .setRequired(true), // 선택적 옵션
  )
  .addStringOption(
    (option) =>
      option
        .setName("fragments")
        .setDescription("입력 예시 ex) 내용1/내용2/내용3.../내용6")
        .setRequired(true), // 선택적 옵션
  );

// 명령어가 실행될 때 호출될 함수입니다.
export async function execute(interaction) {
  name = interaction.options.getString("name");
  const fragStr = interaction.options.getString("fragments");
  fragments = fragStr.split("/");

  console.log("name: ", name);
  console.log("fragments: ", fragments);

  if (fragments.length < FRAGMENT_COUNT) {
    await interaction.reply({
      content: `프래그먼트는 ${FRAGMENT_COUNT}개 이상 등록해야 합니다.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  } else {
    shifter.name = name;
    shifter.fragments = fragments;
    console.log("shifter: ", JSON.stringify(shifter));
  }

  fs.writeFileSync(
    shifterPath + "shifter.json",
    JSON.stringify(shifter),
    "utf8",
  );

  await interaction.reply({
    content: `${name} 캐릭터의 프래그먼트가 등록되었습니다.`,
  });
}
