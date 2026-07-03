/**
 * Sitewide legal disclaimer. Rendered once inside the root layout so it
 * appears on every page.
 */
export function DisclaimerFooter() {
  return (
    <footer
      className="mt-16 px-4 py-6 border-t"
      style={{
        borderColor: "#1f1f1f",
        background: "#0a0a0a",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-2 text-center">
        <p
          className="font-mono"
          style={{
            color: "#8a8a80",
            fontSize: 11,
            letterSpacing: "0.3px",
            lineHeight: 1.6,
          }}
        >
          RaktSetu is a donor–patient communication platform. Not a medical service. Blood
          transfusion must happen at a certified medical facility. In a life-threatening
          emergency always call{" "}
          <a
            href="tel:108"
            style={{ color: "#dc2626", fontWeight: 500 }}
            className="hover:underline"
          >
            108
          </a>{" "}
          first.
        </p>
        <p
          className="font-serif"
          style={{ color: "#555", fontSize: 11 }}
        >
          RaktSetu · Gujarat, India
        </p>
      </div>
    </footer>
  );
}
