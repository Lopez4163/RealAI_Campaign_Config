import { ImageResponse } from '@vercel/og';

interface StatsInfographicProps {
  industry_header: string;
  sample_size: string;
  conversion_rate: string;
  ltv_multiple: string;
}

export default function RealAiStatsInfographic({
  industry_header = 'CPG',
  sample_size = '10,000+',
  conversion_rate = '40-45%',
  ltv_multiple = '25-30x',
}: StatsInfographicProps) {
  
  // Shared Brand Colors
  const colors = {
    bg: '#1ea0f2',      // Bright blue
    yellow: '#fef200',  // Highlighter yellow
    dark: '#232323',    // Dark button
    white: '#ffffff',
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.bg,
        fontFamily: '"Inter", sans-serif',
        padding: '60px 40px',
        color: colors.white,
      }}
    >
      {/* --- HEADER --- */}
      <div style={{ display: 'flex', width: '100%', flexDirection: 'column', marginBottom: '20px' }}>
        <h2 style={{ 
          fontSize: '32px', 
          margin: 0, 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          color: colors.yellow 
        }}>
          REAL.AI AUDIENCE RESULTS: <span style={{ color: colors.white }}>{industry_header}</span>
        </h2>
        <div style={{ width: '450px', height: '3px', backgroundColor: '#89cff9', marginTop: '10px' }} />
      </div>

      {/* --- DATA STACK --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center', width: '100%' }}>
        
        {/* ROW 1: Sample Size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {/* Icon: Target */}
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke={colors.yellow} strokeWidth="2">
             <path d="M12 2a10 10 0 1 0 10 10" />
             <path d="M12 6a6 6 0 1 0 6 6" />
             <path d="M12 10a2 2 0 1 0 2 2" />
             <path d="M22 2l-9 9" strokeWidth="3" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: 600, opacity: 0.9 }}>SAMPLE SIZE</span>
            <span style={{ fontSize: '110px', fontWeight: 800, lineHeight: 1, color: colors.yellow }}>
              {sample_size}
            </span>
          </div>
        </div>

        {/* ROW 2: Conversion Rate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {/* Icon: Funnel */}
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke={colors.yellow} strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" fill="#89cff9" stroke={colors.white} />
            <circle cx="18" cy="18" r="4" fill={colors.bg} stroke={colors.white} strokeWidth="2" />
            <path d="M17 17h2v2h-2z" fill={colors.white} />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: 600, opacity: 0.9 }}>CONVERSION RATE</span>
            <span style={{ fontSize: '110px', fontWeight: 800, lineHeight: 1, color: colors.yellow }}>
              {conversion_rate}
            </span>
          </div>
        </div>

        {/* ROW 3: LTV Multiple */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {/* Icon: Money Bag */}
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke={colors.yellow} strokeWidth="2">
             <path d="M12 2v20" stroke={colors.white} strokeWidth="4" />
             <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={colors.yellow} strokeWidth="3"/>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: 600, opacity: 0.9 }}>LTV MULTIPLE</span>
            <span style={{ fontSize: '110px', fontWeight: 800, lineHeight: 1, color: colors.yellow }}>
              {ltv_multiple}
            </span>
          </div>
        </div>
      </div>

      {/* --- FOOTER CTA --- */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <span style={{ fontSize: '28px', fontWeight: 500, opacity: 0.9 }}>WANT TO MEET OR EXCEED THESE NUMBERS?</span>
           <span style={{ fontSize: '30px', fontWeight: 800, color: colors.yellow }}>BOOK A CALL TO ENRICH YOUR CAMPAIGN WITH GESTURE’S REAL.AI</span>
        </div>

        {/* Button */}
        <div style={{
          backgroundColor: colors.dark,
          color: colors.white,
          padding: '20px 60px',
          borderRadius: '50px',
          fontSize: '36px',
          fontWeight: 700,
          marginTop: '20px',
          display: 'flex'
        }}>
          Book a call
        </div>
      </div>

      {/* --- LOGO FOOTER --- */}
      <div style={{ position: 'absolute', bottom: 30, left: 40, display: 'flex' }}>
         {/* Simple G Logo Placeholder */}
         <div style={{ fontSize: '40px', fontWeight: 900 }}>G</div>
         <div style={{ fontSize: '12px' }}>Gesture</div>
      </div>
       <div style={{ position: 'absolute', bottom: 30, right: 40, fontSize: '14px', opacity: 0.8 }}>
        © 2025 Gesture. All rights reserved.
      </div>

    </div>
  );
}


