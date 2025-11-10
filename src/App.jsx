import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import pptxgen from 'pptxgenjs'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
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
    const filename = canvasData.productName.trim()
      ? `${canvasData.productName.trim()}.md`
      : 'leancanvas.md'
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
          const filename = canvasData.productName.trim()
            ? `${canvasData.productName.trim()}.png`
            : 'leancanvas.png'
          link.download = filename
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

  // PowerPoint/Googleスライドエクスポートハンドラ
  const handleExportPptx = () => {
    try {
      const pptx = new pptxgen()

      // スライドのサイズ設定（16:9）
      pptx.layout = 'LAYOUT_16x9'

      const slide = pptx.addSlide()

      // タイトルを追加
      slide.addText(canvasData.productName || 'リーンキャンバス', {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.5,
        fontSize: 24,
        bold: true,
        color: '363636',
        align: 'center'
      })

      // コンテンツの長さを計算してフォントサイズを決定
      const calculateFontSize = (text) => {
        const length = text.length
        if (length < 100) return 10
        if (length < 200) return 9
        if (length < 300) return 8
        return 7
      }

      // テーブル構造でキャンバスを作成
      const tableData = [
        // 行1（ヘッダー）
        [
          { text: '課題', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center', valign: 'middle' } },
          { text: 'ソリューション', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center', valign: 'middle' } },
          { text: '独自の価値提案', options: { fill: 'FFF4E6', bold: true, fontSize: 10, align: 'center', valign: 'middle', rowspan: 2 } },
          { text: '圧倒的な優位性', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center', valign: 'middle' } },
          { text: '顧客セグメント', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center', valign: 'middle' } }
        ],
        // 行2（上半分コンテンツ）
        [
          { text: canvasData.problem || '', options: { fontSize: calculateFontSize(canvasData.problem), valign: 'top' } },
          { text: canvasData.solution || '', options: { fontSize: calculateFontSize(canvasData.solution), valign: 'top' } },
          null, // 価値提案はrowspanで処理
          { text: canvasData.unfairAdvantage || '', options: { fontSize: calculateFontSize(canvasData.unfairAdvantage), valign: 'top' } },
          { text: canvasData.customerSegments || '', options: { fontSize: calculateFontSize(canvasData.customerSegments), valign: 'top' } }
        ],
        // 行3（下半分ヘッダー）
        [
          { text: '代替品', options: { fontSize: 8, color: '666666', valign: 'top' } },
          { text: '主要指標', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center', valign: 'middle' } },
          { text: 'ハイレベルコンセプト', options: { fontSize: 8, color: '666666', valign: 'top' } },
          { text: 'チャネル', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center', valign: 'middle' } },
          { text: 'アーリーアダプター', options: { fontSize: 8, color: '666666', valign: 'top' } }
        ],
        // 行4（下半分コンテンツ）
        [
          { text: canvasData.existingAlternatives || '', options: { fontSize: calculateFontSize(canvasData.existingAlternatives), valign: 'top' } },
          { text: canvasData.keyMetrics || '', options: { fontSize: calculateFontSize(canvasData.keyMetrics), valign: 'top' } },
          { text: canvasData.highLevelConcept || '', options: { fontSize: calculateFontSize(canvasData.highLevelConcept), valign: 'top' } },
          { text: canvasData.channels || '', options: { fontSize: calculateFontSize(canvasData.channels), valign: 'top' } },
          { text: canvasData.earlyAdopters || '', options: { fontSize: calculateFontSize(canvasData.earlyAdopters), valign: 'top' } }
        ],
        // 行5（下段ヘッダー）
        [
          { text: 'コスト構造', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center', valign: 'middle', colspan: 3 } },
          null,
          null,
          { text: '収益の流れ', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center', valign: 'middle', colspan: 2 } },
          null
        ],
        // 行6（下段コンテンツ）
        [
          { text: canvasData.costStructure || '', options: { fontSize: calculateFontSize(canvasData.costStructure), valign: 'top', colspan: 3 } },
          null,
          null,
          { text: canvasData.revenueStreams || '', options: { fontSize: calculateFontSize(canvasData.revenueStreams), valign: 'top', colspan: 2 } },
          null
        ]
      ]

      // 価値提案セルを正しく処理するため再構築
      const rows = [
        // Row 1: Headers
        [
          { text: '課題', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center' } },
          { text: 'ソリューション', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center' } },
          { text: '独自の価値提案', options: { fill: 'FFF4E6', bold: true, fontSize: 10, align: 'center' } },
          { text: '圧倒的な優位性', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center' } },
          { text: '顧客セグメント', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center' } }
        ],
        // Row 2: Content top
        [
          { text: canvasData.problem || '', options: { fontSize: calculateFontSize(canvasData.problem), valign: 'top', border: [{ pt: 1, color: '333333' }, { pt: 1, color: '333333' }, { pt: 0.5, color: 'CCCCCC' }, { pt: 1, color: '333333' }] } },
          { text: canvasData.solution || '', options: { fontSize: calculateFontSize(canvasData.solution), valign: 'top' } },
          { text: canvasData.uniqueValueProposition || '', options: { fontSize: calculateFontSize(canvasData.uniqueValueProposition), valign: 'top', fill: 'FFF4E6', border: [{ pt: 1, color: '333333' }, { pt: 1, color: '333333' }, { pt: 0.5, color: 'CCCCCC' }, { pt: 1, color: '333333' }] } },
          { text: canvasData.unfairAdvantage || '', options: { fontSize: calculateFontSize(canvasData.unfairAdvantage), valign: 'top' } },
          { text: canvasData.customerSegments || '', options: { fontSize: calculateFontSize(canvasData.customerSegments), valign: 'top', border: [{ pt: 1, color: '333333' }, { pt: 1, color: '333333' }, { pt: 0.5, color: 'CCCCCC' }, { pt: 1, color: '333333' }] } }
        ],
        // Row 3: Sub headers
        [
          { text: '代替品', options: { fontSize: 10, color: '333333', bold: true, align: 'center', border: [{ pt: 1, color: '333333' }, { pt: 1, color: '333333' }, { pt: 0 }, { pt: 1, color: '333333' }] } },
          { text: '主要指標', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center' } },
          { text: 'ハイレベルコンセプト', options: { fontSize: 10, color: '333333', bold: true, align: 'center', border: [{ pt: 1, color: '333333' }, { pt: 1, color: '333333' }, { pt: 0 }, { pt: 1, color: '333333' }] } },
          { text: 'チャネル', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center' } },
          { text: 'アーリーアダプター', options: { fontSize: 10, color: '333333', bold: true, align: 'center', border: [{ pt: 1, color: '333333' }, { pt: 1, color: '333333' }, { pt: 0 }, { pt: 1, color: '333333' }] } }
        ],
        // Row 4: Content bottom
        [
          { text: canvasData.existingAlternatives || '', options: { fontSize: calculateFontSize(canvasData.existingAlternatives), valign: 'top' } },
          { text: canvasData.keyMetrics || '', options: { fontSize: calculateFontSize(canvasData.keyMetrics), valign: 'top' } },
          { text: canvasData.highLevelConcept || '', options: { fontSize: calculateFontSize(canvasData.highLevelConcept), valign: 'top', fill: 'FFF4E6' } },
          { text: canvasData.channels || '', options: { fontSize: calculateFontSize(canvasData.channels), valign: 'top' } },
          { text: canvasData.earlyAdopters || '', options: { fontSize: calculateFontSize(canvasData.earlyAdopters), valign: 'top' } }
        ],
        // Row 5: Bottom section headers
        [
          { text: 'コスト構造', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center', colspan: 3 } },
          { text: '収益の流れ', options: { fill: 'E8F4F8', bold: true, fontSize: 10, align: 'center', colspan: 2 } }
        ],
        // Row 6: Bottom section content
        [
          { text: canvasData.costStructure || '', options: { fontSize: calculateFontSize(canvasData.costStructure), valign: 'top', colspan: 3 } },
          { text: canvasData.revenueStreams || '', options: { fontSize: calculateFontSize(canvasData.revenueStreams), valign: 'top', colspan: 2 } }
        ]
      ]

      slide.addTable(rows, {
        x: 0.5,
        y: 1,
        w: 9,
        h: 4.5,
        border: { pt: 1, color: '333333' },
        colW: [1.8, 1.8, 1.8, 1.8, 1.8],
        rowH: [0.25, 0.8, 0.25, 0.8, 0.25, 0.8] // Minimal heights for header rows (0, 2, 4), auto for content
      })

      // ファイル名を生成
      const filename = canvasData.productName.trim()
        ? `${canvasData.productName.trim()}.pptx`
        : 'leancanvas.pptx'

      pptx.writeFile({ fileName: filename })
    } catch (error) {
      console.error('PowerPoint保存エラー:', error)
      alert('PowerPoint保存に失敗しました')
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
            placeholder="ビジネスやプロダクトを入力"
          />
        </div>
        <div className="buttons">
          <input
            id="import-file"
            type="file"
            accept=".md,.markdown"
            onChange={handleImportMarkdown}
            style={{ display: 'none' }}
          />

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="btn btn-file-menu">
                ファイル ▼
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="dropdown-menu" sideOffset={5}>
                <DropdownMenu.Item className="menu-item" onSelect={() => {
                  document.getElementById('import-file').click()
                }}>
                  インポート
                </DropdownMenu.Item>

                <DropdownMenu.Item className="menu-item" onSelect={handleExportMarkdown}>
                  エクスポート
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="menu-divider" />

                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger className="menu-item submenu-parent">
                    保存 ▶
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.SubContent className="submenu" sideOffset={2} alignOffset={-5}>
                      <DropdownMenu.Item className="menu-item" onSelect={handleExportPNG}>
                        PNG保存
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="menu-item" onSelect={handleExportPptx}>
                        スライド保存
                      </DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Portal>
                </DropdownMenu.Sub>

                <DropdownMenu.Separator className="menu-divider" />

                <DropdownMenu.Item className="menu-item" onSelect={handlePrint}>
                  印刷
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <button onClick={handleClear} className="btn btn-clear">クリア</button>
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
