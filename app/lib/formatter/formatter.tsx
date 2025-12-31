export  function normalizeOutputToLines(data: { text: string } | any): string[] {
    const raw = typeof data === "string" ? data : data?.text;
  
    if (typeof raw !== "string") return [];
  
    // pull the JSON object out of the fenced string
    const jsonStr = raw.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonStr) return [raw];
  
    try {
      const obj = JSON.parse(jsonStr) as Record<string, unknown>;
      return Object.values(obj).map((v) => String(v));
    } catch {
      return [raw];
    }
  }
  