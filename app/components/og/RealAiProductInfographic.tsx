
import { ImageResponse } from '@vercel/og';

interface ProductInfographicProps {
  industry_header: string;
  items: string[];
}

export default function RealAiProductInfographic({
  industry_header = 'EDU',
  items = ['Desk Mat', 'Laptop Cooling Fan', 'Hoodie', 'Planner', 'Book Bag'],
}: ProductInfographicProps) {

  const colors = { bg: '#1ea0f2', yellow: '#fef200', dark: '#232323', white: '#ffffff' };

  return (
    <div style={{
        height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg,
        fontFamily: '"Inter", sans-serif', padding: '60px 40px', color: colors.white,
      }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', width: '100%', flexDirection: 'column', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 700, textTransform: 'uppercase', color: colors.yellow }}>
          REAL.AI PRODUCT RESULTS: <span style={{ color: colors.white }}>{industry_header}</span>
        </h2>
        <div style={{ width: '450px', height: '3px', backgroundColor: '#89cff9', marginTop: '10px' }} />
      </div>

      {/* CONTENT */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', flexGrow: 1, justifyContent: 'center' }}>
        <div style={{ display: 'flex', marginBottom: '40px' }}>
             {/* Replace with production URL */}
             <img src="https://your-domain.com/assets/gesture-box.png" width="400" height="300" style={{ objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '80%' }}>
            <h3 style={{ fontSize: '28px', fontWeight: 900, color: colors.yellow, textTransform: 'uppercase', marginBottom: '20px' }}>
                GESTURE GIFT BOX CONTENTS:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors.white }} />
                        <span style={{ fontSize: '24px', fontWeight: 600, textTransform: 'uppercase' }}>{item}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <span style={{ fontSize: '28px', fontWeight: 500, opacity: 0.9 }}>WANT TO MEET OR EXCEED THESE NUMBERS?</span>
           <span style={{ fontSize: '30px', fontWeight: 800, color: colors.yellow }}>BOOK A CALL TO ENRICH YOUR CAMPAIGN WITH GESTURE’S REAL.AI</span>
        </div>
        {/* Link wrapped around button in parent component */}
        <div style={{ backgroundColor: colors.dark, color: colors.white, padding: '20px 60px', borderRadius: '50px', fontSize: '36px', fontWeight: 700, marginTop: '20px', display: 'flex' }}>
          Book a call
        </div>
      </div>
      
      {/* LOGO */}
      <div style={{ position: 'absolute', bottom: 30, left: 40 }}>
         <div style={{ fontSize: '40px', fontWeight: 900 }}>G</div>
         <div style={{ fontSize: '12px' }}>Gesture</div>
      </div>
       <div style={{ position: 'absolute', bottom: 30, right: 40, fontSize: '14px', opacity: 0.8 }}>
         © 2025 Gesture. All rights reserved.
      </div>
    </div>
  );
}
