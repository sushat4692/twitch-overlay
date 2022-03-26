/**
 * 集中線メーカー
 * @param {obj} canvas object
 * @param {number} centralX: 集中線を配置するx座標
 * @param {number} centralY: 集中線を配置するy座標
 * @param {number} lineWidth: 線の太さ（ランダムの上限）
 * @param {number} lineNum: 線の数
 * @param {number} circleRadiusMax: 集中線の円形の半径上限
 * @param {number} circleRadiusMin: 集中線の円形の半径下限
 * @param {string} lineColor: 集中線の色
 */
export const focusLine = function (
    cs: HTMLCanvasElement,
    centralX: number,
    centralY: number,
    lineWidth: number,
    lineNum: number,
    circleRadiusMax: number,
    circleRadiusMin: number,
    lineColor: string
) {
    const ctx = cs.getContext('2d');
    if (!ctx) {
        return;
    }

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

    /**
     * @constructor
     */
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

        draw() {
            if (!ctx) {
                return;
            }

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.fillStyle = lineColor;
            ctx.moveTo(this.startPos.x, this.startPos.y);
            ctx.lineTo(this.movePos.x, this.movePos.y);
            ctx.lineTo(this.endPos.x, this.endPos.y);
            ctx.fill();
            ctx.closePath();
        }

        render() {
            this.update();
            this.draw();
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
    const render = () => {
        if (!ctx) {
            return;
        }

        let i = 0;
        const l = lines.length;
        ctx.clearRect(0, 0, cs.width, cs.height);
        for (; i < l; i++) {
            lines[i].render();
        }
    };
    const stop = () => {
        if (!ctx) {
            return;
        }
        ctx.clearRect(0, 0, cs.width, cs.height);
    };

    createLines(lineNum);

    return {
        render,
        stop,
    };
};
