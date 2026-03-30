import { useState } from 'react'
import { useTheme, THEMES } from '../context/ThemeContext'

export default function ThemeSelector() {
  const { theme, themeId, setTheme } = useTheme()
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: 'fixed',
          top: '15px',
          right: '15px',
          zIndex: 1000,
          padding: '10px 15px',
          background: theme.primaryColor,
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}
      >
        🎨 主题
      </button>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '25px',
              width: '90%',
              maxWidth: '350px',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{
              textAlign: 'center',
              marginBottom: '20px',
              color: theme.primaryColor
            }}>
              选择主题风格
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id)
                    setShowModal(false)
                  }}
                  style={{
                    padding: '15px',
                    background: t.id === themeId ? t.primaryColor + '20' : '#f5f5f5',
                    border: `2px solid ${t.id === themeId ? t.primaryColor : 'transparent'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: t.primaryColor
                  }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', color: t.textColor }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      背景: {t.background}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '20px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  )
}