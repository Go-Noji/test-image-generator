import {computed, InjectionKey, reactive, ref} from "vue";
import {COLOR_CODE, isColorCode, isShape, SHAPE} from "./useCanvas.ts";
import {useValidator} from "./useValidator.ts";

// ユーザーによる入力値の整形済み情報
export type Inputs = {
  length: number,
  width: number,
  height: number,
  text: string,
  textSize: number,
  textColor: COLOR_CODE,
  textColorShiftHue: boolean,
  backgroundColor: COLOR_CODE,
  backgroundColorShiftHue: boolean,
  shape: SHAPE
};

// ユーザーの入力を一元管理する
export const useControls = function () {

  // 各設定値
  const state = reactive<{
    length: string,
    width: string,
    height: string,
    text: string,
    textSize: string,
    textColor: COLOR_CODE,
    textColorShiftHue: 'on' | 'off',
    backgroundColor: COLOR_CODE,
    backgroundColorShiftHue: 'on' | 'off',
    shape: SHAPE
  }>({
    length: '10',
    width: '300',
    height: '300',
    text: 'test',
    textSize: '100',
    textColor: '#000000',
    textColorShiftHue: 'on',
    backgroundColor: '#FF0000',
    backgroundColorShiftHue: 'on',
    shape: 'circle'
  });

  // 更新がある度にインクリメントされる監視用カウンター
  const updateCount = ref<number>(0);

  // 各設定値に設定するバリデーション情報
  const lengthValidation = useValidator(['required', 'number', {rule: 'min', value: 1}, {rule: 'max', value: 99}], '作成個数');
  const widthValidation = useValidator(['required', 'number', {rule: 'min', value: 1}, {rule: 'max', value: 9999}], 'width(px)');
  const heightValidation = useValidator(['required', 'number', {rule: 'min', value: 1}, {rule: 'max', value: 9999}], 'height(px)');
  const textValidation = useValidator([], 'テキスト');
  const textSizeValidation = useValidator(['required', 'number', {rule: 'min', value: 1}, {rule: 'max', value: 300}], 'テキストサイズ(px)');
  const textColorValidation = useValidator(['color'], '文字色');
  const textColorShiftHueValidation = useValidator([], '文字色の色相自動変更');
  const backgroundColorValidation = useValidator(['color'], '背景色');
  const backgroundColorShiftHueValidation = useValidator([], '背景色の色相自動変更');
  const shapeValidation = useValidator([{rule: 'list', value: ['circle', 'rect', 'pentagon', 'star', 'heart']}], '形状');

  // 生成開始できるかどうか
  const allGreen = computed(() => lengthValidation.errors.value.length === 0 &&
    widthValidation.errors.value.length === 0 &&
    heightValidation.errors.value.length === 0 &&
    textValidation.errors.value.length === 0 &&
    textSizeValidation.errors.value.length === 0 &&
    textColorValidation.errors.value.length === 0 &&
    textColorShiftHueValidation.errors.value.length === 0 &&
    backgroundColorValidation.errors.value.length === 0 &&
    backgroundColorShiftHueValidation.errors.value.length === 0 &&
    shapeValidation.errors.value.length === 0);

  // 現在値の整形
  const inputs = computed<Inputs>((): Inputs => {
    return {
      length: Number(state.length),
      width: Number(state.width),
      height: Number(state.height),
      text: state.text,
      textSize: Number(state.textSize),
      textColor: state.textColor,
      textColorShiftHue: state.textColorShiftHue === 'on',
      backgroundColor: state.backgroundColor,
      backgroundColorShiftHue: state.backgroundColorShiftHue === 'on',
      shape: state.shape
    };
  });

  // 各パラメータの更新
  const setLength = (value: string) => {
    // canvas の描画内容更新のため、更新カウンターをインクリメント
    updateCount.value++;

    // 更新
    state.length = value;
  };
  const setWidth = (value: string) => {
    // canvas の描画内容更新のため、更新カウンターをインクリメント
    updateCount.value++;

    // 更新
    state.width = value;
  };
  const setHeight = (value: string) => {
    // canvas の描画内容更新のため、更新カウンターをインクリメント
    updateCount.value++;

    // 更新
    state.height = value;
  };
  const setText = (value: string) => {
    // canvas の描画内容更新のため、更新カウンターをインクリメント
    updateCount.value++;

    console.log(value);

    // 更新
    state.text = value;
  };
  const setTextSize = (value: string) => {
    // canvas の描画内容更新のため、更新カウンターをインクリメント
    updateCount.value++;

    // 更新
    state.textSize = value;
  };
  const setTextColor = (value: string) => {
    // バリデーション
    if ( ! isColorCode(value)) {
      return;
    }

    // canvas の描画内容更新のため、更新カウンターをインクリメント
    updateCount.value++;

    // 更新
    state.textColor = value;
  };
  const setTextColorShiftHue = (value: string) => {
    // canvas の描画内容更新のため、更新カウンターをインクリメント
    updateCount.value++;

    // 更新
    state.textColorShiftHue = value === 'on' ? 'on' : 'off';
  };
  const setBackgroundColor = (value: string) => {
    // バリデーション
    if ( ! isColorCode(value)) {
      return;
    }

    // canvas の描画内容更新のため、更新カウンターをインクリメント
    updateCount.value++;

    // 更新
    state.backgroundColor = value;
  };
  const setBackgroundColorShiftHue = (value: string) => {
    // canvas の描画内容更新のため、更新カウンターをインクリメント
    updateCount.value++;

    // 更新
    state.backgroundColorShiftHue = value === 'on' ? 'on' : 'off';
  };
  const setShape = (value: string) => {
    // バリデーション
    if ( ! isShape(value)) {
      return;
    }

    // canvas の描画内容更新のため、更新カウンターをインクリメント
    updateCount.value++;

    // 更新
    state.shape = value;
  };

  // 返す
  return {
    state,
    updateCount,
    lengthValidation,
    widthValidation,
    heightValidation,
    textValidation,
    textSizeValidation,
    textColorValidation,
    textColorShiftHueValidation,
    backgroundColorValidation,
    backgroundColorShiftHueValidation,
    shapeValidation,
    allGreen,
    inputs,
    setLength,
    setWidth,
    setHeight,
    setText,
    setTextSize,
    setTextColor,
    setTextColorShiftHue,
    setBackgroundColor,
    setBackgroundColorShiftHue,
    setShape,
  };

};

//composition を注入するためのキー
export const USE_CONTROLS_KEY = Symbol('useSearch') as InjectionKey<ReturnType<typeof useControls>>;
