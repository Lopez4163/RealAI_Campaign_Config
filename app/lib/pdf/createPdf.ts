import type { PreviewContext } from "@/app/lib/types/campaign";
import type { FormOutput } from "@/app/lib/org/buildOgUrl";

export async function handleCreatePdf(
  previewContext: PreviewContext,
  formOutput: FormOutput
) {
  const res = await fetch("/api/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      previewContext,
      formOutput,
    }),
  });

  if (!res.ok) {
    console.error("PDF request failed");
    return;
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "realai-campaign.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}
