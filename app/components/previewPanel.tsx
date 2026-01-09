"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  showPreview: boolean;
  isLoading: boolean;
  ogImageUrl: string | null;
};

/* Loader overlay: dark bg + masked video so the MP4 white box doesn't show */
function LoaderOverlay() {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 0 }} // fade IN (fixes flash)
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }} // fade OUT
      className="absolute inset-0 z-10 grid place-items-center bg-slate-950"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Mask container hides MP4 white background edges */}
        <div className="h-45 w-45 rounded-full overflow-hidden bg-slate-950 shadow-lg ring-1 ring-slate-800">
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src="/loadingIcon.mp4" type="video/mp4" />
          </video>
        </div>

        <span className="text-xs text-slate-200 tracking-wide">
        </span>
      </div>
    </motion.div>
  );
}

export default function PreviewPanel({ showPreview, isLoading, ogImageUrl }: Props) {
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [pendingReveal, setPendingReveal] = useState(false);
  const requestIdRef = useRef(0);

  // When API starts (Fetch or Update): fade loader in (don't clear image -> avoids flash)
  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      setPendingReveal(false);
    }
  }, [isLoading]);

  // Preload new ogImageUrl, then swap it in and hide loader AFTER fade-in completes
  useEffect(() => {
    if (!ogImageUrl) return;

    const myRequestId = ++requestIdRef.current;

    setShowLoader(true);
    setPendingReveal(false);

    const img = new Image();
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
              {(forceLoader || showLoader) ? "Generating…" : "Updated preview"}
            </p>
          </div>

          <div className="relative h-[75vh] rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="h-full w-full flex items-center justify-center p-4">
              <AnimatePresence mode="wait">
                {displayUrl ? (
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
                      // Hide loader ONLY after new image fade-in completes
                      if (pendingReveal && !forceLoader) {
                        setShowLoader(false);
                        setPendingReveal(false);
                      }
                    }}
                  />
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-slate-500"
                  >
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {(forceLoader || showLoader) && <LoaderOverlay />}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
