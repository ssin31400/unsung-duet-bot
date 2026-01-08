// src/commands/registerFragment.js
import { SlashCommandBuilder, MessageFlags } from "discord.js";
import pc from "../character/pc.js";

const shifter = pc.shifter;
const binder = pc.binder;
const FRAGMENT_COUNT = 6;
const SHIFTER_NAME = "시프터";
const BINDER_NAME = "바인더";
let name = "";
let role = "";
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
        .setRequired(true) // 필수 옵션
  )
  .addStringOption((option) =>
    option
      .setName("role")
      .setDescription("시프터 또는 바인더 중 역할을 선택합니다.")
      .setRequired(true) // 필수 옵션
      .addChoices(
        { name: "시프터", value: "shifter" },
        { name: "바인더", value: "binder" }
      )
  )
  .addStringOption(
    (option) =>
      option
        .setName("fragments")
        .setDescription("입력 예시 ex) 내용1/내용2/내용3.../내용6")
        .setRequired(true) // 필수 옵션
  );

// 명령어가 실행될 때 호출될 함수입니다.
export async function execute(interaction) {
  name = interaction.options.getString("name");
  role = interaction.options.getString("role");
  const fragStr = interaction.options.getString("fragments");
  fragments = fragStr.split("/").map((element) => {
    return { value: element.trim(), changed: false, changedValue: "" };
  });
  let targetCharacter = null;

  if (name.trim() === "") {
    await interaction.reply({
      content: "이름은 공백일 수 없습니다.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (fragments.length < FRAGMENT_COUNT) {
    await interaction.reply({
      content: `프래그먼트는 ${FRAGMENT_COUNT}개 이상 등록해야 합니다.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  } else {
    if (role === "shifter") {
      targetCharacter = shifter;
      targetCharacter.set("roleTag", SHIFTER_NAME);
    } else if (role === "binder") {
      targetCharacter = binder;
      targetCharacter.set("roleTag", BINDER_NAME);
      targetCharacter.set("fragEffCnt", 6); // 바인더의 프래그먼트 효과 개수 초기화
    } else {
      await interaction.reply({
        content: "유효하지 않은 역할입니다.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    if (
      Array.isArray(targetCharacter.get("fragments")) &&
      targetCharacter.get("fragments").length > 0
    ) {
      targetCharacter.set("fragments", new Array());
    }
    targetCharacter.set("name", name);
    targetCharacter.set("role", role);
    targetCharacter.set("fragments", fragments);
  }

  await interaction.reply({
    content: `**${name}** 캐릭터의 프래그먼트가 등록되었습니다.`,
  });
}
