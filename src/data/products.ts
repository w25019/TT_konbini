export type Product={id:string;name:string;category:string;price:number;oldPrice?:number;rating:number;reviews:number;image:string;images?:string[];description:string;stock:number;isNew?:boolean;isPopular?:boolean;discount?:number;brand:string};
export const categories=["おにぎり・弁当","カップ麺","パン・サンド","飲み物","お菓子","アイス","コーヒー・お茶","日用品","家庭用品","ヘルス＆ビューティー"];
const base=[
["ツナマヨおにぎり","おにぎり・弁当",160,"🍙","TTデリ"],["紅しゃけおにぎり","おにぎり・弁当",170,"🍙","TTデリ"],["幕の内弁当","おにぎり・弁当",520,"🍱","TTデリ"],
["カップヌードル","カップ麺",220,"🍜","日清"],["シーフードヌードル","カップ麺",220,"🍜","日清"],["醤油ラーメン","カップ麺",198,"🍜","トップバリュ"],
["たまごサンド","パン・サンド",210,"🥪","TTベーカリー"],["メロンパン","パン・サンド",140,"🥐","TTベーカリー"],
["コカ・コーラ 500ml","飲み物",180,"🥤","コカ・コーラ"],["お〜いお茶 緑茶 525ml","飲み物",150,"🍵","伊藤園"],["天然水 550ml","飲み物",100,"💧","TTセレクト"],["明治 おいしい牛乳 900ml","飲み物",240,"🥛","明治"],
["ポテトチップス うすしお味","お菓子",160,"🥔","カルビー"],["ポッキー チョコレート","お菓子",130,"🍫","グリコ"],["ミックスグミ","お菓子",120,"🍬","TTセレクト"],
["バニラカップ","アイス",150,"🍨","TTセレクト"],["チョコモナカ","アイス",180,"🍦","森永"],
["ジョージア 微糖 500ml","コーヒー・お茶",120,"☕","ジョージア"],["香るブラック","コーヒー・お茶",140,"☕","TTセレクト"],
["キッチンペーパー 2ロール","家庭用品",180,"🧻","TTセレクト"],["ティッシュ 300枚","日用品",198,"🧻","エリエール"],["食器用洗剤","日用品",230,"🧴","TTセレクト"],["ハンドソープ","ヘルス＆ビューティー",298,"🧴","TTセレクト"],["マスク 7枚入","ヘルス＆ビューティー",320,"😷","TTセレクト"]
] as const;
export const products:Product[]=base.map((p,i)=>({id:String(i+1),name:p[0],category:p[1],price:p[2],image:p[3],brand:p[4],rating:Number((4.4+(i%5)*.1).toFixed(1)),reviews:76+i*9,description:"毎日の暮らしにうれしい、品質にこだわった人気の商品です。",stock:8+i,isPopular:i<10,isNew:i%6===0,discount:i===17?25:undefined,oldPrice:i===17?160:undefined,images:[p[3],p[3],p[3],p[3]]}));
export const byId=(id:string)=>products.find(p=>p.id===id)||products[0];
