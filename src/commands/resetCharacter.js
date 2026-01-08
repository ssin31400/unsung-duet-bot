// src/commands/resetCharacter.js
import { SlashCommandBuilder, MessageFlags } from "discord.js";
import pc from "../character/pc.js";

const shifter = pc.shifter;
const binder = pc.binder;

// 명령어의 기본 정보를 정의합니다.
export const data = new SlashCommandBuilder()
  .setName("reschar") // 슬래시 명령어 이름
  .setDescription("캐릭터 정보를 초기화합니다.") // 명령어에 대한 설명
  .addStringOption((option) =>
    option
      .setName("role")
      .setDescription("수정할 캐릭터를 선택합니다.")
      .setRequired(true) // 필수 옵션
      .addChoices(
        { name: "시프터", value: "shifter" },
        { name: "바인더", value: "binder" }
      )
  );

// 명령어가 실행될 때 호출될 함수입니다.
export async function execute(interaction) {
  const role = interaction.options.getString("role");
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

  targetCharacter.set("name", "");
  targetCharacter.set("fragments", new Array());

  await interaction.reply({
    content: `${role === "shifter" ? "시프터" : "바인더"}의 캐릭터 정보가 초기화되었습니다.`,
  });
}
