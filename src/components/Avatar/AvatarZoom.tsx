import React, { useCallback, useContext } from 'react';
import * as PIXI from 'pixi.js';

// Context
import { FrameCountContext } from '@/context';

// Components
import { Graphics } from '@inlet/react-pixi';

const useFocusLine = (
    cs: { width: number; height: number },
    centralX: number,
    centralY: number,
    lineWidth: number,
    lineNum: number,
    circleRadiusMax: number,
    circleRadiusMin: number,
    lineColor: number
) => {
    const lines: Liner[] = [];

    /**
     * ランダムな整数を返す
     * @param max 最大値
     * @param min 最小値
     * @return min ~ max
     */
    const getRandomInt = function (max: number, min: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    /**
     * 円周上の座標を返す
     * @param d 角度
     * @param r 半径
     * @param cx, cy 中心座標
     */
    const getCircumPos = {
        // x座標
        x: function (d: number, r: number, cx: number) {
            return Math.cos((Math.PI / 180) * d) * r + cx;
        },
        // y座標
        y: function (d: number, r: number, cy: number) {
            return Math.sin((Math.PI / 180) * d) * r + cy;
        },
    };

    class Liner {
        deg = 0;
        moveDeg = 0;
        endRadius = 0;
        startPos: { x: number; y: number } = { x: 0, y: 0 };
        movePos: { x: number; y: number } = { x: 0, y: 0 };
        endPos: { x: number; y: number } = { x: 0, y: 0 };

        constructor() {
            this.initialize();
        }

        /* initialize()内の設定をsetPos()内へ移すと、アニメーションの動きが変わる */
        initialize() {
            this.deg = getRandomInt(360, 0);
        }

        setPos() {
            this.moveDeg = this.deg + getRandomInt(lineWidth, 1) / 10;
            this.endRadius = getRandomInt(circleRadiusMax, circleRadiusMin);

            // 開始座標
            this.startPos = {
                x: getCircumPos.x(this.deg, csRadius, centralX),
                y: getCircumPos.y(this.deg, csRadius, centralY),
            };

            // 移動座標
            this.movePos = {
                x: getCircumPos.x(this.moveDeg, csRadius, centralX),
                y: getCircumPos.y(this.moveDeg, csRadius, centralY),
            };

            // 終了座標
            this.endPos = {
                x: getCircumPos.x(this.moveDeg, this.endRadius, centralX),
                y: getCircumPos.y(this.moveDeg, this.endRadius, centralY),
            };
        }

        update() {
            this.setPos();
        }

        draw(g: PIXI.Graphics) {
            g.beginFill(lineColor, 0.5);
            g.moveTo(this.startPos.x, this.startPos.y);
            g.lineTo(this.movePos.x, this.movePos.y);
            g.lineTo(this.endPos.x, this.endPos.y);
            g.closePath();
        }

        render(g: PIXI.Graphics) {
            this.update();
            this.draw(g);
        }
    }

    // canvasの中心から角までの斜辺距離を円の半径とする
    // 中心をズラす場合は、もっと大きな値を設定してやる（引数でできるようにすべきか）
    const csRadius =
        Math.sqrt(Math.pow(cs.width / 2, 2) + Math.pow(cs.height / 2, 2)) | 0;

    /**
     * 線インスタンスの作成
     * @return lines[instance, instance...];
     */
    const createLines = (num: number) => {
        let i = 0;
        for (; i < num; i++) {
            lines[lines.length] = new Liner();
        }
    };

    /**
     * 描画
     */
    const render = (g: PIXI.Graphics) => {
        let i = 0;
        const l = lines.length;
        g.clear();
        for (; i < l; i++) {
            lines[i].render(g);
        }
    };

    createLines(lineNum);

    return {
        render,
    };
};

export const AvatarZoom: React.FC = () => {
    const frameCount = useContext(FrameCountContext);
    const focusLine = useFocusLine(
        { width: 800, height: 800 },
        0,
        0,
        30,
        300,
        100,
        70,
        0xcccccc
    );

    const draw = useCallback(
        (g: PIXI.Graphics) => {
            focusLine.render(g);
        },
        [frameCount]
    );

    return <Graphics draw={draw} pivot={[0, 170]} />;
};
