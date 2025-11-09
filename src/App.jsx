import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import './App.css'

function App() {
  const canvasRef = useRef(null)

  // Lean Canvasの各セクションの状態管理
  const [canvasData, setCanvasData] = useState({
    productName: '',
    problem: '',
    existingAlternatives: '',
    solution: '',
    keyMetrics: '',
    uniqueValueProposition: '',
    highLevelConcept: '',
    unfairAdvantage: '',
    channels: '',
    customerSegments: '',
    earlyAdopters: '',
    costStructure: '',
    revenueStreams: ''
  })

  // LocalStorageから読み込み
  useEffect(() => {
    const saved = localStorage.getItem('leanCanvasData')
    if (saved) {
      setCanvasData(JSON.parse(saved))
    }
  }, [])

  // すべてのtextareaの高さを調整
  useEffect(() => {
    const textareas = document.querySelectorAll('.canvas-cell textarea')
    textareas.forEach(textarea => {
      adjustTextareaHeight(textarea)
    })
  }, [canvasData])

  // textareaの高さを自動調整する関数
  const adjustTextareaHeight = (element) => {
    if (!element) return
    element.style.height = 'auto'
    element.style.height = element.scrollHeight + 'px'
  }

  // データ更新ハンドラ
  const handleChange = (field, value) => {
    setCanvasData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // textarea入力時のハンドラ
  const handleTextareaInput = (e, field) => {
    adjustTextareaHeight(e.target)
    handleChange(field, e.target.value)
  }

  // Markdownエクスポートハンドラ
  const handleExportMarkdown = () => {
    const markdown = `# ${canvasData.productName || 'リーンキャンバス'}

## 課題
${canvasData.problem}

## 代替品
${canvasData.existingAlternatives}

## ソリューション
${canvasData.solution}

## 主要指標
${canvasData.keyMetrics}

## 独自の価値提案
${canvasData.uniqueValueProposition}

## ハイレベルコンセプト
${canvasData.highLevelConcept}

## 圧倒的な優位性
${canvasData.unfairAdvantage}

## チャネル
${canvasData.channels}

## 顧客セグメント
${canvasData.customerSegments}

## アーリーアダプター
${canvasData.earlyAdopters}

## コスト構造
${canvasData.costStructure}

## 収益の流れ
${canvasData.revenueStreams}
`

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const filename = canvasData.productName
      ? `${canvasData.productName.replace(/[^\w\s-]/g, '')}-lean-canvas.md`
      : 'lean-canvas.md'
    link.download = filename
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  // Markdownインポートハンドラ
  const handleImportMarkdown = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result
      if (typeof text !== 'string') return

      try {
        // Markdownをパース
        const lines = text.split('\n')
        const newData = { ...canvasData }

        let currentSection = ''
        let currentContent = []

        lines.forEach(line => {
          if (line.startsWith('# ')) {
            // プロダクト名
            newData.productName = line.substring(2).trim()
          } else if (line.startsWith('## ')) {
            // セクションの切り替え
            if (currentSection && currentContent.length > 0) {
              const content = currentContent.join('\n').trim()
              switch (currentSection) {
                case '課題': newData.problem = content; break
                case '代替品': newData.existingAlternatives = content; break
                case 'ソリューション': newData.solution = content; break
                case '主要指標': newData.keyMetrics = content; break
                case '独自の価値提案': newData.uniqueValueProposition = content; break
                case 'ハイレベルコンセプト': newData.highLevelConcept = content; break
                case '圧倒的な優位性': newData.unfairAdvantage = content; break
                case 'チャネル': newData.channels = content; break
                case '顧客セグメント': newData.customerSegments = content; break
                case 'アーリーアダプター': newData.earlyAdopters = content; break
                case 'コスト構造': newData.costStructure = content; break
                case '収益の流れ': newData.revenueStreams = content; break
              }
            }
            currentSection = line.substring(3).trim()
            currentContent = []
          } else if (currentSection && line.trim()) {
            currentContent.push(line)
          }
        })

        // 最後のセクション
        if (currentSection && currentContent.length > 0) {
          const content = currentContent.join('\n').trim()
          switch (currentSection) {
            case '課題': newData.problem = content; break
            case '代替品': newData.existingAlternatives = content; break
            case 'ソリューション': newData.solution = content; break
            case '主要指標': newData.keyMetrics = content; break
            case '独自の価値提案': newData.uniqueValueProposition = content; break
            case 'ハイレベルコンセプト': newData.highLevelConcept = content; break
            case '圧倒的な優位性': newData.unfairAdvantage = content; break
            case 'チャネル': newData.channels = content; break
            case '顧客セグメント': newData.customerSegments = content; break
            case 'アーリーアダプター': newData.earlyAdopters = content; break
            case 'コスト構造': newData.costStructure = content; break
            case '収益の流れ': newData.revenueStreams = content; break
          }
        }

        setCanvasData(newData)
        // LocalStorageにも保存
        localStorage.setItem('leanCanvasData', JSON.stringify(newData))
        alert('インポートしました')
      } catch (error) {
        console.error('インポートエラー:', error)
        alert('ファイルの読み込みに失敗しました')
      }
    }

    reader.readAsText(file)
    // input要素をリセット
    event.target.value = ''
  }

  // クリアハンドラ
  const handleClear = () => {
    if (window.confirm('すべてのデータをクリアしますか？')) {
      setCanvasData({
        productName: '',
        problem: '',
        existingAlternatives: '',
        solution: '',
        keyMetrics: '',
        uniqueValueProposition: '',
        highLevelConcept: '',
        unfairAdvantage: '',
        channels: '',
        customerSegments: '',
        earlyAdopters: '',
        costStructure: '',
        revenueStreams: ''
      })
      localStorage.removeItem('leanCanvasData')
    }
  }

  // 印刷ハンドラ
  const handlePrint = () => {
    window.print()
  }

  // PNG保存ハンドラ
  const handleExportPNG = async () => {
    if (!canvasRef.current) return

    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2, // 高解像度
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      })

      // Canvasを画像に変換
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
          link.download = `lean-canvas-${timestamp}.png`
          link.href = url
          link.click()
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    } catch (error) {
      console.error('PNG保存エラー:', error)
      alert('PNG保存に失敗しました')
    }
  }

  return (
    <div className="app">
      <header className="header no-print">
        <div className="header-left">
          <h1>リーンキャンバス</h1>
          <input
            type="text"
            className="product-name-input"
            value={canvasData.productName}
            onChange={(e) => handleChange('productName', e.target.value)}
            placeholder="プロダクト名を入力"
          />
        </div>
        <div className="buttons">
          <label htmlFor="import-file" className="btn btn-import">インポート</label>
          <input
            id="import-file"
            type="file"
            accept=".md,.markdown"
            onChange={handleImportMarkdown}
            style={{ display: 'none' }}
          />
          <button onClick={handleExportMarkdown} className="btn btn-export-md">エクスポート</button>
          <button onClick={handleClear} className="btn btn-clear">クリア</button>
          <button onClick={handleExportPNG} className="btn btn-export">PNG保存</button>
          <button onClick={handlePrint} className="btn btn-print">印刷</button>
        </div>
      </header>

      <div className="lean-canvas" ref={canvasRef}>
        {/* 左列：課題 / 代替品 */}
        <div className="canvas-cell cell-problem">
          <div className="cell-header">課題</div>
          <textarea
            value={canvasData.problem}
            onInput={(e) => handleTextareaInput(e, 'problem')}
            placeholder="解決すべき課題トップ3を記入"
          />
        </div>
        <div className="canvas-cell cell-alternatives">
          <div className="cell-header">代替品</div>
          <textarea
            value={canvasData.existingAlternatives}
            onInput={(e) => handleTextareaInput(e, 'existingAlternatives')}
            placeholder="現在の代替手段"
          />
        </div>

        {/* 中央左列：ソリューション / 主要指標 */}
        <div className="canvas-cell cell-solution">
          <div className="cell-header">ソリューション</div>
          <textarea
            value={canvasData.solution}
            onInput={(e) => handleTextareaInput(e, 'solution')}
            placeholder="課題に対する解決策"
          />
        </div>
        <div className="canvas-cell cell-metrics">
          <div className="cell-header">主要指標</div>
          <textarea
            value={canvasData.keyMetrics}
            onInput={(e) => handleTextareaInput(e, 'keyMetrics')}
            placeholder="測定すべき重要な指標"
          />
        </div>

        {/* 中央列：独自の価値提案 / ハイレベルコンセプト */}
        <div className="canvas-cell cell-value">
          <div className="cell-header">独自の価値提案</div>
          <textarea
            value={canvasData.uniqueValueProposition}
            onInput={(e) => handleTextareaInput(e, 'uniqueValueProposition')}
            placeholder="明確で説得力のあるメッセージ"
          />
        </div>
        <div className="canvas-cell cell-high-level-concept">
          <div className="cell-header">ハイレベルコンセプト</div>
          <textarea
            value={canvasData.highLevelConcept}
            onInput={(e) => handleTextareaInput(e, 'highLevelConcept')}
            placeholder="簡潔に言い換えると..."
          />
        </div>

        {/* 中央右列：圧倒的な優位性 / チャネル */}
        <div className="canvas-cell cell-advantage">
          <div className="cell-header">圧倒的な優位性</div>
          <textarea
            value={canvasData.unfairAdvantage}
            onInput={(e) => handleTextareaInput(e, 'unfairAdvantage')}
            placeholder="簡単に真似できない優位性"
          />
        </div>
        <div className="canvas-cell cell-channels">
          <div className="cell-header">チャネル</div>
          <textarea
            value={canvasData.channels}
            onInput={(e) => handleTextareaInput(e, 'channels')}
            placeholder="顧客へのリーチ方法"
          />
        </div>

        {/* 右列：顧客セグメント / アーリーアダプター */}
        <div className="canvas-cell cell-customers">
          <div className="cell-header">顧客セグメント</div>
          <textarea
            value={canvasData.customerSegments}
            onInput={(e) => handleTextareaInput(e, 'customerSegments')}
            placeholder="ターゲット顧客"
          />
        </div>
        <div className="canvas-cell cell-early-adopters">
          <div className="cell-header">アーリーアダプター</div>
          <textarea
            value={canvasData.earlyAdopters}
            onInput={(e) => handleTextareaInput(e, 'earlyAdopters')}
            placeholder="最初の顧客"
          />
        </div>

        {/* 下段：コスト構造 / 収益の流れ */}
        <div className="canvas-cell cell-cost">
          <div className="cell-header">コスト構造</div>
          <textarea
            value={canvasData.costStructure}
            onInput={(e) => handleTextareaInput(e, 'costStructure')}
            placeholder="主要なコスト"
          />
        </div>
        <div className="canvas-cell cell-revenue">
          <div className="cell-header">収益の流れ</div>
          <textarea
            value={canvasData.revenueStreams}
            onInput={(e) => handleTextareaInput(e, 'revenueStreams')}
            placeholder="収益源"
          />
        </div>
      </div>
    </div>
  )
}

export default App
