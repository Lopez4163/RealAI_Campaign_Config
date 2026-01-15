"use client";

type Props = {
  canComplete: boolean;
  isSending: boolean;
  onClick: () => void | Promise<void>;
  className?: string;
};

export default function CompletePdfButton({
  canComplete,
  isSending,
  onClick,
  className = "",
}: Props) {
  const disabled = !canComplete || isSending;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "w-full rounded-md border px-4 py-3 text-sm font-medium",
        disabled
          ? "bg-slate-300 text-slate-600 cursor-not-allowed"
          : "bg-slate-100 text-black",
        className,
      ].join(" ")}
    >
      {isSending
        ? "Sending…"
        : canComplete
        ? "Complete PDF"
        : "Update Preview to Complete"}
    </button>
  );
}
