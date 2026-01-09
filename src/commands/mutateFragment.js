// src/commands/mutateFragment.js
import {
  SlashCommandBuilder,
  MessageFlags,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  LabelBuilder,
} from "discord.js";
import pc from "../character/pc.js";

const shifter = pc.shifter;
const binder = pc.binder;
const targetCharacter = null;

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
  targetCharacter = null;
  let fragSelect = null;
  if (role === "shifter") {
    targetCharacter = shifter;
    fragSelect = createFragmentMutationMenu(targetCharacter);
  } else if (role === "binder") {
    targetCharacter = binder;
    fragSelect = createFragmentMutationMenu(targetCharacter);
  } else {
    await interaction.reply({
      content: "유효하지 않은 역할입니다.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.reply({
    content: `**${targetCharacter.get("name")}**의 프래그먼트 변이를 시작합니다. 변이할 프래그먼트를 선택하세요.`,
    components: fragSelect,
  });
}

// 메뉴가 선택되었을 때 호출될 함수입니다.
export async function handleMenu(interaction) {
  const fragIndex = parseInt(interaction.values[0], 10);

  // 프래그먼트 변이 로직을 여기에 구현합니다.
  let fragments = targetCharacter.get("fragments");
  fragments[fragIndex].changed = true;

  console.log(
    `${targetCharacter.get("name")}의 프래그먼트 "${fragments[fragIndex].value}"가 변이되었습니다.`
  );

  // 변이 내용 입력 모달을 표시합니다.
  handleMutationInput(interaction);
}

// 프래그먼트 변이 메뉴를 정의하는 함수입니다.
function createFragmentMutationMenu(character) {
  let fragments = character.get("fragments");
  const action = new ActionRowBuilder();
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(`${character.get("role")}_frag_select`)
    .setPlaceholder("변이할 프래그먼트를 선택하세요.")
    .addOptions(
      // 이미 변이한 프래그먼트는 선택 불가능하게 설정합니다. (추후 수정)
      fragments.map((frag, index) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(frag.value)
          .setValue(index.toString())
      )
    );

  action.addComponents(selectMenu);
  return [action];
}

// 변이 내용을 입력 받습니다.
function handleMutationInput(interaction) {
  const modal = new ModalBuilder()
    .setCustomId("mutationModal")
    .setTitle("프래그먼트 변이 내용 입력");

  const input = new TextInputBuilder()
    .setCustomId("mutationInput")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const inputLabel = new LabelBuilder()
    .setLabel("변이된 프래그먼트 내용을 입력하세요.")
    .setTextInputComponent(input);

  modal.addLabelComponents(inputLabel);

  interaction.showModal(modal);
}

// 변이 내용을 입력받은 후 처리하는 함수입니다.
export async function handleSubmit(interaction) {
  const mutationContent = interaction.fields.getTextInputValue("mutationInput");

  // 변이 내용을 저장합니다.
  let fragments = targetCharacter.get("fragments");
  fragments[mutfragIdx].changedValue = mutationContent;
  targetCharacter.set("fragments", fragments);

  console.log(
    `${targetCharacter.get("name")}의 프래그먼트 "${fragments[mutfragIdx].value}"가 "${mutationContent}"로 변이되었습니다.`
  );

  await interaction.editReply({
    content: `프래그먼트 변이가 완료되었습니다: **${fragments[mutfragIdx].value}** → **${mutationContent}**`,
    components: [],
  });
}
