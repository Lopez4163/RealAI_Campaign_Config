export type PdfState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success"; email: string }
  | { status: "error"; message: string };
