"use client";
import { AccountGuard, AccountPage } from "../../../src/components/account";
import { Shell } from "../../../src/components/layout";
export default function Payment() {
  return (
    <Shell>
      <AccountGuard>
        <AccountPage title="支払い方法">
          <div className="info-page">
            <h2>利用できるデモ支払い方法</h2>
            <p>
              クレジットカード、PayPay、代金引換、コンビニ払いをチェックアウト時に選択できます。
            </p>
            <p>
              ※ デモサイトのためカード番号は保存せず、実際の決済も行いません。
            </p>
          </div>
        </AccountPage>
      </AccountGuard>
    </Shell>
  );
}
