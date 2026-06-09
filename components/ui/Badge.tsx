interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "danger" | "neutral";
}

const styles = {
  success: "rounded-full bg-brand-success/10 px-3 py-1 text-xs font-semibold text-brand-success",
  danger: "rounded-full bg-brand-danger/10 px-3 py-1 text-xs font-semibold text-brand-danger",
  neutral: "rounded-full bg-brand-indigo/10 px-3 py-1 text-xs font-semibold text-brand-indigo",
};

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return <span className={styles[variant]}>{children}</span>;
}
