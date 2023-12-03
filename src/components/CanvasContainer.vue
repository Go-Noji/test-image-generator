<script lang="ts" setup>
import {computed, inject, onMounted, watch} from "vue";
import {USE_CONTROLS_KEY, useControls} from "../compositions/useControls.ts";
import {useCanvas} from "../compositions/useCanvas.ts";

// 配信されたコンポジションの入手
const controlsComposition = inject(USE_CONTROLS_KEY, useControls());

// canvas を描画する領域の style を可変させる
const wrapStyle = computed(() => `width:${controlsComposition.state.width}px;height:${controlsComposition.state.height}px;`);

// 起動時に ctx を controlsComposition に登録
onMounted(() => {
  // canvas の取得
  const canvas = document.getElementById('preview-canvas');

  // canvas 要素の取得に失敗したら何もしない
  if ( ! canvas || ! (canvas instanceof HTMLCanvasElement)) {
    return;
  }

  // canvas 操作用の context を取得
  const ctx = canvas.getContext('2d');

  // context の取得に失敗したら何もしない
  if ( ! ctx) {
    return;
  }

  // Canvas 操作用の composition を生成
  const canvasComposition = useCanvas(ctx);

  // 内容が変わったら再描画
  watch(controlsComposition.updateCount, () => {
    canvasComposition.render(controlsComposition.inputs.value);
  });

  // 初期描画
  canvasComposition.render(controlsComposition.inputs.value);
});
</script>

<template>
  <div :style="wrapStyle">
    <canvas
      :width="controlsComposition.state.width"
      :height="controlsComposition.state.height"
      id="preview-canvas"
    ></canvas>
  </div>
</template>