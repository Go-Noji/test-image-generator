import {ref} from "vue";

// バリデーション指定時の型
export type REQUIRED = 'required';
export type COLOR = 'color';
export type NUMBER = 'number';
export type INTEGER = 'integer';
export type MAX = {rule: 'max', value: number};
export type MIN = {rule: 'min', value: number};
export type LIST = {rule: 'list', value: string[]};

// バリデーション指定
type RULE = REQUIRED | COLOR | NUMBER | INTEGER | MAX | MIN | LIST;
type RULES = RULE[];

// 指定されたバリデーションを行う関数とその結果発生したバリデーションメッセージ配列を返す
export const useValidator = function (rules: RULES, label: string) {

  // バリデーションの結果発生したエラーメッセージ
  const errors= ref<{uuid: string, message: string}[]>([]);

  // uuid 生成用(v-for の :key 用)
  const _generateUniqueId: () => string = () => Math.random().toString(36).slice(-8);

  // 与えられた RULE が MAX であるか判定
  const _isMax = (rule: RULE): rule is MAX => rule instanceof Object && rule !== null && 'rule' in rule && rule.rule === 'max';

  // 与えられた RULE が MIN であるか判定
  const _isMin = (rule: RULE): rule is MIN => rule instanceof Object && rule !== null && 'rule' in rule && rule.rule === 'min';

  // 与えられた RULE が LIST であるか判定
  const _isList = (rule: RULE): rule is LIST => rule instanceof Object && rule !== null && 'rule' in rule && rule.rule === 'list';

  // 必須バリデーション
  const _validRequired: (value: string) => void = (value: string) => {
    // 問題なければなにもしない
    if (value !== '') {
      return;
    }

    // エラーの登録
    errors.value.push({uuid: _generateUniqueId(), message: label+'は必須です'});
  };

  // カラーコードバリデーション
  const _validColor: (value: string) => void = (value) => {
    // 何も入力されていない場合は何もしない
    if (value === '') {
      return;
    }

    // 問題なければなにもしない
    if (/^#[A-Za-z0-9]{6}$/.test(value)) {
      return;
    }

    // エラーの登録
    errors.value.push({uuid: _generateUniqueId(), message: label+'がカラーコードを示していません('+value+')'});
  };

  // 数値バリデーション
  const _validNumber: (value: string) => void = (value) => {
    // 何も入力されていない場合は何もしない
    if (value === '') {
      return;
    }

    // 問題なければなにもしない
    if (/^-?[0-9]+(\.[0-9]+)?$/.test(value)) {
      return;
    }

    // エラーの登録
    errors.value.push({uuid: _generateUniqueId(), message: label+'が数値ではありません'});
  };

  // 整数バリデーション
  const _validInteger: (value: string) => void = (value) => {
    // 何も入力されていない場合は何もしない
    if (value === '') {
      return;
    }

    // 問題なければなにもしない
    if (/^-?[0-9]+$/.test(value)) {
      return;
    }

    // エラーの登録
    errors.value.push({uuid: _generateUniqueId(), message: label+'が整数ではありません'});
  };

  // 最大値制限バリデーション
  const _validMax: (value: string, max: number) => void = (value, max) => {
    // 何も入力されていない場合は何もしない
    if (value === '') {
      return;
    }

    // 問題なければなにもしない
    if (Number(value) <= max) {
      return;
    }

    // エラーの登録
    errors.value.push({uuid: _generateUniqueId(), message: label+`は${(new Intl.NumberFormat().format(max))}以下である必要があります`});
  };

  // 最小値制限バリデーション
  const _validMix: (value: string, min: number) => void = (value, min) => {
    // 何も入力されていない場合は何もしない
    if (value === '') {
      return;
    }

    // 問題なければなにもしない
    if (Number(value) >= min) {
      return;
    }

    // エラーの登録
    errors.value.push({uuid: _generateUniqueId(), message: label+`は${(new Intl.NumberFormat().format(min))}以上である必要があります`});
  };

  // 文言一致バリデーション
  const _validList: (value: string, lists: string[]) => void = (value, lists) => {
    // 何も入力されていない場合は何もしない
    if (value === '') {
      return;
    }

    // 問題なければなにもしない
    if (lists.some(list => list === value)) {
      return;
    }

    // エラーの登録
    errors.value.push({uuid: _generateUniqueId(), message: label+'が不正です'});
  };

  // フォーム部品の @change にひっかけるバリデーション関数を生成して返す
  const _generateValidator: () => (value: string) => boolean = () => (value: string) => {
    // エラーを空にする
    errors.value = [];

    // 必須バリデーション
    if (rules.some(rule => rule === 'required')) {
      _validRequired(value);
    }

    // カラーコードバリデーション
    if (rules.some(rule => rule === 'color')) {
      _validColor(value);
    }

    // 数値バリデーション
    if (rules.some(rule => rule === 'number')) {
      _validNumber(value);
    }

    // 整数バリデーション
    if (rules.some(rule => rule === 'integer')) {
      _validInteger(value);
    }

    // 最大値制限バリデーションが存在するか判定を兼ねて取得
    const maxRule = rules.find(rule => _isMax(rule));

    // 最大値制限バリデーション
    if (maxRule && _isMax(maxRule)) {
      _validMax(value, maxRule.value);
    }

    // 最小値制限バリデーションが存在するか判定を兼ねて取得
    const minRule = rules.find(rule => _isMin(rule));

    // 最小値制限バリデーション
    if (minRule && _isMin(minRule)) {
      _validMix(value, minRule.value);
    }

    // 文言一致バリデーションが存在するか判定を兼ねて取得
    const listRule = rules.find(rule => _isList(rule));

    // 文言一致バリデーション
    if (listRule && _isList(listRule)) {
      _validList(value, listRule.value);
    }

    // エラーが存在すれば false を返す
    return errors.value.length === 0;
  };

  // バリデーション監視用関数とリアクティブなエラー配列を返す
  return {errors, validator: _generateValidator()};

};