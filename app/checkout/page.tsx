"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, CreditCard, PenLine, Lock } from "lucide-react";
import { ProductImage } from "../../src/components/product";
import { Shell, yen } from "../../src/components/layout";
import { Order, useStore } from "../../src/context/StoreContext";
const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

// JAPANESE DATE FORMAT
// Converts a Date object into a readable Japanese delivery date.
function formatDate(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${weekdays[date.getDay()]}）`;
}
export default function Checkout() {
  // CHECKOUT DATA AND FORM STATE
  const s = useStore();

  // DELIVERY DATES
  // Creates five choices starting from tomorrow.
  const dates = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        d.setDate(d.getDate() + i + 1);
        return formatDate(d);
      }),
    [],
  );
  const [pay, setPay] = useState("クレジットカード");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(dates[0]);
  const [time, setTime] = useState("14:00〜16:00");
  const [done, setDone] = useState<Order | null>(null);
  // ORDER TOTAL
  // Cash on delivery and convenience-store payment have extra fees.
  const fee = pay === "代金引換" ? 330 : pay === "コンビニ払い" ? 220 : 0;
  const shipping = s.subtotal >= 2000 ? 0 : 220;
  const total = s.subtotal + shipping + fee - s.discount;
  // CONFIRM ORDER
  // Checks the address and sends the order details to StoreContext.
  function submit() {
    if (!s.address) {
      s.notify("お届け先を登録してください");
      return;
    }
    const order = s.placeOrder({
      shipping,
      fee,
      payment: pay,
      deliveryDate: date,
      deliveryTime: time,
      note,
    });
    if (order) setDone(order);
  }
  if (done)
    return (
      <Shell>
        <div className="success">
          <div>✓</div>
          <h1>ご注文ありがとうございます</h1>
          <p>ご注文を受け付けました。以下はデモ注文情報です。</p>
          <b>注文番号：{done.id}</b>
          <p>
            最終合計：<strong>{yen(done.total)}</strong>
          </p>
          <p>
            お届け予定：{done.deliveryDate} {done.deliveryTime}
          </p>
          <p>お支払い方法：{done.payment}</p>
          <div className="success-actions">
            <Link className="primary" href="/orders">
              注文履歴を確認する
            </Link>
            <Link className="outline" href="/products">
              買い物を続ける
            </Link>
          </div>
        </div>
      </Shell>
    );
  if (!s.count)
    return (
      <Shell>
        <div className="container">
          <div className="empty">
            <h1>カートに商品がありません</h1>
            <p>商品をカートへ追加してから購入手続きへ進んでください。</p>
            <Link className="primary" href="/products">
              商品を選ぶ
            </Link>
          </div>
        </div>
      </Shell>
    );
  return (
    <Shell>
      <div className="container">
        <div className="steps">
          <div className="completed">
            <i>✓</i>
            <b>カート</b>
          </div>
          <div className="active">
            <i>2</i>
            <b>お届け先・支払い</b>
          </div>
          <div>
            <i>3</i>
            <b>注文確認</b>
          </div>
        </div>
        <div className="checkout">
          <section>
            <Card icon={<MapPin />} title="お届け先情報">
              {s.address ? (
                <>
                  <h3>
                    {s.address.name}　
                    <small className="badge">デフォルト</small>
                  </h3>
                  <p>
                    〒{s.address.postalCode}　{s.address.prefecture}
                    {s.address.city}
                    {s.address.street} {s.address.building}
                  </p>
                  <p>{s.address.phone}</p>
                  <Link className="change-link" href="/mypage/address">
                    変更する ›
                  </Link>
                </>
              ) : (
                <div className="address-empty">
                  <p>お届け先が登録されていません</p>
                  <Link className="primary" href="/mypage/address">
                    お届け先を登録する
                  </Link>
                </div>
              )}
            </Card>
            <Card icon={<Calendar />} title="配送日時">
              <div className="field-row">
                <label>
                  お届け希望日
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  >
                    {dates.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </label>
                <label>
                  お届け希望時間
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    <option>10:00〜12:00</option>
                    <option>14:00〜16:00</option>
                    <option>16:00〜18:00</option>
                    <option>18:00〜20:00</option>
                  </select>
                </label>
              </div>
            </Card>
            <Card icon={<CreditCard />} title="お支払い方法">
              <div className="payment">
                {[
                  ["クレジットカード", "VISA・Mastercard・JCB・AMEX"],
                  ["PayPay", "PayPay（デモ）"],
                  ["代金引換", "手数料 ¥330"],
                  ["コンビニ払い", "手数料 ¥220"],
                ].map((x) => (
                  <button
                    type="button"
                    onClick={() => setPay(x[0])}
                    className={pay === x[0] ? "selected" : ""}
                    key={x[0]}
                    aria-pressed={pay === x[0]}
                  >
                    <b>◉ {x[0]}</b>
                    <small>{x[1]}</small>
                  </button>
                ))}
              </div>
              <p className="mock-note">
                ※ デモサイトのため実際の決済は行われません。
              </p>
            </Card>
            <Card icon={<PenLine />} title="注文メモ（任意）">
              <textarea
                maxLength={200}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="配送に関するご要望がございましたらご入力ください"
              />
              <small className="counter">{note.length} / 200</small>
            </Card>
          </section>
          <aside className="order-box">
            <h2>ご注文内容</h2>
            {s.items.map((i) => (
              <div className="mini-item" key={i.product.id}>
                <ProductImage product={i.product} />
                <span>
                  <b>{i.product.name}</b>
                  <small>
                    {yen(i.product.price)} × {i.quantity}
                  </small>
                </span>
                <b>{yen(i.product.price * i.quantity)}</b>
              </div>
            ))}
            <hr />
            <p>
              <span>小計</span>
              <b>{yen(s.subtotal)}</b>
            </p>
            <p>
              <span>送料</span>
              <b>{shipping ? yen(shipping) : "無料"}</b>
            </p>
            <p>
              <span>クーポン割引</span>
              <b className="green">-{yen(s.discount)}</b>
            </p>
            <p>
              <span>手数料</span>
              <b>{fee ? yen(fee) : "¥0"}</b>
            </p>
            <div className="total">
              <span>合計（税込）</span>
              <b>{yen(total)}</b>
            </div>
            <button
              className="primary wide"
              onClick={submit}
              disabled={!s.address}
            >
              <Lock /> 注文を確定する
            </button>
            {!s.address && (
              <small className="form-error">
                注文確定にはお届け先の登録が必要です。
              </small>
            )}
            <small className="mock-note">
              ※ デモサイトのため実際の決済は行われません。
            </small>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  // REUSABLE CHECKOUT SECTION
  // This keeps address, delivery, payment, and memo cards consistent.
  return (
    <section className="checkout-card">
      <h2>
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}
