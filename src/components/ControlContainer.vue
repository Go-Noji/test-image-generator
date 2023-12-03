<script lang="ts" setup>
import {inject} from "vue";
import BaseInput from "./BaseInput.vue";
import BaseSwitch from "./BaseSwitch.vue";
import BaseSelect from "./BaseSelect.vue";
import BaseTextarea from "./BaseTextarea.vue";
import {USE_CONTROLS_KEY, useControls} from "../compositions/useControls.ts";

// emit 定義
const emits = defineEmits<{
  generate: []
}>();

// 配信されたコンポジションの入手
const composition = inject(USE_CONTROLS_KEY, useControls());

// 実際に生成を開始する
const generate = () => {
  // エラーが一つでもあればなにもしない
  if ( ! composition.allGreen.value) {
    return;
  }

  // 整形しつつ generate を発動
  emits('generate');
};
</script>

<template>
  <div class="l-controls">
    <div class="l-control">
      <BaseInput
        :value="composition.state.length"
        :errors="composition.lengthValidation.errors.value"
        :validator="composition.lengthValidation.validator"
        label="生成数"
        name="length"
        type="number"
        :max="99"
        :min="0"
        @change="composition.setLength($event.value)"
      />
    </div>
    <div class="l-control">
      <BaseInput
        :value="composition.state.width"
        :errors="composition.widthValidation.errors.value"
        :validator="composition.widthValidation.validator"
        label="width(px)"
        name="width"
        type="number"
        :max="9999"
        :min="1"
        @change="composition.setWidth($event.value)"
      />
    </div>
    <div class="l-control">
      <BaseInput
        :value="composition.state.height"
        :errors="composition.heightValidation.errors.value"
        :validator="composition.heightValidation.validator"
        label="height(px)"
        name="height"
        type="number"
        :max="9999"
        :min="1"
        @change="composition.setHeight($event.value)"
      />
    </div>
    <div class="l-control">
      <BaseTextarea
        :value="composition.state.text"
        :errors="composition.textValidation.errors.value"
        :validator="composition.textValidation.validator"
        label="テキスト"
        name="text"
        type="text"
        :max="9999"
        :min="1"
        @change="composition.setText($event.value)"
      />
    </div>
    <div class="l-control">
      <BaseInput
        :value="composition.state.textSize"
        :errors="composition.textSizeValidation.errors.value"
        :validator="composition.textSizeValidation.validator"
        label="テキストサイズ(px)"
        name="textSize"
        type="number"
        :max="300"
        :min="1"
        @change="composition.setTextSize($event.value)"
      />
    </div>
    <div class="l-control">
      <BaseInput
        :value="composition.state.textColor"
        :errors="composition.textColorValidation.errors.value"
        :validator="composition.textColorValidation.validator"
        label="文字色"
        name="textColor"
        type="color"
        :max="9999"
        :min="1"
        @change="composition.setTextColor($event.value)"
      />
    </div>
    <div class="l-control">
      <BaseSwitch
        :value="composition.state.textColorShiftHue"
        :errors="composition.textColorShiftHueValidation.errors.value"
        :validator="composition.textColorShiftHueValidation.validator"
        true-value="on"
        false-value="off"
        true-label="on"
        false-label="off"
        label="文字色の色相自動変更"
        name="textColorShiftHue"
        @change="composition.setTextColorShiftHue($event.value)"
      />
    </div>
    <div class="l-control">
      <BaseInput
        :value="composition.state.backgroundColor"
        :errors="composition.backgroundColorValidation.errors.value"
        :validator="composition.backgroundColorValidation.validator"
        label="背景色"
        name="backgroundColor"
        type="color"
        @change="composition.setBackgroundColor($event.value)"
      />
    </div>
    <div class="l-control">
      <BaseSwitch
        :value="composition.state.backgroundColorShiftHue"
        :errors="composition.backgroundColorShiftHueValidation.errors.value"
        :validator="composition.backgroundColorShiftHueValidation.validator"
        true-value="on"
        false-value="off"
        true-label="on"
        false-label="off"
        label="文字色の色相自動変更"
        name="backgroundColorShiftHue"
        @change="composition.setBackgroundColorShiftHue($event.value)"
      />
    </div>
    <div class="l-control">
      <BaseSelect
        :selected="composition.state.shape"
        :errors="composition.shapeValidation.errors.value"
        :validator="composition.shapeValidation.validator"
        :options="[{label: '丸', value: 'circle'}, {label: '四角', value: 'rect'}, {label: '五角形', value: 'pentagon'}, {label: '星', value: 'star'}]"
        label="文字色の色相自動変更"
        name="shape"
        @change="composition.setShape($event.value)"
      />
    </div>
    <button
      type="button"
      :class="{'l-button': true, 'l-button-disable': !composition.allGreen}"
      @click="generate"
    >生成</button>
  </div>
</template>