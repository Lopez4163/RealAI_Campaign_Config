"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";

// ✅ adjust this import path to your actual assets location
import GestureLoading from "@/public/assets/Gesture-loading.png";

type Props = {
  showPreview: boolean;
  isLoading: boolean;
  ogImageUrl: string | null;
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
export default function PreviewPanel({ showPreview, isLoading, ogImageUrl }: Props) {
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [pendingReveal, setPendingReveal] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      setPendingReveal(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!ogImageUrl) return;

    const myRequestId = ++requestIdRef.current;

    setShowLoader(true);
    setPendingReveal(false);

    const img = new window.Image();

    img.onload = () => {
      if (requestIdRef.current !== myRequestId) return;
      setDisplayUrl(ogImageUrl);
      setPendingReveal(true);
    };

    img.onerror = () => {
      if (requestIdRef.current !== myRequestId) return;
      setPendingReveal(false);
      if (!isLoading) setShowLoader(false);
    };

    img.src = ogImageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [ogImageUrl, isLoading]);

  const forceLoader = isLoading;

  return (
    <motion.div className="w-full">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <div className="mb-4">
          <h2 className="text-sm font-medium text-slate-100">Preview</h2>
          <p className="text-xs text-slate-400">
            {showPreview
              ? forceLoader || showLoader
                ? "Generating…"
                : "Updated preview"
              : "Submit to generate a preview"}
          </p>
        </div>

        <div className="relative h-[75vh] rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
          <div className="h-full w-full flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
              {!showPreview ? (
                <motion.div
                  key="pre-preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-slate-500"
                >
                  Your preview will appear here.
                </motion.div>
              ) : displayUrl ? (
                <motion.img
                  key={displayUrl}
                  src={displayUrl}
                  alt="Campaign infographic"
                  initial={{ opacity: 0, scale: 0.995 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="max-h-full max-w-full object-contain rounded-md shadow"
                  onAnimationComplete={() => {
                    if (pendingReveal && !forceLoader) {
                      setShowLoader(false);
                      setPendingReveal(false);
                    }
                  }}
                />
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-slate-500"
                >
                  Preparing…
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showPreview && (forceLoader || showLoader) && <LoaderOverlay />}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
