import Link from"next/link";import{Shell}from"../../src/components/layout";
export default function ForgotPassword(){return <Shell><div className="container simple-page"><div className="info-page"><h1>パスワードをお忘れの方</h1><p>このサイトはポートフォリオ用のデモサイトのため、パスワード再設定メールは送信されません。</p><p>ログイン画面では任意のメールアドレスとパスワードを入力してデモ機能をお試しいただけます。</p><Link className="primary" href="/login">ログインへ戻る</Link></div></div></Shell>}
