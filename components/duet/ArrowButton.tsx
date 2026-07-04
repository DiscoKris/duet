type ArrowButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "dark";
  className?: string;
};

const variantClassMap = {
  primary:
    "bg-[var(--accent-pink)] text-black hover:bg-white focus-visible:ring-[var(--accent-pink)]",
  ghost:
    "border border-white/20 bg-white/5 text-white hover:border-[var(--accent-pink)] hover:text-[var(--accent-pink)] focus-visible:ring-white",
  dark: "bg-black text-white hover:bg-white hover:text-black focus-visible:ring-black",
};

export function ArrowButton({
  children,
  onClick,
  href,
  disabled,
  variant = "primary",
  className = "",
}: ArrowButtonProps) {
  const classes = `group inline-flex items-center gap-4 rounded-full px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.22em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-40 ${variantClassMap[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="text-lg transition-transform duration-300 group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </>
  );

  if (href) {
    return (
      <a className={classes} href={href}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type="button" onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}
