export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-small text-muted-foreground">
        © {new Date().getFullYear()} Rabbit Hole
      </div>
    </footer>
  );
}
