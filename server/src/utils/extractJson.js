function extractJson(text) {
  // Remove markdown code fences
  let cleaned = text.replace(/```json|```/g, "").trim();

  // Find the first { and the last }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No valid JSON found in AI response.");
  }

  return cleaned.substring(start, end + 1);
}

module.exports = extractJson;