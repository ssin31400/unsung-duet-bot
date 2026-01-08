// src/commands/inquireFragment.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import pc from "../character/pc.js";

const shifter = pc.shifter;
const binder = pc.binder;
const embed = new EmbedBuilder();
embed.setColor("#FF5733");

// 명령어의 기본 정보를 정의합니다.
export const data = new SlashCommandBuilder()
  .setName("inqfrag") // 슬래시 명령어 이름
  .setDescription("등록된 프래그먼트를 조회합니다.")
  .addStringOption((option) =>
    option
      .setName("role")
      .setDescription("시프터 또는 바인더 중 역할을 선택합니다.")
      .setRequired(true) // 선택적 옵션
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

  if (
    targetCharacter.get("name").trim() === "" ||
    targetCharacter.get("fragments").length === 0
  ) {
    await interaction.reply({
      content: `${role === "shifter" ? "시프터" : "바인더"}의 정보가 등록되어 있지 않습니다.`,
    });
    return;
  }

  embed.setTitle(`${targetCharacter.get("name")}의 프래그먼트 목록`);
  embed.setDescription(`역할: ${targetCharacter.get("roleTag")}`);

  let fragments = targetCharacter.get("fragments");
  embed.spliceFields(0, embed.data.fields?.length ?? 0);
  for (let index = 0; index < fragments.length; index++) {
    embed.addFields({
      name: `프래그먼트 ${index + 1}`,
      value: fragments[index],
    });
  }

  await interaction.reply({
    embeds: [embed],
  });
}
