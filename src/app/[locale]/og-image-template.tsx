// Shared template for Open Graph and Twitter images
// Keeps configuration in one place

interface OGImageTemplateProps {
  baseUrl: string
}

export function OGImageTemplate({ baseUrl }: OGImageTemplateProps) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2B2B2B',
        backgroundImage: `url(${baseUrl}/doodles.svg)`,
        backgroundRepeat: 'repeat',
        backgroundSize: '300px 300px',
        position: 'relative',
      }}
    >
      {/* Border frame */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          right: 40,
          bottom: 40,
          border: '8px solid #377E8B',
          borderRadius: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0D0D0D',
        }}
      >
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
            padding: 0,
          }}
        >
          {/* Burger Icon */}
          <img
            src={`${baseUrl}/burguer.svg`}
            width={280}
            height={280}
            style={{ filter: 'drop-shadow(0 0 5px #fff) brightness(1.2) contrast(1.3)' }}
          />

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: -16,
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                fontFamily: 'LemonMilk',
                color: '#BF3988',
                textAlign: 'center',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}
            >
              SANTA
            </div>
            <div
              style={{
                fontSize: 57,
                fontWeight: 600,
                fontFamily: 'LemonMilk',
                color: '#BF3988',
                textAlign: 'center',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}
            >
              MÓNICA
            </div>
          </div>

          {/* Decorative line */}
          <div
            style={{
              width: 200,
              height: 6,
              backgroundColor: '#377E8B',
              borderRadius: 3,
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              fontSize: 28,
              fontFamily: "sans-serif",
              color: '#377E8B',
              textAlign: 'center',
              fontWeight: 600,
              maxWidth: 700,
              paddingTop: 8,
            }}
          >
            Auténticos sabores de California
          </div>
        </div>
      </div>
    </div>
  )
}
