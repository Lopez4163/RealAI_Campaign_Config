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
        "w-full rounded-md border px-2 py-2 text-sm font-medium hover:bg-slate-200 hover:text-slate-800 cursor-pointer",
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