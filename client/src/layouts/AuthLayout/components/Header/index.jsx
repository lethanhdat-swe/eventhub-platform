import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="border-border bg-card/80 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          className="font-heading text-lg font-semibold tracking-tight text-foreground hover:opacity-90"
          to="/"
        >
          EventHub
        </Link>
        <nav aria-label="Tài khoản" className="text-sm">
          <Link className="text-muted-foreground hover:text-foreground" to="/login">
            Đăng nhập
          </Link>
          <span className="text-muted-foreground mx-2" aria-hidden>
            /
          </span>
          <Link className="text-muted-foreground hover:text-foreground" to="/register">
            Đăng ký
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
