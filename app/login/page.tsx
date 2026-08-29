"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Logo, Shell } from "../../src/components/layout";
import { useRouter } from "next/navigation";
import { useStore } from "../../src/context/StoreContext";
export default function Login() {
  // LOGIN FORM STATE
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const r = useRouter();
  const s = useStore();
  // Already logged-in users do not need to see the login page again.
  useEffect(() => {
    if (s.hydrated && s.isAuthenticated) r.replace("/mypage");
  }, [s.hydrated, s.isAuthenticated, r]);
  // FORM VALIDATION AND DEMO LOGIN
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }
    s.login(email.trim());
    r.push("/mypage");
  }
  return (
    <Shell>
      <div className="login-card">
        <Logo />
        <h1>ログイン</h1>
        <p>TTオンラインコンビニへようこそ</p>
        <div className="demo-notice">
          ※ ポートフォリオ用のデモ認証です。実際の認証・決済は行いません。
        </div>
        <form onSubmit={submit}>
          <label>
            メールアドレス
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
              autoComplete="email"
            />
          </label>
          <label>
            パスワード
            <div className="password">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="パスワードを入力"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "パスワードを隠す" : "パスワードを表示"}
              >
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="login-links">
            <Link href="/forgot-password">パスワードをお忘れですか？</Link>
          </div>
          <button className="primary wide" type="submit">
            ログイン
          </button>
        </form>
        <p>アカウントをお持ちでない方</p>
        <Link className="outline wide" href="/register">
          デモ会員登録
        </Link>
      </div>
    </Shell>
  );
}
