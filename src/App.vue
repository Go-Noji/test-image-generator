<script lang="ts" setup>
import JSZip from 'jszip';
import {provide, ref} from "vue";
import {useControls, USE_CONTROLS_KEY} from "./compositions/useControls.ts";
import ControlContainer from "./components/ControlContainer.vue";
import CanvasContainer from "./components/CanvasContainer.vue";
import {useCanvas} from "./compositions/useCanvas.ts";
import ResultContainer from "./components/ResultContainer.vue";

// 全てのコンポーネントにユーザー入力値を配信
const composition = useControls();
provide(USE_CONTROLS_KEY, composition);

// 実際に作成された画像
const images = ref<{src: string, key: string}[]>([]);

const dataUrl = ref<string>('');

// 実際に作成
const generate = () => {
  // images を空にする
  images.value = [];

  // JSZip インスタンスを作成
  const zip = new JSZip();

  // 指定回数繰り返す
  for (let i = 0; i < composition.inputs.value.length; i = (i + 1) | 0) {
    // 画像を生成するために canvas オブジェクトを作成
    const canvas = document.createElement('canvas');
    canvas.width = composition.inputs.value.width;
    canvas.height = composition.inputs.value.height;
    const ctx = canvas.getContext('2d');

    // context 取得失敗
    if ( ! ctx) {
      continue;
    }

    // composition を用意
    const canvasComposition = useCanvas(ctx);

    // 実際に描画
    canvasComposition.render(composition.inputs.value, i);

    // 画像を png で取得
    const src = canvas.toDataURL();

    // 画像を追加
    images.value.push({src, key: Math.random().toString(36).slice(-8)});

    // 画像を ZIP ファイルに追加
    zip.file(String(i)+'.png', src.substring(src.indexOf(',') + 1), {base64: true});
  }

  // ZIP ファイルを生成してリンク先へセット
  zip.generateAsync({type: 'blob', compression: 'DEFLATE',　compressionOptions: {level: 9}}).then(function(content) {
    dataUrl.value = window.URL.createObjectURL(content);
  });
};
</script>

<template>
  <h1 class="l-title">TEST 画像ジェネレータ</h1>
  <div class="l-panes">
    <div class="l-pane l-w-70">
      <ControlContainer @generate="generate" />
    </div>
    <div class="l-pane l-w-30">
      <CanvasContainer />
    </div>
  </div>
  <div>
    <ResultContainer
      :data-url="dataUrl"
      :images="images"
      :width="composition.inputs.value.width"
      :height="composition.inputs.value.height"
    />
  </div>
</template>