export async function POST(request) {
  // Simulate a delay to mimic AI processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Demo response with markdown content
  const response = {
    summary: `# AI Response\n\nDanke für Ihre Nachricht!\n\n- **Antwort**: Dies ist eine Demo-Antwort.\n- **Details**: Siehe Editor für Inhalt.`,
    editor_content: `# Demo Editor Content\n\nDies ist ein Beispielinhalt für den Editor.\n\n- Punkt 1\n- Punkt 2\n\n**Hervorgehoben**: Wichtiger Text`,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
