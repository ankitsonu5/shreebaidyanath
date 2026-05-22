"use client";

import { startTransition } from "react";

const MOBILE_NAV_MEDIA_QUERY = "(max-width: 768px)";

function shouldUseWindowNavigation() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia(MOBILE_NAV_MEDIA_QUERY).matches;
}

export function navigateTo(router, path, options = {}) {
  if (!path || typeof window === "undefined") {
    return;
  }

  const { replace = false, forceWindowNavigation } = options;
  const fallbackToWindow =
    forceWindowNavigation ?? shouldUseWindowNavigation();

  if (fallbackToWindow || !router) {
    if (replace) {
      window.location.replace(path);
    } else {
      window.location.assign(path);
    }
    return;
  }

  const navigate = () => {
    if (replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };

  try {
    startTransition(navigate);
  } catch (error) {
    console.error("Navigation fallback triggered:", error);
    window.location.assign(path);
  }
}
