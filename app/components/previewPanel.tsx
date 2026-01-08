"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PreviewContext } from "../lib/types/campaign";

type Props = {
  showPreview: boolean;
  isLoading: boolean;
  ogImageUrl: string | null;
};

export default function PreviewPanel({
  showPreview,
  isLoading,
  ogImageUrl,
}: Props)



{
  return (
    <AnimatePresence>
      {showPreview && (
        <motion.div
          key="preview"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8"
        >
          <div className="mb-4">
            <h2 className="text-sm font-medium text-slate-100">Preview</h2>
            <p className="text-xs text-slate-400">
              {isLoading ? "Generating…" : "Updated preview"}
            </p>
          </div>

          {/* PREVIEW VIEWER */}
          <div className="h-[75vh] rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="h-full w-full flex items-center justify-center p-4">
              <AnimatePresence mode="wait">
                {!ogImageUrl ? (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-slate-500"
                  >
                    Generating preview…
                  </motion.div>
                ) : (
                  <motion.img
                    key={ogImageUrl}
                    src={ogImageUrl}
                    alt="Campaign infographic"
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="max-h-full max-w-full object-contain rounded-md shadow"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
