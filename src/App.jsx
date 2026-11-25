import React, { useState, useEffect } from 'react'
import { Container, Navbar, Nav, Button, Card, Row, Col, Modal, ProgressBar, Form, Badge, Tabs, Tab } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { levels, modules, plan30, promptTemplates } from './data'
import { FiCheckCircle, FiCircle, FiZap, FiTrendingUp, FiBookOpen, FiTool, FiDollarSign, FiTarget, FiCopy, FiRefreshCw } from 'react-icons/fi'

const STORAGE_KEY = 'ia-monetiza-progress-v3'

export default function App() {
  const [activeSection, setActiveSection] = useState('inicio')
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { modules: [], plan: [] }
    } catch {
      return { modules: [], plan: [] }
    }
  })
  const [selectedModule, setSelectedModule] = useState(null)
  const [showModuleModal, setShowModuleModal] = useState(false)
  const [promptType, setPromptType] = useState('freelance')
  const [niche, setNiche] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  }, [completed])

  const totalModules = modules.length
  const completedCount = completed.modules.length
  const progressPercent = Math.round((completedCount / totalModules) * 100)

  const toggleModule = (id) => {
    setCompleted(prev => {
      const exists = prev.modules.includes(id)
      return {
        ...prev,
        modules: exists ? prev.modules.filter(m => m !== id) : [...prev.modules, id]
      }
    })
  }

  const togglePlanDay = (day) => {
    setCompleted(prev => {
      const exists = prev.plan.includes(day)
      return {
        ...prev,
        plan: exists ? prev.plan.filter(d => d !== day) : [...prev.plan, day]
      }
    })
  }

  const openModule = (mod) => {
    setSelectedModule(mod)
    setShowModuleModal(true)
  }

  const generatePrompt = () => {
    if (!niche.trim()) {
      setGeneratedPrompt('Escribe un nicho primero (ej: clínicas dentales, fitness, finanzas personales...)')
      return
    }
    const template = promptTemplates[promptType]
    setGeneratedPrompt(template(niche.trim()))
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetProgress = () => {
    if (window.confirm('¿Seguro que quieres reiniciar todo tu progreso?')) {
      setCompleted({ modules: [], plan: [] })
    }
  }

  const scrollTo = (id) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-vh-100">
      {/* Navbar */}
      <Navbar expand="lg" className="glass sticky-top py-3" variant="dark">
        <Container>
          <Navbar.Brand className="brand d-flex align-items-center gap-2 fw-bold">
            <span style={{ color: '#8b5cf6' }}>◈</span> IA Monetiza
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto gap-1">
              {['inicio', 'ruta', 'modulos', 'herramientas', 'progreso', 'ia-helper', 'finanzas'].map(s => (
                <Nav.Link
                  key={s}
                  onClick={() => scrollTo(s)}
                  className={activeSection === s ? 'text-white fw-semibold' : 'text-secondary'}
                  style={{ cursor: 'pointer' }}
                >
                  {s === 'inicio' && 'Inicio'}
                  {s === 'ruta' && 'Ruta'}
                  {s === 'modulos' && 'Módulos'}
                  {s === 'herramientas' && 'Herramientas'}
                  {s === 'progreso' && 'Progreso'}
                  {s === 'ia-helper' && 'IA Helper'}
                  {s === 'finanzas' && 'Finanzas'}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero */}
      <section id="inicio" className="section-pad">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Badge bg="dark" className="mb-3 px-3 py-2" style={{ border: '1px solid rgba(139,92,246,0.4)' }}>
                  Curso Interactivo Premium · 2026
                </Badge>
                <h1 className="display-4 fw-bold mb-3">
                  Domina la IA y<br />
                  <span className="gradient-text">Monetiza Contenido</span>
                </h1>
                <p className="lead text-secondary mb-4" style={{ maxWidth: 540 }}>
                  Ruta clara, realista y accionable. Desde $0 hasta inversiones seguras.
                  Con seguimiento de aprendizaje, generador de prompts y métodos actualizados.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Button size="lg" onClick={() => scrollTo('ruta')}>Empezar ahora →</Button>
                  <Button size="lg" variant="outline-light" onClick={() => scrollTo('progreso')}>Ver mi progreso</Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={5} className="mt-5 mt-lg-0">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <Card className="p-4 hover-lift">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-secondary small">Tu progreso actual</span>
                    <span className="fw-bold">{progressPercent}%</span>
                  </div>
                  <ProgressBar now={progressPercent} className="mb-3" />
                  <div className="d-flex justify-content-between small text-secondary">
                    <span>{completedCount} / {totalModules} módulos</span>
                    <span>{completed.plan.length} / 30 días</span>
                  </div>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Ruta */}
      <section id="ruta" className="section-pad" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Tu Ruta de Monetización</h2>
            <p className="text-secondary">Elige según tu tiempo y capital. Todos empiezan gratis.</p>
          </div>
          <Row className="g-4">
            {levels.map((lvl, i) => (
              <Col key={lvl.id} md={6} lg={3}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                  <Card className="h-100 p-4 hover-lift">
                    <span className={`badge-level ${lvl.color} mb-3 d-inline-block`}>{lvl.subtitle}</span>
                    <h4 className="fw-bold">{lvl.title}</h4>
                    <div className="text-secondary small mb-2">{lvl.time} · {lvl.dedication}</div>
                    <p className="small text-secondary mb-3">{lvl.description}</p>
                    <ul className="small mb-4">
                      {lvl.items.map(item => <li key={item}>{item}</li>)}
                    </ul>
                    <Button variant="outline-light" size="sm" className="mt-auto" onClick={() => scrollTo('modulos')}>
                      Ver módulos
                    </Button>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Módulos */}
      <section id="modulos" className="section-pad">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Módulos del Curso</h2>
            <p className="text-secondary">Haz clic para abrir el contenido. Marca como completado para guardar tu progreso.</p>
          </div>
          <Row className="g-4">
            {modules.map((mod, i) => {
              const isDone = completed.modules.includes(mod.id)
              return (
                <Col key={mod.id} md={6} lg={4}>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                    <Card className="h-100 p-4 hover-lift" style={{ cursor: 'pointer', borderColor: isDone ? 'rgba(16,185,129,0.4)' : undefined }} onClick={() => openModule(mod)}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className={`badge-level level-${mod.level}`}>Nivel {mod.level}</span>
                        <button
                          className="btn btn-link p-0 text-decoration-none"
                          onClick={(e) => { e.stopPropagation(); toggleModule(mod.id) }}
                          title={isDone ? 'Marcar como pendiente' : 'Marcar como completado'}
                        >
                          {isDone ? <FiCheckCircle size={22} color="#10b981" /> : <FiCircle size={22} color="#555" />}
                        </button>
                      </div>
                      <h5 className="fw-bold">{mod.title}</h5>
                      <p className="small text-secondary mb-2">{mod.description}</p>
                      <div className="small text-muted">{mod.time}</div>
                    </Card>
                  </motion.div>
                </Col>
              )
            })}
          </Row>
        </Container>
      </section>

      {/* Module Modal */}
      <Modal show={showModuleModal} onHide={() => setShowModuleModal(false)} size="lg" centered>
        {selectedModule && (
          <>
            <Modal.Header closeButton closeVariant="white">
              <Modal.Title>
                <span className={`badge-level level-${selectedModule.level} me-2`}>Nivel {selectedModule.level}</span>
                {selectedModule.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div dangerouslySetInnerHTML={{ __html: selectedModule.content }} />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant={completed.modules.includes(selectedModule.id) ? 'success' : 'primary'}
                onClick={() => {
                  toggleModule(selectedModule.id)
                  setShowModuleModal(false)
                }}
              >
                {completed.modules.includes(selectedModule.id) ? '✓ Completado' : 'Marcar como completado'}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Herramientas */}
      <section id="herramientas" className="section-pad" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Stack de Herramientas 2026</h2>
            <p className="text-secondary">Gratis primero. Paga solo cuando generes ingresos.</p>
          </div>
          <Row className="g-4">
            {[
              { icon: '✍️', title: 'Texto & Investigación', tools: 'ChatGPT · Claude · Gemini · Perplexity', badge: 'Free + Pro' },
              { icon: '🎨', title: 'Imágenes', tools: 'Canva AI · Leonardo · Ideogram · Flux', badge: 'Free + Pro' },
              { icon: '🎬', title: 'Video', tools: 'CapCut · Opus Clip · Runway · Kling', badge: 'Free + Pro' },
              { icon: '🔊', title: 'Voz', tools: 'ElevenLabs · Google TTS · OpenAI TTS', badge: 'Créditos' },
              { icon: '⚙️', title: 'Automatización', tools: 'n8n · Make · Zapier · Cursor', badge: 'Free tier' },
              { icon: '📦', title: 'Venta', tools: 'Gumroad · Payhip · Lemon Squeezy · Fiverr', badge: 'Free' },
            ].map((t, i) => (
              <Col key={i} md={6} lg={4}>
                <Card className="p-4 h-100 hover-lift">
                  <div className="fs-2 mb-2">{t.icon}</div>
                  <h5 className="fw-bold">{t.title}</h5>
                  <p className="small text-secondary mb-3">{t.tools}</p>
                  <Badge bg="dark" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>{t.badge}</Badge>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Progreso */}
      <section id="progreso" className="section-pad">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Tu Progreso</h2>
            <p className="text-secondary">Se guarda automáticamente en este navegador.</p>
          </div>
          <Card className="p-4 mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
              <div>
                <h5 className="mb-1">{progressPercent}% completado</h5>
                <div className="small text-secondary">{completedCount} de {totalModules} módulos · {completed.plan.length} de 30 días del plan</div>
              </div>
              <Button variant="outline-light" size="sm" onClick={resetProgress}>
                <FiRefreshCw className="me-1" /> Reiniciar
              </Button>
            </div>
            <ProgressBar now={progressPercent} style={{ height: 14 }} />
          </Card>

          <h5 className="mb-3">Plan de 30 Días</h5>
          <Row className="g-2">
            {plan30.map(item => {
              const done = completed.plan.includes(item.day)
              return (
                <Col key={item.day} xs={12} md={6} lg={4}>
                  <div
                    className="d-flex align-items-start gap-2 p-3 rounded-3"
                    style={{
                      background: done ? 'rgba(16,185,129,0.08)' : 'var(--bg-card)',
                      border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                      cursor: 'pointer'
                    }}
                    onClick={() => togglePlanDay(item.day)}
                  >
                    {done ? <FiCheckCircle color="#10b981" size={18} className="mt-1 flex-shrink-0" /> : <FiCircle color="#555" size={18} className="mt-1 flex-shrink-0" />}
                    <div>
                      <div className="small fw-semibold">Día {item.day}</div>
                      <div className="small text-secondary">{item.task}</div>
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
        </Container>
      </section>

      {/* IA Helper */}
      <section id="ia-helper" className="section-pad" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">IA Helper · Generador de Prompts</h2>
            <p className="text-secondary">Prompts profesionales listos para copiar y usar.</p>
          </div>
          <Card className="p-4">
            <Row className="g-3 mb-4">
              <Col md={4}>
                <Form.Select value={promptType} onChange={e => setPromptType(e.target.value)}>
                  <option value="freelance">Servicio freelance</option>
                  <option value="digital">Producto digital</option>
                  <option value="faceless">Script video faceless</option>
                  <option value="social">Posts redes sociales</option>
                  <option value="promptpack">Pack de prompts para vender</option>
                </Form.Select>
              </Col>
              <Col md={5}>
                <Form.Control
                  type="text"
                  placeholder="Nicho (ej: clínicas dentales, fitness, finanzas...)"
                  value={niche}
                  onChange={e => setNiche(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Button className="w-100" onClick={generatePrompt}>
                  <FiZap className="me-1" /> Generar
                </Button>
              </Col>
            </Row>

            {generatedPrompt && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="p-3 rounded-3 mb-3" style={{ background: 'var(--bg)', border: '1px solid var(--border)', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {generatedPrompt}
                </div>
                <Button variant="outline-light" onClick={copyPrompt}>
                  <FiCopy className="me-1" /> {copied ? '¡Copiado!' : 'Copiar prompt'}
                </Button>
              </motion.div>
            )}
          </Card>
        </Container>
      </section>

      {/* Finanzas */}
      <section id="finanzas" className="section-pad">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Finanzas & Inversión</h2>
            <p className="text-secondary">Opciones realistas ordenadas por nivel de riesgo.</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <Card className="p-4 h-100">
                <div className="text-success mb-2"><FiDollarSign size={28} /></div>
                <h5 className="fw-bold">Bajo riesgo</h5>
                <ul className="small text-secondary">
                  <li>ETFs de tecnología (QQQ, VGT)</li>
                  <li>ETFs temáticos de IA (BOTZ, IRBO)</li>
                  <li>Fondos indexados globales</li>
                </ul>
                <p className="small mt-auto">Mejor opción para la mayoría. Diversificado y de largo plazo.</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-4 h-100">
                <div className="text-warning mb-2"><FiTrendingUp size={28} /></div>
                <h5 className="fw-bold">Riesgo medio</h5>
                <ul className="small text-secondary">
                  <li>Acciones individuales (NVDA, MSFT, GOOGL)</li>
                  <li>Empresas de software e infraestructura</li>
                  <li>Pequeña posición en cloud / data centers</li>
                </ul>
                <p className="small mt-auto">Solo con capital que no necesites a corto plazo.</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-4 h-100">
                <div className="text-danger mb-2"><FiTarget size={28} /></div>
                <h5 className="fw-bold">Alto riesgo / No recomendado al inicio</h5>
                <ul className="small text-secondary">
                  <li>Criptomonedas especulativas</li>
                  <li>Startups privadas sin liquidez</li>
                  <li>Apalancamiento o trading diario</li>
                </ul>
                <p className="small mt-auto text-warning">Evita esto hasta tener ingresos estables y experiencia.</p>
              </Card>
            </Col>
          </Row>
          <Card className="p-4 mt-4" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
            <p className="mb-0 small">
              <strong>Aviso importante:</strong> Esto no es consejo financiero personalizado.
              Invierte solo dinero que puedas permitirte perder. La mejor inversión al principio es en ti mismo (habilidades + tiempo).
            </p>
          </Card>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-5 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <Container>
          <p className="mb-1">Curso creado para uso personal · Actualizado Nov 2026</p>
          <p className="small text-secondary mb-3">La constancia gana. No es consejo financiero.</p>
          <a href="https://github.com/Dark-GC/curso-ia-monetizacion-premium" target="_blank" rel="noreferrer" className="text-secondary small">
            Ver código en GitHub
          </a>
        </Container>
      </footer>
    </div>
  )
}