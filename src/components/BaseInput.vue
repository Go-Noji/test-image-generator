<script lang="ts" setup>
// Props 定義
const props = defineProps<{
  // type 属性そのまま
  type: 'text' | 'number' | 'color',

  // エラーメッセージ。uuid は :key 用
  errors: {uuid: string, message: string}[],

  // 入力値
  value: string,

  // 最大値属性
  max?: number,

  // 最小値属性
  min?: number,

  // ラベルテキスト
  label?: string,

  // name 属性値
  name?: string,

  // バリデーション用関数
  validator?: (string: string) => boolean
}>();

// Emits 定義
const emits = defineEmits<{
  // 値が変化した
  'change': [payload: {value: string, name: string, valid: boolean}]
}>();

// change イベント時にバリデーションと値の変更を行う
const changeListener = (event: Event) => {
  // 対象の DOM が input 要素でなければ何もしない
  if (
    ! ('target' in event) ||
    ! (event.target instanceof HTMLInputElement)
  ) {
    return;
  }

  // 変更を親へ通知
  emits('change', {
    value: event.target.value,
    name: props.name === undefined ? '' : props.name,
    valid: props.validator ? props.validator(event.target.value) : true
  });
};
</script>

<template>
  <label class="l-form-label">
    <div class="l-form-label-wrap l-input-label-wrap">
      <span
        v-show="label !== undefined"
        class="l-form-title l-w-30"
      >{{label}}</span>
      <input
        :type="type"
        :value="value"
        :name="name"
        :max="max"
        :min="min"
        class="l-input l-w-30"
        @change="changeListener"
      >
      <span
        v-if="type === 'color'"
        class="l-input-color"
      >&nbsp;{{value}}</span>
    </div>
    <div class="l-form-errors">
      <p
        v-for="error in errors"
        :key="error.uuid"
        class="l-form-error"
      >{{error.message}}</p>
    </div>
  </label>
</template>