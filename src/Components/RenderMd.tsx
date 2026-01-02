import React from "react";

function markdownToHtml2(md: string) {
    let html = md.trim();

    // Headings
    html = html.replace(/^##### (.*$)/gim, "<h5>$1</h5>");
    html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/(?<!^|\n)\*(.*?)\*/g, "<em>$1</em>");

    // Bullet points
    html = html.replace(/^\s*[-*] (.*)$/gim, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>");

    // Paragraphs
    html = html.replace(/\n\n+/g, "</p><p>");

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre><code class="language-${lang || "plain"}">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre><br/>`;
    });

    return `<p>${html}</p>`;
}

export default function RenderMd({ data }: { data: string }) {
    const paragraph = data.split("\n\n");

    return (
        <div>
            <style>{`
ul {
  padding-left: 1.5rem;
  list-style-type: disc;
}

ul li {
  line-height: 1.6;
}
code {
  font-family: monospace;
  font-size: 0.9rem;
}
pre {
   display: inline-block;
  overflow-x: auto;
}

            `}</style>
            <div>
                {paragraph.map((p, i) => {
                    const safeHtml = markdownToHtml2(p);
                    return (
                        <>
                            <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
                            <br />
                        </>
                    );
                })}
            </div>
        </div>
    );
}
