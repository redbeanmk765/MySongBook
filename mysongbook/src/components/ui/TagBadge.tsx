interface TagBadgeProps {
  text: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function TagBadge({ text, backgroundColor, textColor }: TagBadgeProps) {
  return (
    <span
      className="inline-block px-[8px] py-[1.5px] rounded-sm text-sm font-medium truncate"
      style={{ backgroundColor, color: textColor }}
    >
      {text}
    </span>
  );
}