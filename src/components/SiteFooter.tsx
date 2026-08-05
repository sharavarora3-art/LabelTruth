import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">
            Label<span className="text-primary">Truth</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A Product-to-Claim scanner for packaged food. Operated by EcoTruth Group.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Product</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link to="/scan" className="hover:text-foreground">
                Scanner
              </Link>
            </li>
            <li>
              <Link to="/history" className="hover:text-foreground">
                Scan history
              </Link>
            </li>
            <li>
              <Link to="/api" className="hover:text-foreground">
                API Program
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Legal</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link to="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-foreground">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link to="/ip-policy" className="hover:text-foreground">
                Intellectual Property Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70 px-5 py-5">
        <p className="mx-auto max-w-6xl text-xs text-muted-foreground">
          © {new Date().getFullYear()} EcoTruth Group. All intellectual property rights in
          LabelTruth, the P:C ratio and the LabelTruth methodology are reserved. Guidance only —
          not medical advice.
        </p>
      </div>
    </footer>
  );
}
