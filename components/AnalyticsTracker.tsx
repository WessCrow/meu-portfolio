"use client";

import { useEffect } from "react";

export default function AnalyticsTracker() {
  useEffect(() => {
    // 1. Visitor Tracking Logic
    const visitorId = localStorage.getItem("visitorId");
    const sessionTracked = sessionStorage.getItem("sessionTracked");
    
    let isNew = false;
    if (!visitorId) {
      const newId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("visitorId", newId);
      isNew = true;
    }

    // Only track one visit per session to avoid inflating numbers on refresh
    if (!sessionTracked) {
      fetch("/meu-portfolio/api/analytics/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "visit",
          isNew: isNew,
        }),
      }).catch(err => console.error("Analytics error:", err));
      
      sessionStorage.setItem("sessionTracked", "true");
    }

    // 2. Click Tracking Logic
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Identify element by id, data-track, or tagName + className
      const elementId = target.id;
      const dataTrack = target.getAttribute("data-track");
      const elementDesc = dataTrack || elementId || `${target.tagName.toLowerCase()}${target.className ? "." + target.className.split(" ").join(".") : ""}`;

      // Lightweight filter: only track meaningful elements (buttons, links, or marked elements)
      const isInteractive = 
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") || 
        dataTrack;

      if (isInteractive && elementDesc) {
        // Find the "cleanest" name for the clicked area
        let name = elementDesc;
        const closestLink = target.closest("a");
        const closestButton = target.closest("button");
        
        if (closestLink) {
          name = closestLink.getAttribute("data-track") || closestLink.id || closestLink.innerText.trim() || name;
        } else if (closestButton) {
          name = closestButton.getAttribute("data-track") || closestButton.id || closestButton.innerText.trim() || name;
        }

        // Limit name length
        name = name.substring(0, 50);

        fetch("/meu-portfolio/api/analytics/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "click",
            element: name,
          }),
        }).catch(err => console.error("Analytics error:", err));
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return null; // This component doesn't render anything
}
