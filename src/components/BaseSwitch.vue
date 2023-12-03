<script lang="ts" setup>
// Props 定義
import {computed} from "vue";

const props = defineProps<{
  // true 時に返す値
  trueValue: string,

  // false 時に返す値
  falseValue: string,

  // true 時に表示する文言
  trueLabel: string,

  // false 時に表示する文言
  falseLabel: string,

  // エラーメッセージ。uuid は :key 用
  errors: {uuid: string, message: string}[],

  // trueValue or falseValue の現在入力されている方
  value: string,

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

// 現在チェックされているかどうか
const checked = computed(() => props.value === props.trueValue);

// change イベント時にバリデーションと値の変更を行う
const changeListener = (event: Event) => {
  // 対象の DOM が input 要素でなければ何もしない
  if (
    ! ('target' in event) ||
    ! (event.target instanceof HTMLInputElement) ||
    event.target.type !== 'checkbox'
  ) {
    return;
  }

  // 選択されているかどうかで実際の値を決める
  const value = event.target.checked ? props.trueValue : props.falseValue;

  // 変更を親へ通知
  emits('change', {
    value: value,
    name: props.name === undefined ? '' : props.name,
    valid: props.validator ? props.validator(event.target.value) : true
  });
};
</script>

<template>
  <label class="l-form-label">
    <div class="l-form-label-wrap l-switch-label-wrap">
      <span
        v-show="label !== undefined"
        class="l-form-title l-w-30"
      >{{label}}</span>
      <input
        :name="name"
        :checked="checked"
        style="display: none"
        type="checkbox"
        @change="changeListener"
      >
      <div :class="{'l-switch': true, 'l-switch-true': checked, 'l-switch-false': !checked}">
        <div class="l-switch-circle"></div>
        <span class="l-switch-label">{{checked ? trueLabel : falseLabel}}</span>
      </div>
    </div>
    <div class="l-form-errors">
      <p
        v-for="error in errors"
        :key="error.uuid"
        class="l-input-error"
      >{{error.message}}</p>
    </div>
  </label>
</template>