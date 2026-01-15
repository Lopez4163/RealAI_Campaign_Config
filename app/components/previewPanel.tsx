"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PdfState } from "../lib/types/pdf";
import NextImage from "next/image";
import GestureLoading from "@/public/assets/Gesture-loading.png";
import CompletePdfButton from "./CompletePdfButton";

type Props = {
  showPreview: boolean;
  isLoading: boolean;
  ogImageUrl: string | null;
  onPreviewReady: (ready: boolean) => void;

  // ✅ needed for mobile Complete button
  canCompletePdf: boolean;
  pdfState: PdfState;
  onCompletePdf: () => void | Promise<void>;
};


/* =========================
   Loader Overlay (Pulsating PNG)
   ========================= */
function LoaderOverlay() {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
      className="absolute inset-0 z-10 grid place-items-center bg-slate-950"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{
            scale: [0.96, 1.04, 0.96],
            opacity: [0.75, 1, 0.75],
          }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="drop-shadow"
        >
          <NextImage
            src={GestureLoading}
            alt="Loading"
            priority
            className="h-40 w-40 sm:h-48 sm:w-48 object-contain"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* =========================
   Preview Panel
   ========================= */
export default function PreviewPanel({
  showPreview,
  isLoading,
  ogImageUrl,
  onPreviewReady,
  canCompletePdf,
  pdfState,
  onCompletePdf,
}: Props) {
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [pendingReveal, setPendingReveal] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (isLoading) {
      onPreviewReady(false);
      setShowLoader(true);
      setPendingReveal(false);
    }
  }, [isLoading, onPreviewReady]);

  useEffect(() => {
    if (!ogImageUrl) return;

    const myRequestId = ++requestIdRef.current;

    setShowLoader(true);
    setPendingReveal(false);
    onPreviewReady(false);

    const img = new window.Image();

    img.onload = () => {
      if (requestIdRef.current !== myRequestId) return;
      setDisplayUrl(ogImageUrl);
      setPendingReveal(true);
    };

    img.onerror = () => {
      if (requestIdRef.current !== myRequestId) return;
      setPendingReveal(false);
      onPreviewReady(false);
      if (!isLoading) setShowLoader(false);
    };

    img.src = ogImageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [ogImageUrl, isLoading, onPreviewReady]);

  const forceLoader = isLoading;

  return (
    <motion.div className="w-full">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-2 md:p-6 lg:p-8">
        {/* Hide header on mobile to remove top spacing */}
        <div className="hidden md:block mb-4">
          <h2 className="text-sm font-medium text-slate-100">Preview</h2>
          <p className="text-xs text-slate-400">
            {showPreview
              ? forceLoader || showLoader
                ? "Generating…"
                : "Updated preview"
              : "Submit to generate a preview"}
          </p>
        </div>

        {/* Preview Viewport */}
        <div className="relative h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
          <AnimatePresence mode="wait">
            {!showPreview ? (
              <motion.div
                key="pre-preview"
                className="absolute inset-0 grid place-items-center text-sm text-slate-500"
              >
                Your preview will appear here.
              </motion.div>
            ) : displayUrl ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.img
                  key={displayUrl}
                  src={displayUrl}
                  alt="Campaign infographic"
                  initial={{ opacity: 0, scale: 0.995 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full w-full max-w-[92%] object-contain"
                  onAnimationComplete={() => {
                    if (pendingReveal && !forceLoader) {
                      setShowLoader(false);
                      setPendingReveal(false);
                      onPreviewReady(true);
                    }
                  }}
                />
              </div>
            ) : (
              <motion.div
                key="waiting"
                className="absolute inset-0 grid place-items-center text-sm text-slate-500"
              >
                Preparing…
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showPreview && (forceLoader || showLoader) && <LoaderOverlay />}
          </AnimatePresence>
        </div>
        <div className="md:hidden sticky bottom-0 mt-3 border-t border-slate-800 bg-slate-900/90 backdrop-blur p-3">
          <CompletePdfButton
            canComplete={canCompletePdf}
            isSending={pdfState.status === "sending"}
            onClick={onCompletePdf}
          />
        </div>
      </div>
    </motion.div>
  );
}
