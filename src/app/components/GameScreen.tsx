'use client';
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  IChamferableBodyDefinition,
  Render,
  World,
} from 'matter-js';

/* eslint-disable */
// クラゲの型定義
type Jellyfish = {
  texture: string;
  size: number;
  scale: number;
  label: string;
  score: number;
};

// ゲーム画面の横幅
const SCREEN_WIDTH = 400;
// ゲーム画面の縦幅
const SCREEN_HEIGHT = 600;
// クラゲテクスチャ画像の元サイズ
const ORIGINAL_SIZE: number = 200;
// ゲーム内の重力
const GRAVITY = -0.4;
// 穴を通過したときの獲得スコア
const PASSED_SCORE: number = 100;
// 穴の幅
const HOLE_WIDTH: number = 35;
// 天井の傾き
const CEILING_TILT: number = 10;
// クラゲの定義
const jellyfishes: Jellyfish[] = [
  {
    texture: './1_red_circle.png',
    size: 25,
    scale: (25 * 2) / ORIGINAL_SIZE,
    label: '0',
    score: 8,
  },
  {
    texture: './2_orange_circle.png',
    size: 30,
    scale: (30 * 2) / ORIGINAL_SIZE,
    label: '1',
    score: 7,
  },
  {
    texture: './3_yellow_circle.png',
    size: 35,
    scale: (35 * 2) / ORIGINAL_SIZE,
    label: '2',
    score: 6,
  },
  {
    texture: './4_lightgreen_circle.png',
    size: 40,
    scale: (40 * 2) / ORIGINAL_SIZE,
    label: '3',
    score: 5,
  },
  {
    texture: './5_green_circle.png',
    size: 45,
    scale: (45 * 2) / ORIGINAL_SIZE,
    label: '4',
    score: 4,
  },
  {
    texture: './6_waterblue_circle.png',
    size: 49,
    scale: (49 * 2) / ORIGINAL_SIZE,
    label: '5',
    score: 3,
  },
  {
    texture: './7_blue_circle.png',
    size: 60,
    scale: (60 * 2) / ORIGINAL_SIZE,
    label: '6',
    score: 2,
  },
  {
    texture: './8_navy_circle.png',
    size: 70,
    scale: (70 * 2) / ORIGINAL_SIZE,
    label: '7',
    score: 2,
  },
];
// 投下されるクラゲのlabelリスト
const DROPPABLE_JELLYFISH_LABELS = ['2', '3', '4', '5', '6'];

