import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const REPORT_PATH = path.join(process.cwd(), "docs", "Relatório de Visitantes do Site.md");

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const today = new Date().toISOString().split("T")[0];

    // Ensure docs directory exists
    const docsDir = path.dirname(REPORT_PATH);
    await fs.mkdir(docsDir, { recursive: true });

    let content = "";
    try {
      content = await fs.readFile(REPORT_PATH, "utf-8");
    } catch (e) {
      // Create file with header if it doesn't exist
      content = "| Data       | Total de Visitantes | Novos Visitantes | Re-visitantes | Lugares Mais Clicados no Site |\n|------------|--------------------|------------------|----------------|-------------------------------|\n";
    }

    const lines = content.split("\n");
    const headerLines = lines.slice(0, 2);
    const dataLines = lines.slice(2).filter(line => line.trim() !== "");

    let todayRowIndex = dataLines.findIndex(line => line.startsWith(`| ${today}`));
    
    let stats = {
      date: today,
      total: 0,
      new: 0,
      returning: 0,
      clicks: {} as Record<string, number>,
    };

    if (todayRowIndex !== -1) {
      // Parse existing row
      const cols = dataLines[todayRowIndex].split("|").map(c => c.trim()).filter(c => c !== "");
      stats.total = parseInt(cols[1]) || 0;
      stats.new = parseInt(cols[2]) || 0;
      stats.returning = parseInt(cols[3]) || 0;
      
      // Parse clicks (extract from comma separated list)
      const clickedStr = cols[4] || "";
      // Since we don't store counts in the MD, we'll try to maintain them via a temporary JSON or just append
      // For this implementation, I'll use a JSON sidecar for accurate counts if requested, 
      // but the user wanted a "Lightweight" solution. 
      // Let's use a hidden JSON block at the end of the MD file or just a separate file.
      // A separate JSON is safer for persistence.
    }

    // Persist counts in a hidden JSON file for accuracy
    const DATA_JSON_PATH = path.join(process.cwd(), "docs", "analytics_cache.json");
    let cache: Record<string, any> = {};
    try {
      const cacheRaw = await fs.readFile(DATA_JSON_PATH, "utf-8");
      cache = JSON.parse(cacheRaw);
    } catch (e) {}

    if (!cache[today]) {
      cache[today] = { total: 0, new: 0, returning: 0, clicks: {} };
    }

    if (data.type === "visit") {
      cache[today].total += 1;
      if (data.isNew) cache[today].new += 1;
      else cache[today].returning += 1;
    } else if (data.type === "click") {
      const el = data.element || "Unknown";
      cache[today].clicks[el] = (cache[today].clicks[el] || 0) + 1;
    }

    // Update the record
    const dayData = cache[today];
    
    // Sort clicks and get top 5
    const topClicks = Object.entries(dayData.clicks as Record<string, number>)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name]) => name)
      .join(", ");

    const newRow = `| ${today} | ${dayData.total} | ${dayData.new} | ${dayData.returning} | ${topClicks || "-"} |`;

    if (todayRowIndex !== -1) {
      dataLines[todayRowIndex] = newRow;
    } else {
      dataLines.push(newRow);
    }

    // Write back to files
    const finalContent = headerLines.join("\n") + "\n" + dataLines.join("\n") + "\n";
    await fs.writeFile(REPORT_PATH, finalContent, "utf-8");
    await fs.writeFile(DATA_JSON_PATH, JSON.stringify(cache, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Analytics Error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
