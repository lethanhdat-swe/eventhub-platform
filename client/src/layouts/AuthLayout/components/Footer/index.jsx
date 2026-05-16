function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-border bg-muted/30 border-t py-4 text-center text-xs text-muted-foreground">
      <p>© {year} EventHub. Đặt vé sự kiện dễ dàng, minh bạch.</p>
    </footer>
  );
}

export default Footer;
