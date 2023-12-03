<script lang="ts" setup>
defineProps<{
  dataUrl: string,
  images: {src: string, key: string}[],
  width: number,
  height: number,
}>();
</script>

<template>
  <div class="l-pane">
    <p class="l-paragraph">
      <a
        v-if="dataUrl !== ''"
        :href="dataUrl"
        target="_blank"
        class="l-link"
        download="test.zip"
      >ZIP でダウンロード</a>
    </p>
    <ul class="l-tiles">
      <li
        v-for="image in images"
        :key="image.key"
        class="l-tile"
      ><img
        :src="image.src"
        :width="width"
        :height="height"
        class="l-tile-image"
      ></li>
    </ul>
  </div>
</template>