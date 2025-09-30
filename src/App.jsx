import { useState, useMemo } from 'react'
import './App.css'

const MATH_SYMBOLS = {
  calculus: {
    name: '微積分',
    symbols: [
      { symbol: '∂', name: '偏微分', latex: '\\partial' },
      { symbol: '∫', name: '積分', latex: '\\int' },
      { symbol: '∬', name: '雙重積分', latex: '\\iint' },
      { symbol: '∭', name: '三重積分', latex: '\\iiint' },
      { symbol: '∮', name: '環積分', latex: '\\oint' },
      { symbol: '∇', name: '梯度', latex: '\\nabla' },
      { symbol: '∆', name: '拉普拉斯算子', latex: '\\Delta' },
      { symbol: '∞', name: '無窮大', latex: '\\infty' },
      { symbol: 'lim', name: '極限', latex: '\\lim' },
      { symbol: '∑', name: '求和', latex: '\\sum' },
      { symbol: '∏', name: '連乘', latex: '\\prod' },
      { symbol: 'dx', name: '微分元素', latex: 'dx' },
    ]
  },
  physics: {
    name: '物理',
    symbols: [
      { symbol: 'α', name: '阿爾法', latex: '\\alpha' },
      { symbol: 'β', name: '貝塔', latex: '\\beta' },
      { symbol: 'γ', name: '伽瑪', latex: '\\gamma' },
      { symbol: 'δ', name: '德爾塔', latex: '\\delta' },
      { symbol: 'ε', name: '伊普西龍', latex: '\\epsilon' },
      { symbol: 'θ', name: '西塔', latex: '\\theta' },
      { symbol: 'λ', name: '拉姆達', latex: '\\lambda' },
      { symbol: 'μ', name: '繆', latex: '\\mu' },
      { symbol: 'π', name: '圓周率', latex: '\\pi' },
      { symbol: 'σ', name: '西格瑪', latex: '\\sigma' },
      { symbol: 'τ', name: '陶', latex: '\\tau' },
      { symbol: 'φ', name: '斐', latex: '\\phi' },
      { symbol: 'ω', name: '歐米茄', latex: '\\omega' },
      { symbol: 'Ω', name: '大歐米茄', latex: '\\Omega' },
      { symbol: 'ℏ', name: '約化普朗克常數', latex: '\\hbar' },
      { symbol: 'c', name: '光速', latex: 'c' },
      { symbol: 'h', name: '普朗克常數', latex: 'h' },
    ]
  },
  algebra: {
    name: '代數',
    symbols: [
      { symbol: '√', name: '平方根', latex: '\\sqrt' },
      { symbol: '∛', name: '立方根', latex: '\\sqrt[3]' },
      { symbol: '∜', name: '四次方根', latex: '\\sqrt[4]' },
      { symbol: '±', name: '正負', latex: '\\pm' },
      { symbol: '∓', name: '負正', latex: '\\mp' },
      { symbol: '×', name: '乘號', latex: '\\times' },
      { symbol: '÷', name: '除號', latex: '\\div' },
      { symbol: '⋅', name: '點積', latex: '\\cdot' },
      { symbol: '∧', name: '邏輯與', latex: '\\wedge' },
      { symbol: '∨', name: '邏輯或', latex: '\\vee' },
      { symbol: '¬', name: '邏輯非', latex: '\\neg' },
      { symbol: '⊕', name: '異或', latex: '\\oplus' },
      { symbol: '⊗', name: '張量積', latex: '\\otimes' },
      { symbol: '∈', name: '屬於', latex: '\\in' },
      { symbol: '∉', name: '不屬於', latex: '\\notin' },
      { symbol: '⊂', name: '子集', latex: '\\subset' },
      { symbol: '⊃', name: '超集', latex: '\\supset' },
      { symbol: '∪', name: '聯集', latex: '\\cup' },
      { symbol: '∩', name: '交集', latex: '\\cap' },
      { symbol: '∅', name: '空集', latex: '\\emptyset' },
    ]
  },
  comparison: {
    name: '比較',
    symbols: [
      { symbol: '=', name: '等於', latex: '=' },
      { symbol: '≠', name: '不等於', latex: '\\neq' },
      { symbol: '<', name: '小於', latex: '<' },
      { symbol: '>', name: '大於', latex: '>' },
      { symbol: '≤', name: '小於等於', latex: '\\leq' },
      { symbol: '≥', name: '大於等於', latex: '\\geq' },
      { symbol: '≈', name: '約等於', latex: '\\approx' },
      { symbol: '≡', name: '恆等於', latex: '\\equiv' },
      { symbol: '≅', name: '全等於', latex: '\\cong' },
      { symbol: '∼', name: '相似於', latex: '\\sim' },
      { symbol: '∝', name: '正比於', latex: '\\propto' },
      { symbol: '≪', name: '遠小於', latex: '\\ll' },
      { symbol: '≫', name: '遠大於', latex: '\\gg' },
    ]
  },
  arrows: {
    name: '箭頭',
    symbols: [
      { symbol: '→', name: '右箭頭', latex: '\\rightarrow' },
      { symbol: '←', name: '左箭頭', latex: '\\leftarrow' },
      { symbol: '↑', name: '上箭頭', latex: '\\uparrow' },
      { symbol: '↓', name: '下箭頭', latex: '\\downarrow' },
      { symbol: '↔', name: '雙向箭頭', latex: '\\leftrightarrow' },
      { symbol: '⇒', name: '邏輯蘊含', latex: '\\Rightarrow' },
      { symbol: '⇐', name: '邏輯逆蘊含', latex: '\\Leftarrow' },
      { symbol: '⇔', name: '邏輯等價', latex: '\\Leftrightarrow' },
      { symbol: '↦', name: '映射到', latex: '\\mapsto' },
      { symbol: '⟶', name: '函數映射', latex: '\\longrightarrow' },
      { symbol: '⟵', name: '反向映射', latex: '\\longleftarrow' },
      { symbol: '⟷', name: '雙向映射', latex: '\\longleftrightarrow' },
    ]
  }
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('calculus')
  const [searchTerm, setSearchTerm] = useState('')
  const [inputText, setInputText] = useState('')
  const [showCopied, setShowCopied] = useState(false)

  const filteredSymbols = useMemo(() => {
    const category = MATH_SYMBOLS[selectedCategory]
    if (!searchTerm) return category.symbols
    
    return category.symbols.filter(symbol => 
      symbol.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [selectedCategory, searchTerm])

  const handleSymbolClick = (symbol) => {
    setInputText(prev => prev + symbol.symbol)
  }

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(inputText)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleClear = () => {
    setInputText('')
  }

  const handleCopyLatex = () => {
    const latexText = inputText.split('').map(char => {
      const symbol = Object.values(MATH_SYMBOLS)
        .flatMap(cat => cat.symbols)
        .find(s => s.symbol === char)
      return symbol ? symbol.latex : char
    }).join(' ')
    
    navigator.clipboard.writeText(latexText)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>數學符號輸入器</h1>
        <p>點擊符號快速輸入，支援微積分、物理、代數等常用符號</p>
      </header>

      <main className="main-content">
        <div className="controls">
          <div className="category-tabs">
            {Object.entries(MATH_SYMBOLS).map(([key, category]) => (
              <button
                key={key}
                className={`tab ${selectedCategory === key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(key)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="search-box">
            <input
              type="text"
              placeholder="搜尋符號或名稱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="symbols-grid">
          {filteredSymbols.map((symbol, index) => (
            <button
              key={index}
              className="symbol-button"
              onClick={() => handleSymbolClick(symbol)}
              title={`${symbol.name} (LaTeX: ${symbol.latex})`}
            >
              <span className="symbol">{symbol.symbol}</span>
              <span className="name">{symbol.name}</span>
            </button>
          ))}
        </div>

        <div className="input-section">
          <h3>輸入區域</h3>
          <div className="input-container">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="點擊上方符號或直接輸入..."
              className="input-textarea"
            />
            <div className="input-actions">
              <button onClick={handleCopyAll} className="copy-btn">
                {showCopied ? '已複製!' : '複製文字'}
              </button>
              <button onClick={handleCopyLatex} className="latex-btn">
                複製 LaTeX
              </button>
              <button onClick={handleClear} className="clear-btn">
                清除
              </button>
            </div>
          </div>
        </div>

        <div className="preview-section">
          <h3>數學表達式預覽</h3>
          <div className="preview-container">
            <div className="preview-text">
              {inputText ? (
                <div className="math-expression">
                  {inputText.split('').map((char, index) => {
                    // 查找符號資訊
                    const symbolInfo = Object.values(MATH_SYMBOLS)
                      .flatMap(cat => cat.symbols)
                      .find(s => s.symbol === char)
                    
                    return (
                      <span 
                        key={index}
                        className={`math-char ${symbolInfo ? 'math-symbol' : 'math-text'}`}
                        title={symbolInfo ? `${symbolInfo.name} (LaTeX: ${symbolInfo.latex})` : char}
                      >
                        {char}
                      </span>
                    )
                  })}
                </div>
              ) : (
                <div className="preview-placeholder">
                  <div className="placeholder-icon">📐</div>
                  <div className="placeholder-text">輸入數學符號後將在此顯示預覽...</div>
                  <div className="placeholder-hint">支援微積分、物理、代數等符號</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>💡 提示：滑鼠懸停在符號上可查看 LaTeX 代碼</p>
      </footer>
    </div>
  )
}

export default App
