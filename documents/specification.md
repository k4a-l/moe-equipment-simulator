# Master of Epic(MoE) 装備シミュレーター

## 機能

## データ

### データ構造

[types/item.ts](../src/types/Item.ts)を参照

### データ作成

#### 初回

[公式データベース](https://idb.moepic.com/)からデータを取得し、`data/`ディレクトリに保存

#### 取得先データ構造

-   [盾]（https://idb.moepic.com/items/shields）
-   [武器]（https://idb.moepic.com/items/weapons）
-   [防具](https://idb.moepic.com/items/defences)

#### 次回以降

`data/`ディレクトリに保存されているデータを使用し、更新があれば更新する

## 画面
