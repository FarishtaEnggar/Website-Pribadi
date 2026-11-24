export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <p className="eyebrow flex items-center gap-3 text-ink-soft">
      <span className="text-cobalt">{index}</span>
      <span aria-hidden="true" className="h-px w-8 bg-line" />
      {children}
    </p>
  );
}
