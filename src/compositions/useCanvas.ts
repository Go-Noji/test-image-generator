import tinycolor from 'tinycolor2';
import {Inputs} from "./useControls.ts";

// 形
export type SHAPE = 'circle' | 'rect' | 'pentagon' | 'star';

// 色
export type COLOR_CODE = string;

// 与えられた文字列が SHAPE 型か判定
export const isShape = (shape: string): shape is SHAPE => shape === 'circle' || shape === 'rect' || shape === 'pentagon' || shape === 'star' || shape === 'heart';

// 与えられた文字列が COLOR_CODE 型か判定
export const isColorCode = (color: string): color is COLOR_CODE => /^#[0-9a-fA-F]{6}$/.test(color);

// 指定されたカンバスの描写を行う
export const useCanvas = function (ctx: CanvasRenderingContext2D) {

  // 指定された HEX カラーコード(例: #F042S9) の色相を変更して返す
  const _getColorChangedHue = (baseColor: COLOR_CODE, angle: number) => {
    // 元の色を tinycolor2 に読み込ませる
    const color = tinycolor(baseColor);

    // HLS 形式に変換
    const hls = color.toHsl();

    // HLS に変換後、色相だけ抜き出して任意の角度変化させる、(% 360 は 360 より大きい角度を指定された場合用)
    const newHue = (hls.h + angle) % 360;

    // 色相情報のみ定義し直して新たな色を生成し、 HEX に変換し、大文字化して返す
    return tinycolor({l: hls.l, s: hls.s, h: newHue})
      .toHexString()
      .toUpperCase();
  }

  // 現在の描画物を削除し、市松模様にする
  const _initCanvas = () => {
    // まずは canvas 内の描画を全てクリアする
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 10px の市松模様を描画
    for (let column = 0, max = Math.ceil(ctx.canvas.width / 10); column < max; column = (column + 1) | 0) {
      for (let row = 0, max = Math.ceil(ctx.canvas.height / 10); row < max; row = (row + 1) | 0) {
        ctx.fillStyle = (column + row) % 2 === 0 ? '#777777' : '#FFFFFF';
        ctx.beginPath();
        ctx.rect(column * 10, row * 10, 10, 10);
        ctx.fill();
      }
    }
  };

  // 背景色を用いて円を描く
  const _renderBackgroundCircle = (color: COLOR_CODE) => {
    // 複数回使用するので半径兼中央座標を事前算出
    const xRadius = ctx.canvas.width / 2;
    const yRadius = ctx.canvas.height / 2;

    // 描画
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(xRadius, yRadius, xRadius, yRadius, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  // 背景色を用いて四角形を描く
  const _renderBackgroundRect = (color: COLOR_CODE) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fill();
  };

  // 背景色を用いて五角形を描く
  const _renderBackgroundPentagon = (color: COLOR_CODE) => {
    // 事前に描画先の縦横比を割り出す。短辺を 1 で固定。
    const xRatio = ctx.canvas.width > ctx.canvas.height ? ctx.canvas.width / ctx.canvas.height : 1;
    const yRatio = ctx.canvas.width < ctx.canvas.height ? ctx.canvas.height / ctx.canvas.width : 1;

    // 短辺の長さを / 2 した半径を定義しておく
    const radius = (ctx.canvas.width > ctx.canvas.height ? ctx.canvas.height : ctx.canvas.width) / 2;

    // 背景色設定
    ctx.fillStyle = color;

    // 描画開始
    ctx.beginPath();

    // 正方形に内接する正円を上に存在する座標を 5 点算出
    for (let i = 0; i < 5; i = (i + 1) | 0) {
      i === 0
        ? ctx.moveTo((radius + (radius * Math.cos(i * 2 * Math.PI / 5 - (Math.PI / 2)))) * xRatio, (radius + (radius * Math.sin(i * 2 * Math.PI / 5 - (Math.PI / 2)))) * yRatio)
        : ctx.lineTo((radius + (radius * Math.cos(i * 2 * Math.PI / 5 - (Math.PI / 2)))) * xRatio, (radius + (radius * Math.sin(i * 2 * Math.PI / 5 - (Math.PI / 2)))) * yRatio);
    }

    // 描画
    ctx.closePath();
    ctx.fill();
  }

  // 背景色を用いて五角形を描く
  const _renderBackgroundStar = (color: COLOR_CODE) => {
    // 事前に描画先の縦横比を割り出す。短辺を 1 で固定。
    const xRatio = ctx.canvas.width > ctx.canvas.height ? ctx.canvas.width / ctx.canvas.height : 1;
    const yRatio = ctx.canvas.width < ctx.canvas.height ? ctx.canvas.height / ctx.canvas.width : 1;

    // 短辺の長さを / 2 した半径を定義しておく
    const radius = (ctx.canvas.width > ctx.canvas.height ? ctx.canvas.height : ctx.canvas.width) / 2;

    // さらにそれを半分にした小さい円の半径を定義
    const shortRadius = radius / 2;

    // 背景色設定
    ctx.fillStyle = color;

    // 描画開始
    ctx.beginPath();

    // 正方形に内接する正円を上に存在する座標を 5 点算出
    for (let i = 0; i < 5; i = (i + 1) | 0) {
      // 大きい円上の座標を描画
      i === 0
        ? ctx.moveTo(
          (radius + (radius * Math.cos(i * 2 * Math.PI / 5 - (Math.PI / 2)))) * xRatio,
          (radius + (radius * Math.sin(i * 2 * Math.PI / 5 - (Math.PI / 2)))) * yRatio
        )
        : ctx.lineTo(
          (radius + (radius * Math.cos(i * 2 * Math.PI / 5 - (Math.PI / 2)))) * xRatio,
          (radius + (radius * Math.sin(i * 2 * Math.PI / 5 - (Math.PI / 2)))) * yRatio
        );

      // 小さい円上の座標を描画
      ctx.lineTo(
        (radius + (shortRadius * Math.cos((i * 2 * Math.PI / 5 + (Math.PI / 5) - (Math.PI / 2))))) * xRatio,
        (radius + (shortRadius * Math.sin(i * 2 * Math.PI / 5 + (Math.PI / 5) - (Math.PI / 2)))) * yRatio
      );

    }

    // 描画
    ctx.closePath();
    ctx.fill();
  }

  // 実際に描画する
  const render = (inputs: Inputs, index: number = 0) => {
    // 初期描画内容にする
    _initCanvas();

    // index が想定外の範囲だったら inputs.length - 1 を法として計算する
    const _index = index > (inputs.length - 1) ? index % (inputs.length - 1) : index;

    // 事前に現在の index が全体の何 % か算出し、 360 を 100% とした場合の数値を割り出す
    const angle = Math.floor((_index) / (inputs.length === 0 ? 1 : inputs.length) * 360);

    // 背景色の決定
    const backgroundColor: COLOR_CODE = inputs.backgroundColorShiftHue
      ? _getColorChangedHue(inputs.backgroundColor, angle)
      : inputs.backgroundColor;

    // 図形を描画
    switch (inputs.shape) {
      case 'circle':
        _renderBackgroundCircle(backgroundColor);
        break;
      case 'rect':
        _renderBackgroundRect(backgroundColor);
        break;
      case 'pentagon':
        _renderBackgroundPentagon(backgroundColor);
        break;
      case 'star':
        _renderBackgroundStar(backgroundColor);
        break;
    }

    // 文字色・サイズの決定
    ctx.font = inputs.textSize+'px Arial';
    ctx.fillStyle = inputs.textColorShiftHue
      ? _getColorChangedHue(inputs.textColor, angle)
      : inputs.textColor;

    // 文字列を改行ごとに配列化
    const textLines = inputs.text
      .replace(/\r\n/g, "\n")
      .split("\n");

    // 何番目の描画かで該当テキストを判別
    const textIndex = _index % (textLines.length === 0 ? 1 : textLines.length);
    console.log(textIndex);
    const text = textLines.length > textIndex ? textLines[textIndex] : '';

    // 文字の長さを測り、 X 座標を決めてテキストを描画
    ctx.fillText(text, (ctx.canvas.width - ctx.measureText(text).width) / 2, (ctx.canvas.height / 2) + (inputs.textSize / 3));
  };

  // 提供する
  return {
    render
  };

};