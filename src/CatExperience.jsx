import { useEffect, useRef, useState } from 'react'
import './CatExperience.css'
import { sitePath } from './sitePath'

const CAT_VIDEO = `${sitePath('cat-media/idle-cat.mp4')}?v=2`
const SALMON = sitePath('cat-media/salmon-cursor.png')
const FRAME_COUNT = 17
const CENTER_FRAME = 8
const MOVE_SETTLE_MS = 130
const IDLE_AFTER_MS = 1500
const IDLE_FACE = sitePath('cat-media/gaze/frame-08.webp')
const DISH_APPEAR_DELAY = 1500
const DISHES = [
  { label: '套图', href: sitePath('gallery/index.html') },
  { label: '渲染图', href: sitePath('renders/index.html') },
  { label: 'AI视频', href: sitePath('ai-video/index.html') },
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function App({ onReady }) {
  const stageRef = useRef(null)
  const videoRef = useRef(null)
  const gazeRef = useRef(null)
  const salmonRef = useRef(null)
  const dishRefs = useRef([])
  const [dishesVisible, setDishesVisible] = useState(false)

  useEffect(() => {
    const stage = stageRef.current
    const video = videoRef.current
    const gaze = gazeRef.current
    const salmon = salmonRef.current
    if (!stage || !video || !gaze || !salmon) return undefined

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = matchMedia('(pointer: coarse)').matches
    const state = {
      fishX: innerWidth / 2, fishY: innerHeight / 2,
      fishTargetX: innerWidth / 2, fishTargetY: innerHeight / 2,
      gaze: 0, gazeVelocity: 0, gazeTarget: 0,
      speed: 0, speedTarget: 0, tilt: 0, tiltTarget: 0,
      moving: false,
      pointerActive: false,
      activeDish: -1,
      dropDish: -1,
      dropStartedAt: 0,
      dropUntil: 0,
      dishCooldowns: Array(DISHES.length).fill(0),
      dishMetrics: [],
      dishProximity: Array(DISHES.length).fill(-1),
      lastX: innerWidth / 2, lastY: innerHeight / 2, lastTime: performance.now(),
    }
    let animationFrame = 0
    let previousTime = performance.now()
    let currentFrame = CENTER_FRAME
    let movementTimer = 0
    let touchTimer = 0
    let idleTransitionTimer = 0
    let geometryFrame = 0
    let dishGeometryTimer = 0
    const dishTimer = setTimeout(() => setDishesVisible(true), reducedMotion ? 0 : DISH_APPEAR_DELAY)
    const dishTray = stage.querySelector('.dish-tray')

    const gazeFrames = Array.from({ length: FRAME_COUNT }, (_, index) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = sitePath(`cat-media/gaze/frame-${String(index).padStart(2, '0')}.webp`)
      return image
    })

    const clearIdleTransition = () => {
      clearTimeout(idleTransitionTimer)
      stage.classList.remove('is-idle')
    }

    const clearDishFeedback = () => {
      state.activeDish = -1
      state.dropDish = -1
      dishRefs.current.forEach((dish) => {
        dish?.classList.remove('is-near', 'is-dropping')
        dish?.style.setProperty('--proximity', '0')
      })
    }

    // Reading element bounds during every animation frame forces layout work just
    // when the pointer is moving. The tray is stationary after it arrives, so keep
    // its hit areas cached and update them only after a layout change.
    const refreshDishMetrics = () => {
      geometryFrame = 0
      state.dishMetrics = dishRefs.current.map((dish) => {
        if (!dish) return null
        const rect = dish.getBoundingClientRect()
        return {
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          radius: Math.max(rect.width, rect.height) * 0.54,
        }
      })
    }

    const scheduleDishMetricRefresh = () => {
      if (!geometryFrame) geometryFrame = requestAnimationFrame(refreshDishMetrics)
    }

    const resizeObserver = new ResizeObserver(scheduleDishMetricRefresh)
    resizeObserver.observe(stage)

    const showIdleFace = () => {
      currentFrame = CENTER_FRAME
      gaze.src = IDLE_FACE
    }

    const stopTracking = () => {
      state.moving = false
      stage.classList.remove('is-tracking')
      idleTransitionTimer = setTimeout(() => {
        if (state.moving) return
        stage.classList.add('is-idle')
      }, IDLE_AFTER_MS)
    }

    const settle = () => {
      clearTimeout(movementTimer)
      state.moving = false
      state.gazeTarget = 0
      state.speedTarget = 0
      state.tiltTarget = 0
      state.pointerActive = false
      clearDishFeedback()
      salmon.classList.remove('is-visible')
      stage.classList.remove('has-pointer', 'is-tracking')
      clearIdleTransition()
      showIdleFace()
      stage.classList.add('is-idle')
    }

    const followPointer = (event) => {
      const wasPointerActive = state.pointerActive
      const now = performance.now()
      const elapsed = Math.max(8, now - state.lastTime)
      const dx = event.clientX - state.lastX
      const dy = event.clientY - state.lastY
      state.fishTargetX = event.clientX
      state.fishTargetY = event.clientY
      state.gazeTarget = clamp((event.clientX / innerWidth - 0.5) / 0.37, -1, 1)
      state.speedTarget = clamp(Math.hypot(dx, dy) / elapsed / 1.5, 0, 1)
      state.tiltTarget = clamp((dx / elapsed) * 7.2, -15, 15)
      state.lastX = event.clientX
      state.lastY = event.clientY
      state.lastTime = now
      clearTimeout(touchTimer)
      clearTimeout(movementTimer)
      clearIdleTransition()
      state.moving = true
      state.pointerActive = true
      if (!wasPointerActive) {
        stage.classList.add('has-pointer', 'is-tracking')
        salmon.classList.add('is-visible')
      }
      movementTimer = setTimeout(stopTracking, MOVE_SETTLE_MS)
    }

    const updateDishes = (time) => {
      const dishes = dishRefs.current
      const trayIsVisible = dishTray?.classList.contains('is-visible')
      if (!state.pointerActive || !trayIsVisible || dishes.length === 0) return { offsetX: 0, offsetY: 0 }
      if (state.dishMetrics.length !== dishes.length) refreshDishMetrics()

      let closest = -1
      let closestDistance = Infinity
      let closestCenterX = 0
      let closestCenterY = 0
      let closestRadius = 1

      dishes.forEach((dish, index) => {
        const metric = state.dishMetrics[index]
        if (!metric) return
        const { centerX, centerY, radius } = metric
        const distance = Math.hypot(state.fishX - centerX, state.fishY - centerY)
        const proximity = clamp(1 - distance / (radius * 1.85), 0, 1)
        if (Math.abs(proximity - state.dishProximity[index]) > 0.012) {
          state.dishProximity[index] = proximity
          dish.style.setProperty('--proximity', proximity.toFixed(3))
        }
        dish.classList.toggle('is-near', proximity > 0.04)

        if (distance < closestDistance) {
          closest = index
          closestDistance = distance
          closestCenterX = centerX
          closestCenterY = centerY
          closestRadius = radius
        }
      })

      state.activeDish = closestDistance < closestRadius * 1.85 ? closest : -1
      if (state.dropDish === -1 && closest !== -1 && closestDistance < closestRadius * 0.38 && time > state.dishCooldowns[closest]) {
        state.dropDish = closest
        state.dropStartedAt = time
        state.dropUntil = time + 540
        state.dishCooldowns[closest] = time + 1350
        dishes[closest]?.classList.add('is-dropping')
      }

      if (state.dropDish !== -1) {
        const droppingDish = dishes[state.dropDish]
        if (!droppingDish || time >= state.dropUntil) {
          droppingDish?.classList.remove('is-dropping')
          state.dropDish = -1
          return { offsetX: 0, offsetY: 0 }
        }
        const metric = state.dishMetrics[state.dropDish]
        if (!metric) return { offsetX: 0, offsetY: 0 }
        const { centerX, centerY } = metric
        const progress = clamp((time - state.dropStartedAt) / 540, 0, 1)
        const pull = Math.sin(progress * Math.PI) * 0.92
        return { offsetX: (centerX - state.fishX) * pull, offsetY: (centerY - state.fishY) * pull }
      }

      if (state.activeDish === -1) return { offsetX: 0, offsetY: 0 }
      const attraction = clamp(1 - closestDistance / (closestRadius * 1.85), 0, 1) ** 2 * 0.14
      return { offsetX: (closestCenterX - state.fishX) * attraction, offsetY: (closestCenterY - state.fishY) * attraction }
    }

    const render = (time) => {
      const delta = Math.min(0.035, Math.max(0.001, (time - previousTime) / 1000))
      previousTime = time
      const fishEase = reducedMotion ? 1 : 1 - Math.exp(-28 * delta)
      state.fishX += (state.fishTargetX - state.fishX) * fishEase
      state.fishY += (state.fishTargetY - state.fishY) * fishEase
      state.speed += (state.speedTarget - state.speed) * (1 - Math.exp(-16 * delta))
      state.tilt += (state.tiltTarget - state.tilt) * (1 - Math.exp(-18 * delta))
      state.speedTarget *= Math.pow(0.05, delta)
      state.tiltTarget *= Math.pow(0.03, delta)
      if (!reducedMotion) {
        state.gazeVelocity += (state.gazeTarget - state.gaze) * 310 * delta
        state.gazeVelocity *= Math.exp(-30 * delta)
        state.gaze = clamp(state.gaze + state.gazeVelocity * delta, -1, 1)
      }
      const nextFrame = clamp(Math.round(((state.gaze + 1) * 0.5) * (FRAME_COUNT - 1)), 0, FRAME_COUNT - 1)
      if (state.moving && nextFrame !== currentFrame) {
        currentFrame = nextFrame
        gaze.src = gazeFrames[nextFrame].src
      }
      const dishOffset = reducedMotion ? { offsetX: 0, offsetY: 0 } : updateDishes(time)
      const stretch = 1 + state.speed * 0.1
      const squash = 1 - state.speed * 0.04
      salmon.style.transform = `translate3d(${state.fishX + dishOffset.offsetX}px, ${state.fishY + dishOffset.offsetY}px, 0) translate(-49%, -52%) rotate(${state.tilt}deg) scale(${stretch}, ${squash})`
      animationFrame = requestAnimationFrame(render)
    }

    const onPointerDown = (event) => {
      followPointer(event)
      if (coarsePointer && stage.setPointerCapture) stage.setPointerCapture(event.pointerId)
    }
    const onPointerLeave = () => { if (!coarsePointer) settle() }
    const onPointerUp = () => { if (coarsePointer) touchTimer = setTimeout(settle, 650) }

    stage.addEventListener('pointermove', followPointer, { passive: true })
    stage.addEventListener('pointerdown', onPointerDown, { passive: true })
    stage.addEventListener('pointerleave', onPointerLeave, { passive: true })
    stage.addEventListener('pointerup', onPointerUp, { passive: true })
    stage.addEventListener('pointercancel', onPointerUp, { passive: true })
    addEventListener('blur', settle)
    dishGeometryTimer = setTimeout(scheduleDishMetricRefresh, DISH_APPEAR_DELAY + 1700)
    video.play().catch(() => {})
    stage.classList.add('is-idle')
    animationFrame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(movementTimer)
      clearTimeout(touchTimer)
      clearTimeout(dishTimer)
      clearTimeout(dishGeometryTimer)
      clearIdleTransition()
      cancelAnimationFrame(geometryFrame)
      resizeObserver.disconnect()
      clearDishFeedback()
      gazeFrames.forEach((image) => { image.src = '' })
      stage.removeEventListener('pointermove', followPointer)
      stage.removeEventListener('pointerdown', onPointerDown)
      stage.removeEventListener('pointerleave', onPointerLeave)
      stage.removeEventListener('pointerup', onPointerUp)
      stage.removeEventListener('pointercancel', onPointerUp)
      removeEventListener('blur', settle)
    }
  }, [])

  return (
    <main className="cat-experience" ref={stageRef} aria-label="蓝猫会追随三文鱼的眼睛">
      <video className="cat-video" ref={videoRef} src={CAT_VIDEO} poster={sitePath('cat-media/cat-poster.webp')} onLoadedData={onReady} autoPlay muted loop playsInline preload="auto" aria-label="会眨眼的蓝猫" />
      <img className="cat-gaze" ref={gazeRef} src={IDLE_FACE} alt="" aria-hidden="true" draggable="false" />
      <div className="cinematic-vignette" aria-hidden="true" />
      <section className={`dish-tray${dishesVisible ? ' is-visible' : ''}`} aria-label="猫咪的点餐盘">
        {DISHES.map(({ label, href }, index) => (
          <a
            className="dish"
            key={label}
            href={href}
            ref={(element) => { dishRefs.current[index] = element }}
            style={{
              '--delay': `${index * 115}ms`,
              '--air-lift': `${112 + (index % 3) * 28}px`,
            }}
            aria-label={label}
          >
            <img className="dish-plate" src={`${sitePath('cat-media/ceramic-plate.png')}?v=round-user-source-3`} alt="" aria-hidden="true" draggable="false" />
            <span className="dish-label">{label}</span>
          </a>
        ))}
      </section>
      <img className="salmon-cursor" ref={salmonRef} src={SALMON} alt="" aria-hidden="true" draggable="false" />
    </main>
  )
}

export default App
