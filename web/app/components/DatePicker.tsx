import React, { useState, useEffect, useRef } from "react"
import {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion"

const DateTypes = ["Hours", "Days"]

const days = Array.from({ length: 24 }, (_, i) => i + 1)

interface PickerProps {
  items: (string | number)[]
  initialIndex?: number
  onChange: (value: string | number) => void
}

const Picker: React.FC<PickerProps> = ({
  items,
  initialIndex = 0,
  onChange,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)
  const pickerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number | null>(null)
  const startIndexRef = useRef<number>(selectedIndex)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    const picker = pickerRef.current
    if (!picker) return

    const handleStart = (clientY: number) => {
      startYRef.current = clientY
      startIndexRef.current = selectedIndex
      isDraggingRef.current = true
    }

    const handleMove = (clientY: number) => {
      if (startYRef.current === null || !isDraggingRef.current) return
      const deltaY = clientY - startYRef.current
      const deltaIndex = deltaY / 40
      let newIndex = startIndexRef.current - deltaIndex
      newIndex = Math.max(0, Math.min(newIndex, items.length - 1))
      setSelectedIndex(Math.round(newIndex))
    }

    const handleEnd = () => {
      if (!isDraggingRef.current) return
      startYRef.current = null
      isDraggingRef.current = false
      onChange(items[selectedIndex])
    }

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      handleStart(e.touches[0].clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      handleMove(e.touches[0].clientY)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      handleEnd()
    }

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleStart(e.clientY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      e.preventDefault()
      handleMove(e.clientY)
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      handleEnd()
    }

    const handleMouseLeave = () => {
      if (isDraggingRef.current) {
        handleEnd()
      }
    }

    picker.addEventListener("touchstart", handleTouchStart, { passive: false })
    picker.addEventListener("touchmove", handleTouchMove, { passive: false })
    picker.addEventListener("touchend", handleTouchEnd, { passive: false })
    picker.addEventListener("mousedown", handleMouseDown, { capture: true })
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    picker.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      picker.removeEventListener("touchstart", handleTouchStart)
      picker.removeEventListener("touchmove", handleTouchMove)
      picker.removeEventListener("touchend", handleTouchEnd)
      picker.removeEventListener("mousedown", handleMouseDown, {
        capture: true,
      })
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      picker.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [selectedIndex, items, onChange])

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="relative h-[200px] overflow-hidden" ref={pickerRef}>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-10 -mt-5 bg-gray-200"></div>
        </div>
        <div
          className="absolute top-0 left-0 w-full transition-transform duration-150 ease-out"
          style={{ transform: `translateY(${80 - selectedIndex * 40}px)` }}
        >
          {items.map((item: string | number, index: number) => (
            <div
              key={index}
              className={`h-10 text-center leading-10 text-lg transition-all duration-150 ease-out
                ${index === selectedIndex ? "text-black scale-100" : "text-gray-400 scale-75"}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface DatePickerProps {
  isOpen: boolean
  onClose: () => void
  setDate: (date: { amount: number; type: string }) => void
}

export const DatePicker: React.FC<DatePickerProps> = ({
  isOpen,
  onClose,
  setDate,
}) => {
  const [selectedType, setSelectedType] = useState(DateTypes[0])
  const [selectedDay, setSelectedDay] = useState(1)

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setDate({ amount: selectedDay, type: type })
  }

  const handleDayChange = (day: number) => {
    setSelectedDay(day)
    setDate({ amount: day, type: selectedType })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[99]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            className="fixed bottom-0 flex gap-2 px-4 items-center justify-center left-0 right-0 text-black bg-white h-[30vh] z-[100] rounded-t-3xl w-full max-w-xl mx-auto"
          >
            <Picker
              items={days}
              initialIndex={selectedDay - 1}
              onChange={(value) => handleDayChange(value as number)}
            />
            <Picker
              items={DateTypes}
              initialIndex={DateTypes.indexOf(selectedType)}
              onChange={(value) => handleTypeChange(value as string)}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
