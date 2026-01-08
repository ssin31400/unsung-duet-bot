// src/commands/modifyCharacter.js
import { SlashCommandBuilder, MessageFlags } from "discord.js";
import pc from "../character/pc.js";

const shifter = pc.shifter;
const binder = pc.binder;
const FRAGMENT_COUNT = 6;

// 명령어의 기본 정보를 정의합니다.
export const data = new SlashCommandBuilder()
  .setName("modchar") // 슬래시 명령어 이름
  .setDescription("캐릭터 정보를 수정합니다.") // 명령어에 대한 설명
  .addStringOption((option) =>
    option
      .setName("role")
      .setDescription("수정할 캐릭터를 선택합니다.")
      .setRequired(true) // 필수 옵션
      .addChoices(
        { name: "시프터", value: "shifter" },
        { name: "바인더", value: "binder" }
      )
  )
  .addStringOption((option) =>
    option
      .setName("choice")
      .setDescription("수정할 정보를 선택합니다.")
      .setRequired(true) // 필수 옵션
      .addChoices(
        { name: "이름", value: "name" },
        { name: "프래그먼트", value: "fragments" }
      )
  )
  .addStringOption(
    (option) =>
      option
        .setName("value")
        .setDescription(
          "이름은 일반 작성, 프래그먼트 입력은 다음 예시를 따라 주세요. ex) 내용1/내용2/내용3.../내용6"
        )
        .setRequired(true) // 필수 옵션
  );

// 명령어가 실행될 때 호출될 함수입니다.
export async function execute(interaction) {
  const role = interaction.options.getString("role");
  const choice = interaction.options.getString("choice");
  const value = interaction.options.getString("value");
  let targetCharacter = null;

  if (role === "shifter") {
    targetCharacter = shifter;
  } else if (role === "binder") {
    targetCharacter = binder;
  } else {
    await interaction.reply({
      content: "유효하지 않은 역할입니다.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (choice === "name") {
    targetCharacter.set("name", value);
    await interaction.reply({
      content: `${role === "shifter" ? "시프터" : "바인더"}의 이름이 **"${value}"**(으)로 수정되었습니다.`,
    });
  } else if (choice === "fragments") {
    const fragments = value.split("/");
    if (fragments.length < FRAGMENT_COUNT) {
      await interaction.reply({
        content: `프래그먼트는 ${FRAGMENT_COUNT}개 이상 등록해야 합니다.`,
        flags: MessageFlags.Ephemeral,
      });
    } else {
      targetCharacter.set("fragments", fragments);
      await interaction.reply({
        content: `**${targetCharacter.get("name")}**의 프래그먼트가 수정되었습니다.`,
      });
    }
  }
}
