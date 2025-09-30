import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'resume-data-v1'

const createEmptyResume = () => ({
  basics: {
    name: '',
    title: '',
    email: '',
    phone: '',
    website: '',
    location: '',
  },
  summary: '',
  experience: [
    {
      id: crypto.randomUUID(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      location: '',
      highlights: [''],
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      location: '',
      details: [''],
    },
  ],
  skills: [''],
})

function useLocalStorageState(key, initialValue) {
  const read = () => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch (_) {
      return initialValue
    }
  }
  const [state, setState] = useState(read)
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (_) {
      // ignore
    }
  }, [key, state])
  return [state, setState]
}

function App() {
  const [resume, setResume] = useLocalStorageState(STORAGE_KEY, createEmptyResume())

  const handleBasicsChange = (field, value) => {
    setResume(prev => ({ ...prev, basics: { ...prev.basics, [field]: value } }))
  }

  const handleSummaryChange = (value) => {
    setResume(prev => ({ ...prev, summary: value }))
  }

  const updateListItem = (section, id, field, value) => {
    setResume(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
    }))
  }

  const updateStringArrayItem = (section, index, value) => {
    setResume(prev => ({
      ...prev,
      [section]: prev[section].map((v, i) => i === index ? value : v)
    }))
  }

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: crypto.randomUUID(), company: '', role: '', startDate: '', endDate: '', location: '', highlights: [''] }
      ],
    }))
  }

  const removeExperience = (id) => {
    setResume(prev => ({ ...prev, experience: prev.experience.filter(item => item.id !== id) }))
  }

  const addExperienceHighlight = (id) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, highlights: [...item.highlights, ''] } : item)
    }))
  }

  const updateExperienceHighlight = (id, index, value) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, highlights: item.highlights.map((h, i) => i === index ? value : h) } : item)
    }))
  }

  const removeExperienceHighlight = (id, index) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, highlights: item.highlights.filter((_, i) => i !== index) } : item)
    }))
  }

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: crypto.randomUUID(), institution: '', degree: '', startDate: '', endDate: '', location: '', details: [''] }
      ],
    }))
  }

  const removeEducation = (id) => {
    setResume(prev => ({ ...prev, education: prev.education.filter(item => item.id !== id) }))
  }

  const addEducationDetail = (id) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, details: [...item.details, ''] } : item)
    }))
  }

  const updateEducationDetail = (id, index, value) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, details: item.details.map((d, i) => i === index ? value : d) } : item)
    }))
  }

  const removeEducationDetail = (id, index) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, details: item.details.filter((_, i) => i !== index) } : item)
    }))
  }

  const addSkill = () => {
    setResume(prev => ({ ...prev, skills: [...prev.skills, ''] }))
  }

  const removeSkill = (index) => {
    setResume(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }))
  }

  const handleReset = () => {
    setResume(createEmptyResume())
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (file) => {
    const text = await file.text()
    try {
      const data = JSON.parse(text)
      setResume(prev => ({ ...prev, ...data }))
    } catch (_) {
      alert('Invalid JSON file')
    }
  }

  const printResume = () => {
    window.print()
  }

  const hasContent = useMemo(() => {
    return JSON.stringify(resume) !== JSON.stringify(createEmptyResume())
  }, [resume])

  return (
    <div className="app">
      <header className="app__header">
        <h1>個人簡歷編輯器</h1>
        <div className="actions">
          <button onClick={addExperience}>新增經歷</button>
          <button onClick={addEducation}>新增學歷</button>
          <button onClick={addSkill}>新增技能</button>
          <label className="import">
            匯入JSON
            <input type="file" accept="application/json" onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])} />
          </label>
          <button onClick={handleExport} disabled={!hasContent}>匯出JSON</button>
          <button onClick={printResume}>列印/匯出PDF</button>
          <button onClick={handleReset}>重置</button>
        </div>
      </header>

      <main className="grid">
        <section className="editor">
          <h2>編輯</h2>
          <div className="section">
            <h3>基本資訊</h3>
            <div className="fields">
              <input placeholder="姓名" value={resume.basics.name} onChange={(e) => handleBasicsChange('name', e.target.value)} />
              <input placeholder="職稱" value={resume.basics.title} onChange={(e) => handleBasicsChange('title', e.target.value)} />
              <input placeholder="Email" value={resume.basics.email} onChange={(e) => handleBasicsChange('email', e.target.value)} />
              <input placeholder="電話" value={resume.basics.phone} onChange={(e) => handleBasicsChange('phone', e.target.value)} />
              <input placeholder="網站/LinkedIn" value={resume.basics.website} onChange={(e) => handleBasicsChange('website', e.target.value)} />
              <input placeholder="所在地" value={resume.basics.location} onChange={(e) => handleBasicsChange('location', e.target.value)} />
            </div>
          </div>

          <div className="section">
            <h3>自我介紹</h3>
            <textarea rows={5} placeholder="簡短介紹你自己..." value={resume.summary} onChange={(e) => handleSummaryChange(e.target.value)} />
          </div>

          <div className="section">
            <h3>工作經歷</h3>
            {resume.experience.map(exp => (
              <div key={exp.id} className="card">
                <div className="row">
                  <input placeholder="公司" value={exp.company} onChange={(e) => updateListItem('experience', exp.id, 'company', e.target.value)} />
                  <input placeholder="職稱" value={exp.role} onChange={(e) => updateListItem('experience', exp.id, 'role', e.target.value)} />
                </div>
                <div className="row">
                  <input placeholder="起始 (YYYY-MM)" value={exp.startDate} onChange={(e) => updateListItem('experience', exp.id, 'startDate', e.target.value)} />
                  <input placeholder="結束 (YYYY-MM/至今)" value={exp.endDate} onChange={(e) => updateListItem('experience', exp.id, 'endDate', e.target.value)} />
                  <input placeholder="地點" value={exp.location} onChange={(e) => updateListItem('experience', exp.id, 'location', e.target.value)} />
                </div>
                <div className="sublist">
                  <div className="sublist__header">
                    <span>亮點/成就</span>
                    <button onClick={() => addExperienceHighlight(exp.id)}>新增亮點</button>
                  </div>
                  {exp.highlights.map((h, i) => (
                    <div className="row" key={i}>
                      <input placeholder={`亮點 #${i + 1}`} value={h} onChange={(e) => updateExperienceHighlight(exp.id, i, e.target.value)} />
                      <button onClick={() => removeExperienceHighlight(exp.id, i)}>移除</button>
                    </div>
                  ))}
                </div>
                <div className="row end">
                  <button onClick={() => removeExperience(exp.id)}>刪除這筆經歷</button>
                </div>
              </div>
            ))}
          </div>

          <div className="section">
            <h3>學歷</h3>
            {resume.education.map(ed => (
              <div key={ed.id} className="card">
                <div className="row">
                  <input placeholder="學校" value={ed.institution} onChange={(e) => updateListItem('education', ed.id, 'institution', e.target.value)} />
                  <input placeholder="學位/科系" value={ed.degree} onChange={(e) => updateListItem('education', ed.id, 'degree', e.target.value)} />
                </div>
                <div className="row">
                  <input placeholder="起始 (YYYY-MM)" value={ed.startDate} onChange={(e) => updateListItem('education', ed.id, 'startDate', e.target.value)} />
                  <input placeholder="結束 (YYYY-MM)" value={ed.endDate} onChange={(e) => updateListItem('education', ed.id, 'endDate', e.target.value)} />
                  <input placeholder="地點" value={ed.location} onChange={(e) => updateListItem('education', ed.id, 'location', e.target.value)} />
                </div>
                <div className="sublist">
                  <div className="sublist__header">
                    <span>細節</span>
                    <button onClick={() => addEducationDetail(ed.id)}>新增細節</button>
                  </div>
                  {ed.details.map((d, i) => (
                    <div className="row" key={i}>
                      <input placeholder={`細節 #${i + 1}`} value={d} onChange={(e) => updateEducationDetail(ed.id, i, e.target.value)} />
                      <button onClick={() => removeEducationDetail(ed.id, i)}>移除</button>
                    </div>
                  ))}
                </div>
                <div className="row end">
                  <button onClick={() => removeEducation(ed.id)}>刪除這筆學歷</button>
                </div>
              </div>
            ))}
          </div>

          <div className="section">
            <h3>技能</h3>
            {resume.skills.map((skill, i) => (
              <div className="row" key={i}>
                <input placeholder={`技能 #${i + 1}`} value={skill} onChange={(e) => updateStringArrayItem('skills', i, e.target.value)} />
                <button onClick={() => removeSkill(i)}>移除</button>
              </div>
            ))}
          </div>
        </section>

        <section className="preview">
          <div className="paper" id="resume">
            <header className="paper__header">
              <h1>{resume.basics.name || '你的名字'}</h1>
              <div className="subtitle">{resume.basics.title || '你的職稱'}</div>
              <div className="meta">
                {[resume.basics.email, resume.basics.phone, resume.basics.website, resume.basics.location]
                  .filter(Boolean)
                  .join(' · ')}
              </div>
            </header>
            {resume.summary && (
              <section>
                <h2>自我介紹</h2>
                <p>{resume.summary}</p>
              </section>
            )}
            {resume.experience.filter(e => e.company || e.role || e.highlights.some(Boolean)).length > 0 && (
              <section>
                <h2>工作經歷</h2>
                {resume.experience.map(e => (
                  (e.company || e.role || e.highlights.some(Boolean)) && (
                    <div key={e.id} className="item">
                      <div className="item__header">
                        <div>
                          <div className="item__title">{e.role || '職稱'}</div>
                          <div className="item__org">{e.company}</div>
                        </div>
                        <div className="item__meta">
                          {[e.startDate, e.endDate].filter(Boolean).join(' - ')}{e.location ? ` · ${e.location}` : ''}
                        </div>
                      </div>
                      {e.highlights.filter(Boolean).length > 0 && (
                        <ul>
                          {e.highlights.filter(Boolean).map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                ))}
              </section>
            )}
            {resume.education.filter(e => e.institution || e.degree || e.details.some(Boolean)).length > 0 && (
              <section>
                <h2>學歷</h2>
                {resume.education.map(e => (
                  (e.institution || e.degree || e.details.some(Boolean)) && (
                    <div key={e.id} className="item">
                      <div className="item__header">
                        <div>
                          <div className="item__title">{e.degree || '學位/科系'}</div>
                          <div className="item__org">{e.institution}</div>
                        </div>
                        <div className="item__meta">
                          {[e.startDate, e.endDate].filter(Boolean).join(' - ')}{e.location ? ` · ${e.location}` : ''}
                        </div>
                      </div>
                      {e.details.filter(Boolean).length > 0 && (
                        <ul>
                          {e.details.filter(Boolean).map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                ))}
              </section>
            )}
            {resume.skills.filter(Boolean).length > 0 && (
              <section>
                <h2>技能</h2>
                <p className="skills">
                  {resume.skills.filter(Boolean).join(' · ')}
                </p>
              </section>
            )}
          </div>
          <div className="preview__actions no-print">
            <button onClick={printResume}>列印/匯出PDF</button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
