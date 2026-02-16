export default function FooterPanel() {
  return (
    <div className="footerPanel">

      {/* effetto glow rosa sopra il separatore */}
      <img
        src="/images/effects_pink.svg"
        alt=""
        aria-hidden="true"
        className="footerFx"
      />

      {/* separatore */}
      <div className="footerDivider" />

      {/* contenuto footer */}
      <p className="footerCopy">© 2026 reav. All rights reserved.</p>

      <p className="footerDisclaimer">
        This is an unofficial fan project and is not affiliated with, endorsed,
        sponsored, or specifically approved by Bandai Namco, Toei Animation,
        or any related rights holders.
      </p>
    </div>
  );
}
