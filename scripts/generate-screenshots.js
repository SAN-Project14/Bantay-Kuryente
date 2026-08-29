import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Mobile Home Dashboard Screenshot SVG (1080x1920)
const homeSvg = `
<svg width="1080" height="1920" viewBox="0 0 1080 1920" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .font-sans { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
    <linearGradient id="bgLight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
    <linearGradient id="amberCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
    <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#FBBF24" />
    </linearGradient>
    <filter id="shadowSm" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0F172A" flood-opacity="0.04" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1920" fill="url(#bgLight)" />

  <!-- Mobile Top Status & Header -->
  <rect width="1080" height="160" fill="#FFFFFF" />
  <line x1="0" y1="160" x2="1080" y2="160" stroke="#E2E8F0" stroke-width="2" />

  <!-- Top Bar Brand -->
  <g transform="translate(48, 48)">
    <rect width="64" height="64" rx="18" fill="#0F172A" />
    <path d="M35 14L19 36h14l-2 16 16-20h-14l2-12z" fill="#F59E0B" stroke="#D97706" stroke-width="1" />
    <text x="84" y="38" class="font-sans" font-size="28" font-weight="800" fill="#0F172A" letter-spacing="1">BANTAY-KURYENTE</text>
    <text x="84" y="60" class="font-sans" font-size="18" font-weight="500" fill="#64748B">Household Electricity &amp; Meter Tracker</text>
  </g>
  <g transform="translate(850, 52)">
    <rect width="180" height="56" rx="16" fill="#0F172A" />
    <text x="90" y="35" class="font-sans" font-size="20" font-weight="700" fill="#FFFFFF" text-anchor="middle">+ Record</text>
  </g>

  <!-- Container (Padding 48px) -->
  <g transform="translate(48, 200)">
    
    <!-- Hero / Bill Forecast Card -->
    <rect width="984" height="420" rx="28" fill="url(#amberCard)" />
    <rect x="0" y="0" width="984" height="420" rx="28" stroke="#334155" stroke-width="2" fill="none" />
    
    <g transform="translate(48, 48)">
      <text x="0" y="24" class="font-sans" font-size="20" font-weight="700" fill="#94A3B8" letter-spacing="2">CURRENT BILL PROJECTION</text>
      <text x="0" y="100" class="font-mono" font-size="64" font-weight="800" fill="#FFFFFF">₱2,845.50</text>
      <text x="440" y="100" class="font-sans" font-size="24" font-weight="600" fill="#F59E0B">est. this cycle</text>
      
      <!-- Mini stats within hero -->
      <line x1="0" y1="140" x2="888" y2="140" stroke="#334155" stroke-width="2" />
      
      <g transform="translate(0, 180)">
        <text x="0" y="0" class="font-sans" font-size="18" font-weight="600" fill="#94A3B8">Rate per kWh</text>
        <text x="0" y="32" class="font-mono" font-size="28" font-weight="700" fill="#F1F5F9">₱12.45</text>
      </g>
      <g transform="translate(300, 180)">
        <text x="0" y="0" class="font-sans" font-size="18" font-weight="600" fill="#94A3B8">Est. Total kWh</text>
        <text x="0" y="32" class="font-mono" font-size="28" font-weight="700" fill="#F1F5F9">228.5 kWh</text>
      </g>
      <g transform="translate(600, 180)">
        <text x="0" y="0" class="font-sans" font-size="18" font-weight="600" fill="#94A3B8">Daily Pace</text>
        <text x="0" y="32" class="font-mono" font-size="28" font-weight="700" fill="#F59E0B">7.6 kWh/day</text>
      </g>

      <!-- Progress bar -->
      <g transform="translate(0, 270)">
        <rect width="888" height="16" rx="8" fill="#334155" />
        <rect width="630" height="16" rx="8" fill="url(#amberGlow)" />
        <text x="0" y="44" class="font-sans" font-size="18" font-weight="600" fill="#94A3B8">Budget Progress: ₱2,845 / ₱4,000 Target (71%)</text>
      </g>
    </g>

    <!-- 2 Column Key Metrics Cards -->
    <g transform="translate(0, 456)">
      <!-- Left Metric Card -->
      <rect width="476" height="240" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" filter="url(#shadowSm)" />
      <g transform="translate(36, 40)">
        <text x="0" y="20" class="font-sans" font-size="18" font-weight="700" fill="#64748B">LATEST METER DIAL</text>
        <text x="0" y="80" class="font-mono" font-size="44" font-weight="800" fill="#0F172A">04829</text>
        <text x="0" y="125" class="font-sans" font-size="18" font-weight="500" fill="#10B981">+48.2 kWh since baseline</text>
        <text x="0" y="155" class="font-sans" font-size="16" font-weight="500" fill="#94A3B8">Logged 2 hours ago</text>
      </g>

      <!-- Right Metric Card -->
      <g transform="translate(508, 0)">
        <rect width="476" height="240" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" filter="url(#shadowSm)" />
        <g transform="translate(36, 40)">
          <text x="0" y="20" class="font-sans" font-size="18" font-weight="700" fill="#64748B">ACTIVE APPLIANCES</text>
          <text x="0" y="80" class="font-mono" font-size="44" font-weight="800" fill="#0F172A">8 Items</text>
          <text x="0" y="125" class="font-sans" font-size="18" font-weight="500" fill="#F59E0B">~₱1,620/mo appliance est.</text>
          <text x="0" y="155" class="font-sans" font-size="16" font-weight="500" fill="#94A3B8">Inverter AC &amp; Refrigerator lead</text>
        </g>
      </g>
    </g>

    <!-- Dynamic Smart Insights Card -->
    <g transform="translate(0, 732)">
      <rect width="984" height="220" rx="24" fill="#FEF3C7" stroke="#FDE68A" stroke-width="2" />
      <g transform="translate(36, 36)">
        <rect width="48" height="48" rx="12" fill="#F59E0B" />
        <text x="24" y="32" class="font-sans" font-size="24" font-weight="800" fill="#FFFFFF" text-anchor="middle">⚡</text>
        <text x="68" y="32" class="font-sans" font-size="22" font-weight="800" fill="#92400E">Smart Consumption Alert</text>
        <text x="0" y="90" class="font-sans" font-size="20" font-weight="500" fill="#78350F">Your current consumption is 12% lower than your last billing cycle.</text>
        <text x="0" y="125" class="font-sans" font-size="18" font-weight="500" fill="#B45309">You are on track to save approximately ₱420.00 this month!</text>
      </g>
    </g>

    <!-- Recent Readings Quick List -->
    <g transform="translate(0, 988)">
      <text x="0" y="30" class="font-sans" font-size="24" font-weight="800" fill="#0F172A">Recent Meter Log</text>
      
      <!-- Item 1 -->
      <g transform="translate(0, 56)">
        <rect width="984" height="120" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
        <text x="36" y="50" class="font-mono" font-size="26" font-weight="700" fill="#0F172A">04829 kWh</text>
        <text x="36" y="85" class="font-sans" font-size="18" font-weight="500" fill="#64748B">Aug 28, 2026 • 8:00 AM</text>
        <text x="800" y="65" class="font-mono" font-size="22" font-weight="700" fill="#10B981">+6.4 kWh</text>
      </g>
      
      <!-- Item 2 -->
      <g transform="translate(0, 196)">
        <rect width="984" height="120" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
        <text x="36" y="50" class="font-mono" font-size="26" font-weight="700" fill="#0F172A">04822 kWh</text>
        <text x="36" y="85" class="font-sans" font-size="18" font-weight="500" fill="#64748B">Aug 27, 2026 • 8:00 AM</text>
        <text x="800" y="65" class="font-mono" font-size="22" font-weight="700" fill="#10B981">+7.1 kWh</text>
      </g>
    </g>

  </g>

  <!-- Mobile Bottom Navigation Bar -->
  <g transform="translate(0, 1740)">
    <rect width="1080" height="180" fill="#FFFFFF" />
    <line x1="0" y1="0" x2="1080" y2="0" stroke="#E2E8F0" stroke-width="2" />
    
    <!-- Tab 1: Home (Active) -->
    <g transform="translate(135, 30)">
      <rect x="-60" y="-10" width="120" height="70" rx="18" fill="#F1F5F9" />
      <circle cx="0" cy="16" r="14" fill="#F59E0B" />
      <text x="0" y="70" class="font-sans" font-size="20" font-weight="800" fill="#0F172A" text-anchor="middle">Home</text>
    </g>

    <!-- Tab 2: History -->
    <g transform="translate(405, 30)">
      <circle cx="0" cy="16" r="12" fill="#94A3B8" />
      <text x="0" y="70" class="font-sans" font-size="20" font-weight="600" fill="#64748B" text-anchor="middle">History</text>
    </g>

    <!-- Tab 3: Appliances -->
    <g transform="translate(675, 30)">
      <circle cx="0" cy="16" r="12" fill="#94A3B8" />
      <text x="0" y="70" class="font-sans" font-size="20" font-weight="600" fill="#64748B" text-anchor="middle">Appliances</text>
    </g>

    <!-- Tab 4: Settings -->
    <g transform="translate(945, 30)">
      <circle cx="0" cy="16" r="12" fill="#94A3B8" />
      <text x="0" y="70" class="font-sans" font-size="20" font-weight="600" fill="#64748B" text-anchor="middle">Settings</text>
    </g>
  </g>
</svg>
`;