export default function GameScreen() {
  if (typeof document !== 'undefined') {
    // 総スコア
    let totalScore: number = 0;
    // エンジンを作成
    const engine: Engine = Engine.create();
    engine.world.gravity.y = GRAVITY;
    // レンダーを作成
    const render: Render = Render.create({
      element: document.querySelector('[data-html-matter]')! as HTMLElement,
      engine: engine,
      options: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        wireframes: false,
        background: '#4682b4',
      },
    });
    // 投下しようとしているクラゲBody
    let nextJellyfishBody: Body;
    // クラゲを投下中かどうか
    let isFalling: boolean = false;

    /**
     * 次に投下するクラゲを取得する
     * @returns {Body} 次に投下するクラゲのBody
     */
    const fetchNextJellyfishBody = (): Body => {
      const randomId: number = parseInt(
        DROPPABLE_JELLYFISH_LABELS[Math.floor(Math.random() * DROPPABLE_JELLYFISH_LABELS.length)]
      );
      const nextJellyfish: Jellyfish = jellyfishes[0];

      // 投下する初期位置（X座標は中央/Y座標は画面下から50px上）
      const dropPos: { x: number; y: number } = {
        x: SCREEN_WIDTH / 2,
        y: SCREEN_HEIGHT - 50,
      };
      const NextJellyfishBody: Body = Bodies.circle(dropPos.x, dropPos.y, nextJellyfish.size, {
        label: nextJellyfish.label,
        isStatic: true,
        render: {
          sprite: {
            texture: nextJellyfish.texture,
            xScale: nextJellyfish.scale,
            yScale: nextJellyfish.scale,
          },
        },
      });
      return NextJellyfishBody;
    };

    /**
     * 1段階小さいサイズのクラゲを取得する。現在のクラゲが最小サイズの場合はnullを返す。
     * @param {Body} bodyA 衝突しているクラゲA
     * @param {Body} bodyB 衝突しているクラゲB
     * @returns {Body} 合体後のクラゲのBody
     */
    const getNextJellyfishBody = (bodyA: Body, bodyB: Body): Body => {
      const nextJellyfish = jellyfishes[parseInt(bodyA.label) - 1];
      // 合体後の位置（X,Y軸ともに両オブジェクトの中央）
      const newPos: { x: number; y: number } = {
        x: (bodyA.position.x + bodyB.position.x) / 2,
        y: (bodyA.position.y + bodyB.position.y) / 2,
      };
      const NextJellyfishBody: Body = Bodies.circle(newPos.x, newPos.y, nextJellyfish.size, {
        label: nextJellyfish.label,
        render: {
          sprite: {
            texture: nextJellyfish.texture,
            xScale: nextJellyfish.scale,
            yScale: nextJellyfish.scale,
          },
        },
      });
      return NextJellyfishBody;
    };

    /**
     * 静止オブジェクトを配置する
     * @returns {void}
     */
    const setStaticObj = (): void => {
      const objs: Body[] = [];
      const options: IChamferableBodyDefinition = { isStatic: true };

      // 左右の天井
      const ceilingWidth: number = (SCREEN_WIDTH - HOLE_WIDTH) / 2;
      const ceilingTilt: number = Math.PI / CEILING_TILT;
      const ceilingPosY: number = Math.sin(ceilingTilt) * ceilingWidth;
      objs.push(
        Bodies.rectangle(ceilingWidth / 2 - 7, ceilingPosY, ceilingWidth, 20, {
          ...options,
          angle: -ceilingTilt,
        })
      );
      objs.push(
        Bodies.rectangle(1.5 * ceilingWidth + HOLE_WIDTH + 7, ceilingPosY, ceilingWidth, 20, {
          ...options,
          angle: ceilingTilt,
        })
      );
      // 左右の壁
      objs.push(Bodies.rectangle(0, SCREEN_HEIGHT / 2, 20, SCREEN_HEIGHT, options));
      objs.push(Bodies.rectangle(SCREEN_WIDTH, SCREEN_HEIGHT / 2, 20, SCREEN_HEIGHT, options));

      World.add(engine.world, objs);
    };

    /**
     * クラゲ同士を合体させる
     * @param {Body} bodyA 衝突しているクラゲA
     * @param {Body} bodyB 衝突しているクラゲB
     * @returns {void}
     */
    const mergeJellyFishes = (bodyA: Body, bodyB: Body): void => {
      const nextJellyfishBody: Body = getNextJellyfishBody(bodyA, bodyB);
      totalScore += jellyfishes[parseInt(nextJellyfishBody.label)].score;
      World.remove(engine.world, [bodyA, bodyB]);
      World.add(engine.world, nextJellyfishBody);
    };

    /**
     * クラゲ同士で衝突したときの処理
     */
    Events.on(engine, 'collisionStart', (e: { pairs: { bodyA: Body; bodyB: Body }[] }) => {
      e.pairs.forEach((pair) => {
        // 最小サイズでない同種のクラゲが衝突したときに合体させる
        if (pair.bodyA.label === pair.bodyB.label && pair.bodyA.label !== '0') {
          mergeJellyFishes(pair.bodyA, pair.bodyB);
        }
      });
    });

    /**
     * クラゲが穴を通過したときの処理
     */
    Events.on(engine, 'beforeUpdate', () => {
      const bodies: Body[] = Composite.allBodies(engine.world);
      bodies.forEach((body) => {
        if (body.position.y > SCREEN_HEIGHT) {
          totalScore += PASSED_SCORE;
          World.remove(engine.world, body);
        }
      });
    });

    /**
     * キーボード入力に応じた操作
     */
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // クラゲ投下中の場合はキーボード操作をブロックする
      if (isFalling) {
        return;
      }

      switch (e.code) {
        // スペースキー：クラゲを投下
        case 'Space':
          isFalling = true;
          Body.setStatic(nextJellyfishBody, false);
          window.setTimeout(() => {
            nextJellyfishBody = fetchNextJellyfishBody();
            isFalling = false;
            World.add(engine.world, nextJellyfishBody);
          }, 2000);
          break;
        // 左矢印キー：投下対象のクラゲを左に移動
        case 'ArrowLeft':
          Body.translate(nextJellyfishBody, { x: -5, y: 0 });
          break;
        // 右矢印キー：投下対象のクラゲを右に移動
        case 'ArrowRight':
          Body.translate(nextJellyfishBody, { x: 5, y: 0 });
          break;
        default:
          break;
      }
    });

    // 初期化
    setStaticObj();
    nextJellyfishBody = fetchNextJellyfishBody();
    World.add(engine.world, nextJellyfishBody);
    Render.run(render);
    Engine.run(engine);
  }

  return (
    <>
      <div data-html-matter> </div>
    </>
  );
}
/* eslint-disable */
