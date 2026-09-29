export function Button({ children, variant="primary", size="md", className="", style, ...props }) {
  const base = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
  const sizes = {
    sm: "h-9 px-4 text-[13px] rounded-full",
    md: "h-11 px-6 text-[14px] rounded-full",
    lg: "h-[52px] px-8 text-[15px] rounded-full",
    icon: "h-11 w-11 rounded-full"
  }
  const variants = {
    primary: "bg-[var(--c-primary, #0f172a)] text-white hover:brightness-110 shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.16)] hover:-translate-y-[1px]",
    secondary: "bg-white text-[var(--c-primary,#0f172a)] border border-black/10 hover:bg-zinc-50",
    accent: "bg-[var(--c-accent,#f59e0b)] text-black hover:brightness-105 shadow-[0_4px_14px_rgba(245,158,11,0.3)]",
    ghost: "bg-transparent hover:bg-black/5 text-[var(--c-primary)]",
    outline: "border border-[var(--c-primary)] text-[var(--c-primary)] hover:bg-[var(--c-primary)] hover:text-white bg-transparent"
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} style={style} {...props}>
      {children}
    </button>
  )
}

export function Badge({ children, variant="default", className="" }) {
  const v = {
    default: "bg-zinc-100 text-zinc-700 border-zinc-200",
    verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    accent: "bg-[var(--c-accent)]/15 text-[var(--c-primary)] border-[var(--c-accent)]/30",
    urgent: "bg-red-50 text-red-700 border-red-200 animate-pulse",
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${v[variant]} ${className}`}>
      {children}
    </span>
  )
}