// 2. Mobile Meter Tracker & Dial Guide Screenshot (1080x1920)
const meterSvg = `
<svg width="1080" height="1920" viewBox="0 0 1080 1920" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .font-sans { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
    <linearGradient id="bgLight2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
  </defs>

  <rect width="1080" height="1920" fill="url(#bgLight2)" />

  <!-- Top Bar -->
  <rect width="1080" height="160" fill="#FFFFFF" />
  <line x1="0" y1="160" x2="1080" y2="160" stroke="#E2E8F0" stroke-width="2" />
  <g transform="translate(48, 56)">
    <text x="0" y="32" class="font-sans" font-size="32" font-weight="800" fill="#0F172A">Meter Reading &amp; Dials</text>
    <text x="0" y="64" class="font-sans" font-size="18" font-weight="500" fill="#64748B">Record and verify 4 or 5 dial electricity meters</text>
  </g>

  <!-- Main Content -->
  <g transform="translate(48, 200)">
    <!-- Electric Meter Dial Visualizer Card -->
    <rect width="984" height="460" rx="28" fill="#0F172A" stroke="#1E293B" stroke-width="2" />
    
    <g transform="translate(48, 44)">
      <text x="0" y="24" class="font-sans" font-size="20" font-weight="700" fill="#F59E0B" letter-spacing="2">ACTIVE METER SIMULATOR</text>
      <text x="0" y="70" class="font-sans" font-size="28" font-weight="700" fill="#FFFFFF">Analog 5-Dial Reading Guide</text>
      
      <!-- 5 Dials Illustration -->
      <g transform="translate(36, 120)">
        <!-- Dial 1 (10,000s) -->
        <g transform="translate(0, 0)">
          <circle cx="70" cy="70" r="60" fill="#1E293B" stroke="#475569" stroke-width="4" />
          <circle cx="70" cy="70" r="10" fill="#F59E0B" />
          <line x1="70" y1="70" x2="70" y2="25" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" />
          <text x="70" y="165" class="font-mono" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">0</text>
          <text x="70" y="195" class="font-sans" font-size="14" font-weight="600" fill="#94A3B8" text-anchor="middle">10,000</text>
        </g>
        <!-- Dial 2 (1,000s) -->
        <g transform="translate(180, 0)">
          <circle cx="70" cy="70" r="60" fill="#1E293B" stroke="#475569" stroke-width="4" />
          <circle cx="70" cy="70" r="10" fill="#F59E0B" />
          <line x1="70" y1="70" x2="105" y2="45" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" />
          <text x="70" y="165" class="font-mono" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">4</text>
          <text x="70" y="195" class="font-sans" font-size="14" font-weight="600" fill="#94A3B8" text-anchor="middle">1,000</text>
        </g>
        <!-- Dial 3 (100s) -->
        <g transform="translate(360, 0)">
          <circle cx="70" cy="70" r="60" fill="#1E293B" stroke="#475569" stroke-width="4" />
          <circle cx="70" cy="70" r="10" fill="#F59E0B" />
          <line x1="70" y1="70" x2="40" y2="100" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" />
          <text x="70" y="165" class="font-mono" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">8</text>
          <text x="70" y="195" class="font-sans" font-size="14" font-weight="600" fill="#94A3B8" text-anchor="middle">100</text>
        </g>
        <!-- Dial 4 (10s) -->
        <g transform="translate(540, 0)">
          <circle cx="70" cy="70" r="60" fill="#1E293B" stroke="#475569" stroke-width="4" />
          <circle cx="70" cy="70" r="10" fill="#F59E0B" />
          <line x1="70" y1="70" x2="105" y2="90" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" />
          <text x="70" y="165" class="font-mono" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">2</text>
          <text x="70" y="195" class="font-sans" font-size="14" font-weight="600" fill="#94A3B8" text-anchor="middle">10</text>
        </g>
        <!-- Dial 5 (1s) -->
        <g transform="translate(720, 0)">
          <circle cx="70" cy="70" r="60" fill="#1E293B" stroke="#475569" stroke-width="4" />
          <circle cx="70" cy="70" r="10" fill="#F59E0B" />
          <line x1="70" y1="70" x2="35" y2="50" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" />
          <text x="70" y="165" class="font-mono" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">9</text>
          <text x="70" y="195" class="font-sans" font-size="14" font-weight="600" fill="#94A3B8" text-anchor="middle">1</text>
        </g>
      </g>

      <g transform="translate(0, 360)">
        <text x="0" y="0" class="font-sans" font-size="20" font-weight="600" fill="#94A3B8">Computed Reading: </text>
        <text x="210" y="0" class="font-mono" font-size="24" font-weight="800" fill="#F59E0B">04829 kWh</text>
      </g>
    </g>

    <!-- Consumption History Bar Graph -->
    <g transform="translate(0, 500)">
      <rect width="984" height="480" rx="28" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
      <g transform="translate(48, 44)">
        <text x="0" y="24" class="font-sans" font-size="22" font-weight="800" fill="#0F172A">Daily kWh Consumption Trend</text>
        <text x="0" y="56" class="font-sans" font-size="16" font-weight="500" fill="#64748B">Last 7 recorded check-ins</text>

        <!-- Bars -->
        <g transform="translate(40, 110)">
          <!-- Day 1 -->
          <rect x="0" y="160" width="70" height="120" rx="8" fill="#E2E8F0" />
          <text x="35" y="310" class="font-sans" font-size="16" font-weight="600" fill="#64748B" text-anchor="middle">Mon</text>
          <text x="35" y="145" class="font-mono" font-size="16" font-weight="700" fill="#0F172A" text-anchor="middle">6.2</text>
          
          <!-- Day 2 -->
          <rect x="120" y="130" width="70" height="150" rx="8" fill="#E2E8F0" />
          <text x="155" y="310" class="font-sans" font-size="16" font-weight="600" fill="#64748B" text-anchor="middle">Tue</text>
          <text x="155" y="115" class="font-mono" font-size="16" font-weight="700" fill="#0F172A" text-anchor="middle">7.8</text>

          <!-- Day 3 -->
          <rect x="240" y="150" width="70" height="130" rx="8" fill="#E2E8F0" />
          <text x="275" y="310" class="font-sans" font-size="16" font-weight="600" fill="#64748B" text-anchor="middle">Wed</text>
          <text x="275" y="135" class="font-mono" font-size="16" font-weight="700" fill="#0F172A" text-anchor="middle">6.9</text>

          <!-- Day 4 -->
          <rect x="360" y="90" width="70" height="190" rx="8" fill="#FDE68A" />
          <text x="395" y="310" class="font-sans" font-size="16" font-weight="600" fill="#64748B" text-anchor="middle">Thu</text>
          <text x="395" y="75" class="font-mono" font-size="16" font-weight="700" fill="#D97706" text-anchor="middle">9.5</text>

          <!-- Day 5 -->
          <rect x="480" y="140" width="70" height="140" rx="8" fill="#E2E8F0" />
          <text x="515" y="310" class="font-sans" font-size="16" font-weight="600" fill="#64748B" text-anchor="middle">Fri</text>
          <text x="515" y="125" class="font-mono" font-size="16" font-weight="700" fill="#0F172A" text-anchor="middle">7.2</text>

          <!-- Day 6 -->
          <rect x="600" y="120" width="70" height="160" rx="8" fill="#E2E8F0" />
          <text x="635" y="310" class="font-sans" font-size="16" font-weight="600" fill="#64748B" text-anchor="middle">Sat</text>
          <text x="635" y="105" class="font-mono" font-size="16" font-weight="700" fill="#0F172A" text-anchor="middle">8.0</text>

          <!-- Day 7 (Today) -->
          <rect x="720" y="160" width="70" height="120" rx="8" fill="#F59E0B" />
          <text x="755" y="310" class="font-sans" font-size="16" font-weight="700" fill="#0F172A" text-anchor="middle">Sun</text>
          <text x="755" y="145" class="font-mono" font-size="16" font-weight="700" fill="#B45309" text-anchor="middle">6.4</text>
        </g>
      </g>
    </g>

    <!-- Reading Entry Form Preview Card -->
    <g transform="translate(0, 1020)">
      <rect width="984" height="420" rx="28" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
      <g transform="translate(48, 44)">
        <text x="0" y="24" class="font-sans" font-size="22" font-weight="800" fill="#0F172A">New Reading Entry</text>
        <text x="0" y="56" class="font-sans" font-size="16" font-weight="500" fill="#64748B">Instant validation against previous meter check</text>

        <g transform="translate(0, 90)">
          <rect width="888" height="90" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2" />
          <text x="32" y="55" class="font-mono" font-size="36" font-weight="700" fill="#0F172A">04835.5</text>
          <text x="750" y="55" class="font-sans" font-size="20" font-weight="700" fill="#64748B">kWh</text>
        </g>

        <g transform="translate(0, 210)">
          <rect width="888" height="90" rx="18" fill="#0F172A" />
          <text x="444" y="55" class="font-sans" font-size="22" font-weight="700" fill="#FFFFFF" text-anchor="middle">Save Reading (+6.5 kWh • ₱80.93)</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Bottom Nav -->
  <g transform="translate(0, 1740)">
    <rect width="1080" height="180" fill="#FFFFFF" />
    <line x1="0" y1="0" x2="1080" y2="0" stroke="#E2E8F0" stroke-width="2" />
    <g transform="translate(135, 30)">
      <circle cx="0" cy="16" r="12" fill="#94A3B8" />
      <text x="0" y="70" class="font-sans" font-size="20" font-weight="600" fill="#64748B" text-anchor="middle">Home</text>
    </g>
    <g transform="translate(405, 30)">
      <rect x="-60" y="-10" width="120" height="70" rx="18" fill="#F1F5F9" />
      <circle cx="0" cy="16" r="14" fill="#F59E0B" />
      <text x="0" y="70" class="font-sans" font-size="20" font-weight="800" fill="#0F172A" text-anchor="middle">History</text>
    </g>
    <g transform="translate(675, 30)">
      <circle cx="0" cy="16" r="12" fill="#94A3B8" />
      <text x="0" y="70" class="font-sans" font-size="20" font-weight="600" fill="#64748B" text-anchor="middle">Appliances</text>
    </g>
    <g transform="translate(945, 30)">
      <circle cx="0" cy="16" r="12" fill="#94A3B8" />
      <text x="0" y="70" class="font-sans" font-size="20" font-weight="600" fill="#64748B" text-anchor="middle">Settings</text>
    </g>
  </g>
</svg>
`;

