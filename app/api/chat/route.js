export async function POST(request) {
  // Simulate a delay to mimic AI processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Demo response with markdown content
  const response = {
    summary: `# AI Response\n\nDanke für Ihre Nachricht!\n\n- **Antwort**: Dies ist eine Demo-Antwort.\n- **Details**: Siehe Editor für Inhalt.`,
    editor_content: `Of course! Here’s a basic resume template in LaTeX format to get you started.  
You can easily customize each section with your information.

\`\`\`latex
\\documentclass[a4paper,10pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{parskip}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\begin{document}

\\begin{center}
    {\\LARGE \\textbf{Your Name}}\\\\
    \\vspace{2mm}
    Your Address \\\\
    City, State ZIP \\\\
    Email: \\href{mailto:your.email@example.com}{your.email@example.com} \\\\
    Phone: (123) 456-7890 \\\\
\\end{center}

\\vspace{5mm}

\\noindent
\\textbf{Objective}\\\\
A brief summary of your professional goals and what you aim to contribute to your next role.

\\vspace{3mm}
\\noindent
\\textbf{Education}
\\begin{itemize}[leftmargin=*]
    \\item \\textbf{Degree}, Major \\hfill Month Year -- Month Year \\\\
    University Name, City, Country \\\\
    \\textit{Relevant coursework or achievements (optional)}
\\end{itemize}

\\vspace{3mm}
\\noindent
\\textbf{Work Experience}
\\begin{itemize}[leftmargin=*]
    \\item \\textbf{Job Title} \\hfill Company Name, Location \\\\
    Month Year -- Month Year \\\\
    \\begin{itemize}
        \\item First duty or achievement.
        \\item Second duty or achievement.
    \\end{itemize}
\\end{itemize}

\\vspace{3mm}
\\noindent
\\textbf{Skills}
\\begin{itemize}[leftmargin=*]
    \\item Skill 1
    \\item Skill 2
    \\item Skill 3
\\end{itemize}

\\vspace{3mm}
\\noindent
\\textbf{Certifications \\& Awards}
\\begin{itemize}[leftmargin=*]
    \\item Certificate or Award Name, Year
\\end{itemize}

\\vspace{3mm}
\\noindent
\\textbf{Interests}
\\begin{itemize}[leftmargin=*]
    \\item Interest 1
    \\item Interest 2
\\end{itemize}

\\end{document}
\`\`\`

Would you like a resume template tailored for a specific field or level (e.g., teaching, programming, student)? Or do you need help filling in any section? Let me know!`,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
