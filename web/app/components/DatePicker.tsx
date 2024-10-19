import React, { useState, useEffect, useRef } from "react"
import {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const days = Array.from({ length: 31 }, (_, i) => i + 1)

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

  useEffect(() => {
    const picker = pickerRef.current
    if (!picker) return

    const handleTouchStart = (e: TouchEvent) => {
      startYRef.current = e.touches[0].clientY
      startIndexRef.current = selectedIndex
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startYRef.current === null) return
      const currentY = e.touches[0].clientY
      const deltaY = currentY - startYRef.current
      const deltaIndex = deltaY / 40
      let newIndex = startIndexRef.current - deltaIndex
      newIndex = Math.max(0, Math.min(newIndex, items.length - 1))
      setSelectedIndex(Math.round(newIndex))
    }

    const handleTouchEnd = () => {
      startYRef.current = null
      onChange(items[selectedIndex])
    }

    picker.addEventListener("touchstart", handleTouchStart)
    picker.addEventListener("touchmove", handleTouchMove)
    picker.addEventListener("touchend", handleTouchEnd)

    return () => {
      picker.removeEventListener("touchstart", handleTouchStart)
      picker.removeEventListener("touchmove", handleTouchMove)
      picker.removeEventListener("touchend", handleTouchEnd)
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
  setDate: (date: { month: string; day: number }) => void
}

export const DatePicker: React.FC<DatePickerProps> = ({
  isOpen,
  onClose,
  setDate,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(months[0])
  const [selectedDay, setSelectedDay] = useState(1)

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
    setDate({ month, day: selectedDay })
  }

  const handleDayChange = (day: number) => {
    setSelectedDay(day)
    setDate({ month: selectedMonth, day })
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
              items={months}
              initialIndex={months.indexOf(selectedMonth)}
              onChange={(value) => handleMonthChange(value as string)}
            />
            <Picker
              items={days}
              initialIndex={selectedDay - 1}
              onChange={(value) => handleDayChange(value as number)}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