// 3. Mobile Appliance Simulator Screenshot (1080x1920)
const appliancesSvg = `
<svg width="1080" height="1920" viewBox="0 0 1080 1920" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .font-sans { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
    <linearGradient id="bgLight3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
  </defs>

  <rect width="1080" height="1920" fill="url(#bgLight3)" />

  <!-- Top Bar -->
  <rect width="1080" height="160" fill="#FFFFFF" />
  <line x1="0" y1="160" x2="1080" y2="160" stroke="#E2E8F0" stroke-width="2" />
  <g transform="translate(48, 56)">
    <text x="0" y="32" class="font-sans" font-size="32" font-weight="800" fill="#0F172A">Appliances &amp; Energy Audit</text>
    <text x="0" y="64" class="font-sans" font-size="18" font-weight="500" fill="#64748B">Estimate appliance wattage, duty cycles, and monthly cost</text>
  </g>

  <g transform="translate(48, 200)">
    <!-- Summary Header Card -->
    <rect width="984" height="220" rx="28" fill="#0F172A" />
    <g transform="translate(48, 44)">
      <text x="0" y="24" class="font-sans" font-size="18" font-weight="700" fill="#94A3B8" letter-spacing="2">TOTAL APPLIANCE LOAD</text>
      <text x="0" y="85" class="font-mono" font-size="52" font-weight="800" fill="#FFFFFF">₱1,842.60 <tspan font-size="24" font-family="Plus Jakarta Sans" fill="#F59E0B">/ month</tspan></text>
      <text x="0" y="130" class="font-sans" font-size="18" font-weight="500" fill="#CBD5E1">6 active devices • 148 kWh estimated monthly load</text>
    </g>

    <!-- Appliance List Item 1: Inverter AC -->
    <g transform="translate(0, 256)">
      <rect width="984" height="200" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
      <g transform="translate(36, 36)">
        <rect width="64" height="64" rx="16" fill="#F1F5F9" />
        <text x="32" y="42" class="font-sans" font-size="28" font-weight="700" fill="#0F172A" text-anchor="middle">❄️</text>
        <g transform="translate(88, 10)">
          <text x="0" y="20" class="font-sans" font-size="24" font-weight="800" fill="#0F172A">Inverter Air Conditioner (1.0 HP)</text>
          <text x="0" y="50" class="font-sans" font-size="18" font-weight="500" fill="#64748B">750 Watts • 8 hrs/day • 30 days</text>
          <text x="0" y="80" class="font-mono" font-size="18" font-weight="600" fill="#3B82F6">180.0 kWh/mo</text>
        </g>
        <g transform="translate(720, 20)">
          <text x="180" y="24" class="font-mono" font-size="28" font-weight="800" fill="#D97706" text-anchor="end">₱1,120.50</text>
          <text x="180" y="52" class="font-sans" font-size="16" font-weight="500" fill="#94A3B8" text-anchor="end">61% of load</text>
        </g>
      </g>
    </g>

    <!-- Appliance List Item 2: Refrigerator -->
    <g transform="translate(0, 480)">
      <rect width="984" height="200" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
      <g transform="translate(36, 36)">
        <rect width="64" height="64" rx="16" fill="#F1F5F9" />
        <text x="32" y="42" class="font-sans" font-size="28" font-weight="700" fill="#0F172A" text-anchor="middle">🧊</text>
        <g transform="translate(88, 10)">
          <text x="0" y="20" class="font-sans" font-size="24" font-weight="800" fill="#0F172A">Two-Door Refrigerator</text>
          <text x="0" y="50" class="font-sans" font-size="18" font-weight="500" fill="#64748B">150 Watts • 24 hrs (50% duty) • 30 days</text>
          <text x="0" y="80" class="font-mono" font-size="18" font-weight="600" fill="#3B82F6">54.0 kWh/mo</text>
        </g>
        <g transform="translate(720, 20)">
          <text x="180" y="24" class="font-mono" font-size="28" font-weight="800" fill="#0F172A" text-anchor="end">₱403.38</text>
          <text x="180" y="52" class="font-sans" font-size="16" font-weight="500" fill="#94A3B8" text-anchor="end">22% of load</text>
        </g>
      </g>
    </g>

    <!-- Appliance List Item 3: Stand Fan -->
    <g transform="translate(0, 704)">
      <rect width="984" height="200" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
      <g transform="translate(36, 36)">
        <rect width="64" height="64" rx="16" fill="#F1F5F9" />
        <text x="32" y="42" class="font-sans" font-size="28" font-weight="700" fill="#0F172A" text-anchor="middle">💨</text>
        <g transform="translate(88, 10)">
          <text x="0" y="20" class="font-sans" font-size="24" font-weight="800" fill="#0F172A">Electric Stand Fan</text>
          <text x="0" y="50" class="font-sans" font-size="18" font-weight="500" fill="#64748B">65 Watts • 12 hrs/day • 30 days</text>
          <text x="0" y="80" class="font-mono" font-size="18" font-weight="600" fill="#3B82F6">23.4 kWh/mo</text>
        </g>
        <g transform="translate(720, 20)">
          <text x="180" y="24" class="font-mono" font-size="28" font-weight="800" fill="#0F172A" text-anchor="end">₱174.80</text>
          <text x="180" y="52" class="font-sans" font-size="16" font-weight="500" fill="#94A3B8" text-anchor="end">9% of load</text>
        </g>
      </g>
    </g>

    <!-- Appliance List Item 4: Smart LED TV -->
    <g transform="translate(0, 928)">
      <rect width="984" height="200" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
      <g transform="translate(36, 36)">
        <rect width="64" height="64" rx="16" fill="#F1F5F9" />
        <text x="32" y="42" class="font-sans" font-size="28" font-weight="700" fill="#0F172A" text-anchor="middle">📺</text>
        <g transform="translate(88, 10)">
          <text x="0" y="20" class="font-sans" font-size="24" font-weight="800" fill="#0F172A">55-inch 4K Smart TV</text>
          <text x="0" y="50" class="font-sans" font-size="18" font-weight="500" fill="#64748B">95 Watts • 5 hrs/day • 30 days</text>
          <text x="0" y="80" class="font-mono" font-size="18" font-weight="600" fill="#3B82F6">14.25 kWh/mo</text>
        </g>
        <g transform="translate(720, 20)">
          <text x="180" y="24" class="font-mono" font-size="28" font-weight="800" fill="#0F172A" text-anchor="end">₱106.45</text>
          <text x="180" y="52" class="font-sans" font-size="16" font-weight="500" fill="#94A3B8" text-anchor="end">6% of load</text>
        </g>
      </g>
    </g>

    <!-- Add Appliance Button -->
    <g transform="translate(0, 1160)">
      <rect width="984" height="100" rx="24" fill="#0F172A" />
      <text x="492" y="60" class="font-sans" font-size="24" font-weight="700" fill="#FFFFFF" text-anchor="middle">+ Add New Household Appliance</text>
    </g>
  </g>

  <!-- Bottom Nav -->
  <g transform="translate(0, 1740)">
    <rect width="1080" height="180" fill="#FFFFFF" />
    <line x1="0" y1="0" x2="1080" y2="0" stroke="#E2E8F0" stroke-width="2" />
    <g transform="translate(135, 30)">
      <circle cx="0" cy="16" r="12" fill="#94A3B8" />
      <text x="0" y="70" class="font-sans" font-size="20" font-weight="600" fill="#64748B" text-anchor="middle">Home</text>
    </g>
    <g transform="translate(405, 30)">
      <circle cx="0" cy="16" r="12" fill="#94A3B8" />
      <text x="0" y="70" class="font-sans" font-size="20" font-weight="600" fill="#64748B" text-anchor="middle">History</text>
    </g>
    <g transform="translate(675, 30)">
      <rect x="-60" y="-10" width="120" height="70" rx="18" fill="#F1F5F9" />
      <circle cx="0" cy="16" r="14" fill="#F59E0B" />
      <text x="0" y="70" class="font-sans" font-size="20" font-weight="800" fill="#0F172A" text-anchor="middle">Appliances</text>
    </g>
    <g transform="translate(945, 30)">
      <circle cx="0" cy="16" r="12" fill="#94A3B8" />
      <text x="0" y="70" class="font-sans" font-size="20" font-weight="600" fill="#64748B" text-anchor="middle">Settings</text>
    </g>
  </g>
</svg>
`;

