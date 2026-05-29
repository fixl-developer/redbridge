import Script from "next/script";

const BODY_HTML = `
<div id="loaderBar" class="loader-bar"></div>

<!-- HEADER -->
<header id="header" class="rb-header sticky top-0 z-40">
  <div class="max-w-7xl mx-auto px-6 lg:px-10">
    <div class="flex items-center justify-between h-20">
      <a href="#/home" class="flex items-center gap-3">
        <div class="w-10 h-10 bg-red flex items-center justify-center" style="border-radius:2px">
          <span class="font-display text-white text-xl font-bold leading-none">R</span>
        </div>
        <div>
          <div class="font-display text-xl text-white font-semibold leading-tight">Redbridge</div>
          <div class="text-[10px] tracking-[.22em] text-[#888E99] uppercase">Treasury · Debt · Risk</div>
        </div>
      </a>
      <nav class="hide-mobile flex items-center gap-9 text-sm">
        <a href="#/home" class="rb-nav-link">Home</a>
        <a href="#/about" class="rb-nav-link">About</a>
        <a href="#/services" class="rb-nav-link">Services</a>
        <a href="#/insights" class="rb-nav-link">Insights & Data</a>
        <a href="#/contact" class="rb-nav-link">Contact</a>
      </nav>
      <div class="hide-mobile flex items-center gap-3">
        <a href="#/portal" class="text-sm text-[#D2D6DD] hover:text-white flex items-center gap-1.5">
          <i data-lucide="lock" class="w-4 h-4"></i> Treasury Portal
        </a>
        <a href="#/contact" class="btn-primary text-sm">Start a Mandate</a>
      </div>
      <button id="menuBtn" class="show-mobile p-2" aria-label="Menu"><i data-lucide="menu" class="w-6 h-6 text-white"></i></button>
    </div>
  </div>
</header>

<!-- Mobile nav -->
<div id="mobileNav" class="mobile-nav">
  <button id="menuClose" class="absolute top-6 right-6 text-white"><i data-lucide="x" class="w-7 h-7"></i></button>
  <a href="#/home" data-mobile>Home</a>
  <a href="#/about" data-mobile>About</a>
  <a href="#/services" data-mobile>Services</a>
  <a href="#/insights" data-mobile>Insights & Data</a>
  <a href="#/contact" data-mobile>Contact</a>
  <a href="#/portal" data-mobile><i data-lucide="lock" class="inline w-4 h-4 mr-1"></i> Treasury Portal</a>
</div>

<!-- APP ROOT -->
<main id="app" class="min-h-screen"></main>

<!-- FOOTER -->
<footer class="rb-footer mt-24">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 py-16">
    <div class="grid md:grid-cols-4 gap-10">
      <div class="md:col-span-2">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 bg-red flex items-center justify-center"><span class="font-display text-white text-xl font-bold leading-none">R</span></div>
          <div>
            <div class="font-display text-xl text-white font-semibold">Redbridge</div>
            <div class="text-[10px] tracking-[.22em] text-[#888E99] uppercase">Treasury · Debt · Risk</div>
          </div>
        </div>
        <p class="text-sm leading-relaxed max-w-md text-[#9098A4]">Independent treasury, debt and risk advisors to global corporates, sponsors and growth companies. We work only for you — never for a bank.</p>
        <div class="mt-6 flex gap-3">
          <a href="#" class="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-red transition"><i data-lucide="linkedin" class="w-4 h-4"></i></a>
          <a href="#" class="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-red transition"><i data-lucide="twitter" class="w-4 h-4"></i></a>
          <a href="#" class="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-red transition"><i data-lucide="youtube" class="w-4 h-4"></i></a>
        </div>
      </div>
      <div>
        <h4 class="text-white font-semibold text-xs tracking-[.18em] uppercase mb-4">Firm</h4>
        <ul class="space-y-3 text-sm">
          <li><a href="#/about">About</a></li>
          <li><a href="#/services">Services</a></li>
          <li><a href="#/insights">Insights & Data</a></li>
          <li><a href="#/contact">Careers</a></li>
          <li><a href="#/portal">Treasury Portal</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-semibold text-xs tracking-[.18em] uppercase mb-4">Offices</h4>
        <ul class="space-y-3 text-sm">
          <li><strong class="text-white block">London (HQ)</strong>22 Bishopsgate, EC2N 4BQ</li>
          <li><strong class="text-white block">Paris</strong>11 Rue Royale, 75008</li>
          <li><strong class="text-white block">Houston</strong>1100 Louisiana St, 77002</li>
          <li><strong class="text-white block">New York</strong>500 Fifth Avenue, 10110</li>
        </ul>
      </div>
    </div>
    <div class="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-[#7F8694]">
      <div>© 2026 Redbridge Advisory Group. All rights reserved. An independent advisor regulated by the FCA in the UK and the AMF in France.</div>
      <div class="flex gap-6"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Modern Slavery</a><a href="#">Conflicts Policy</a></div>
    </div>
  </div>
</footer>

<!-- Toast -->
<div id="toast" class="toast"></div>

<!-- Modal -->
<div id="modal" class="modal-backdrop"><div class="modal" id="modalBody"></div></div>
`;

export default function Page() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"
        strategy="afterInteractive"
      />
      <Script src="/redbridge.js" strategy="afterInteractive" />
    </>
  );
}
