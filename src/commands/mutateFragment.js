// src/commands/mutateFragment.js
import {
  SlashCommandBuilder,
  MessageFlags,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import pc from "../character/pc.js";

const shifter = pc.shifter;
const binder = pc.binder;

// 명령어의 기본 정보를 정의합니다.
export const data = new SlashCommandBuilder()
  .setName("mutfrag") // 슬래시 명령어 이름
  .setDescription("프래그먼트 변이를 시작합니다.")
  .addStringOption((option) =>
    option
      .setName("role")
      .setDescription("변이 대상을 선택하세요.")
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
  let fragButtons = null;
  if (role === "shifter") {
    targetCharacter = shifter;
    fragButtons = createFragmentMutationButtons(targetCharacter);
  } else if (role === "binder") {
    targetCharacter = binder;
    fragButtons = createFragmentMutationButtons(targetCharacter);
  } else {
    await interaction.reply({
      content: "유효하지 않은 역할입니다.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.reply({
    content: `**${targetCharacter.get("name")}**의 프래그먼트 변이를 시작합니다. 변이할 프래그먼트를 선택하세요.`,
    components: [fragButtons],
  });
}

// 버튼이 눌렸을 때 호출될 함수입니다.
export async function handleButton(interaction) {
  const customId = interaction.customId;
  const parts = customId.split("_");
  if (parts.length !== 3 || parts[1] !== "frag") {
    return;
  }

  const fragIndex = parseInt(parts[2], 10);
  const role = parts[0];

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

  // 프래그먼트 변이 로직을 여기에 구현합니다.
  let fragments = targetCharacter.get("fragments");
  fragments[fragIndex].changed = true;
}

// 프래그먼트 변이 버튼을 정의하는 함수입니다.
function createFragmentMutationButtons(character) {
  let fragments = character.get("fragments");

  const buttons = new MessageActionRow();
  for (let i = 0; i < fragments.length; i++) {
    buttons.addComponents(
      new MessageButton()
        .setCustomId(`${character.get("role")}_frag_${i}`)
        .setLabel(fragments[i].value)
        .setStyle("DANGER")
    );
  }

  return buttons;
}