// 4. Desktop Wide Dashboard Screenshot (1920x1080)
const desktopSvg = `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .font-sans { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
    <linearGradient id="bgLight4" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
    <linearGradient id="amberCardDesk" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
  </defs>

  <rect width="1920" height="1080" fill="url(#bgLight4)" />

  <!-- Top Desktop Header -->
  <rect width="1920" height="88" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
  <g transform="translate(64, 20)">
    <rect width="48" height="48" rx="14" fill="#0F172A" />
    <path d="M27 10L14 28h12l-2 12 14-16h-12l2-10z" fill="#F59E0B" stroke="#D97706" stroke-width="1" />
    <text x="64" y="32" class="font-sans" font-size="22" font-weight="800" fill="#0F172A" letter-spacing="1">BANTAY-KURYENTE</text>
    
    <!-- Top Nav Tabs -->
    <g transform="translate(480, 2)">
      <rect width="96" height="44" rx="10" fill="#F1F5F9" />
      <text x="48" y="28" class="font-sans" font-size="16" font-weight="700" fill="#0F172A" text-anchor="middle">Dashboard</text>
      
      <text x="180" y="28" class="font-sans" font-size="16" font-weight="600" fill="#64748B">History</text>
      <text x="290" y="28" class="font-sans" font-size="16" font-weight="600" fill="#64748B">Appliances</text>
      <text x="410" y="28" class="font-sans" font-size="16" font-weight="600" fill="#64748B">Settings</text>
    </g>

    <!-- Rate & Action Button -->
    <g transform="translate(1450, 2)">
      <rect width="140" height="44" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
      <text x="70" y="28" class="font-mono" font-size="15" font-weight="700" fill="#0F172A" text-anchor="middle">₱12.45 / kWh</text>
      
      <rect x="160" y="0" width="160" height="44" rx="12" fill="#0F172A" />
      <text x="240" y="28" class="font-sans" font-size="15" font-weight="700" fill="#FFFFFF" text-anchor="middle">+ Record Meter</text>
    </g>
  </g>

  <!-- Desktop Main Content Layout (1792px centered) -->
  <g transform="translate(64, 120)">
    
    <!-- Left Column: Hero & Insights (1080px) -->
    <g transform="translate(0, 0)">
      <!-- Hero Forecast Card -->
      <rect width="1120" height="340" rx="24" fill="url(#amberCardDesk)" />
      <g transform="translate(48, 40)">
        <text x="0" y="20" class="font-sans" font-size="16" font-weight="700" fill="#94A3B8" letter-spacing="2">PROJECTED ELECTRICITY BILL</text>
        <text x="0" y="90" class="font-mono" font-size="64" font-weight="800" fill="#FFFFFF">₱2,845.50</text>
        <text x="440" y="90" class="font-sans" font-size="22" font-weight="600" fill="#F59E0B">est. for billing cycle</text>

        <line x1="0" y1="130" x2="1024" y2="130" stroke="#334155" stroke-width="1.5" />
        
        <g transform="translate(0, 160)">
          <text x="0" y="0" class="font-sans" font-size="16" font-weight="600" fill="#94A3B8">Current Electricity Rate</text>
          <text x="0" y="30" class="font-mono" font-size="24" font-weight="700" fill="#FFFFFF">₱12.45/kWh</text>
        </g>
        <g transform="translate(320, 160)">
          <text x="0" y="0" class="font-sans" font-size="16" font-weight="600" fill="#94A3B8">Estimated Total kWh</text>
          <text x="0" y="30" class="font-mono" font-size="24" font-weight="700" fill="#FFFFFF">228.5 kWh</text>
        </g>
        <g transform="translate(640, 160)">
          <text x="0" y="0" class="font-sans" font-size="16" font-weight="600" fill="#94A3B8">Daily Pace</text>
          <text x="0" y="30" class="font-mono" font-size="24" font-weight="700" fill="#F59E0B">7.6 kWh/day</text>
        </g>

        <!-- Budget bar -->
        <g transform="translate(0, 240)">
          <rect width="1024" height="12" rx="6" fill="#334155" />
          <rect width="728" height="12" rx="6" fill="#F59E0B" />
        </g>
      </g>

      <!-- 2 Cards Row -->
      <g transform="translate(0, 368)">
        <!-- Latest Meter Dial -->
        <rect width="548" height="220" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
        <g transform="translate(32, 32)">
          <text x="0" y="16" class="font-sans" font-size="15" font-weight="700" fill="#64748B">LATEST METER READING</text>
          <text x="0" y="70" class="font-mono" font-size="40" font-weight="800" fill="#0F172A">04829 kWh</text>
          <text x="0" y="110" class="font-sans" font-size="16" font-weight="600" fill="#10B981">+48.2 kWh since cycle baseline</text>
          <text x="0" y="140" class="font-sans" font-size="14" font-weight="500" fill="#94A3B8">Logged 2 hours ago • Verified dial match</text>
        </g>

        <!-- Daily Average & Pace -->
        <g transform="translate(572, 0)">
          <rect width="548" height="220" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
          <g transform="translate(32, 32)">
            <text x="0" y="16" class="font-sans" font-size="15" font-weight="700" fill="#64748B">APPLIANCES BREAKDOWN</text>
            <text x="0" y="70" class="font-mono" font-size="40" font-weight="800" fill="#0F172A">₱1,842.60</text>
            <text x="0" y="110" class="font-sans" font-size="16" font-weight="600" fill="#F59E0B">6 active household items</text>
            <text x="0" y="140" class="font-sans" font-size="14" font-weight="500" fill="#94A3B8">Air Conditioner accounts for 61% of cost</text>
          </g>
        </g>
      </g>

      <!-- Smart Insights -->
      <g transform="translate(0, 616)">
        <rect width="1120" height="150" rx="20" fill="#FEF3C7" stroke="#FDE68A" stroke-width="1.5" />
        <g transform="translate(32, 32)">
          <text x="0" y="24" class="font-sans" font-size="18" font-weight="800" fill="#92400E">⚡ Energy Saving Tip: AC Temperature Calibration</text>
          <text x="0" y="60" class="font-sans" font-size="16" font-weight="500" fill="#78350F">Setting your inverter AC to 25°C instead of 20°C can save up to ₱350 per month on your Meralco / electric coop bill.</text>
        </g>
      </g>
    </g>

    <!-- Right Column: Recent Log & Quick Calculator (630px) -->
    <g transform="translate(1160, 0)">
      <rect width="632" height="766" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
      <g transform="translate(36, 36)">
        <text x="0" y="20" class="font-sans" font-size="20" font-weight="800" fill="#0F172A">Recent Meter Logs</text>
        <text x="0" y="48" class="font-sans" font-size="14" font-weight="500" fill="#64748B">Saved offline on this device</text>

        <!-- Log 1 -->
        <g transform="translate(0, 80)">
          <rect width="560" height="90" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
          <text x="24" y="40" class="font-mono" font-size="20" font-weight="700" fill="#0F172A">04829 kWh</text>
          <text x="24" y="68" class="font-sans" font-size="14" font-weight="500" fill="#64748B">Aug 28, 2026 • 8:00 AM</text>
          <text x="460" y="52" class="font-mono" font-size="18" font-weight="700" fill="#10B981">+6.4 kWh</text>
        </g>

        <!-- Log 2 -->
        <g transform="translate(0, 190)">
          <rect width="560" height="90" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
          <text x="24" y="40" class="font-mono" font-size="20" font-weight="700" fill="#0F172A">04822 kWh</text>
          <text x="24" y="68" class="font-sans" font-size="14" font-weight="500" fill="#64748B">Aug 27, 2026 • 8:00 AM</text>
          <text x="460" y="52" class="font-mono" font-size="18" font-weight="700" fill="#10B981">+7.1 kWh</text>
        </g>

        <!-- Log 3 -->
        <g transform="translate(0, 300)">
          <rect width="560" height="90" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
          <text x="24" y="40" class="font-mono" font-size="20" font-weight="700" fill="#0F172A">04815 kWh</text>
          <text x="24" y="68" class="font-sans" font-size="14" font-weight="500" fill="#64748B">Aug 26, 2026 • 8:15 AM</text>
          <text x="460" y="52" class="font-mono" font-size="18" font-weight="700" fill="#10B981">+6.8 kWh</text>
        </g>

        <!-- Offline Status Banner in Log -->
        <g transform="translate(0, 420)">
          <rect width="560" height="120" rx="16" fill="#F1F5F9" />
          <text x="24" y="40" class="font-sans" font-size="16" font-weight="700" fill="#0F172A">100% Offline-Capable</text>
          <text x="24" y="70" class="font-sans" font-size="14" font-weight="500" fill="#64748B">All electricity calculations and meter history run directly inside your browser storage.</text>
        </g>
      </g>
    </g>
  </g>
</svg>
`;

async function generate() {
  console.log('Generating PWA screenshots...');
  
  await sharp(Buffer.from(homeSvg))
    .png({ quality: 90 })
    .toFile(path.join(publicDir, 'screenshot-home.png'));
  console.log('Created public/screenshot-home.png (1080x1920)');

  await sharp(Buffer.from(meterSvg))
    .png({ quality: 90 })
    .toFile(path.join(publicDir, 'screenshot-meter.png'));
  console.log('Created public/screenshot-meter.png (1080x1920)');

  await sharp(Buffer.from(appliancesSvg))
    .png({ quality: 90 })
    .toFile(path.join(publicDir, 'screenshot-appliances.png'));
  console.log('Created public/screenshot-appliances.png (1080x1920)');

  await sharp(Buffer.from(desktopSvg))
    .png({ quality: 90 })
    .toFile(path.join(publicDir, 'screenshot-desktop.png'));
  console.log('Created public/screenshot-desktop.png (1920x1080)');

  console.log('All PWA screenshots generated successfully.');
}

generate().catch(console.error);
