function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-(--border-color) bg-(--background-color)/80 py-5 text-center text-sm text-(--muted-text) backdrop-blur-xl">
      <p>
        © {year} Beetic. Đặt vé sự kiện dễ dàng, nhanh chóng và minh bạch.
      </p>
    </footer>
  );
}

export default Footer;
