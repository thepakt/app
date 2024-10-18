import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FilterIcon } from "lucide-react"

export const Filter = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [bountyRange, setBountyRange] = useState([0, 1000])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const filterRef = useRef<HTMLDivElement>(null)

  const tags = ["Front-end", "Back-end", "Contracts"]

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-400 bg-neutral-800 text-sm font-medium rounded-md hover:bg-neutral-700 transition-all border border-slate-400/10 p-2 px-3"
      >
        <FilterIcon size={16} />
        Filter
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 bg-neutral-800 rounded-md shadow-lg p-4 z-10"
          >
            <h3 className="text-white font-medium mb-2">Bounty Range</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="number"
                value={bountyRange[0]}
                onChange={(e) =>
                  setBountyRange([Number(e.target.value), bountyRange[1]])
                }
                className="w-20 bg-neutral-700 text-white rounded px-2 py-1"
              />
              <span className="text-white">-</span>
              <input
                type="number"
                value={bountyRange[1]}
                onChange={(e) =>
                  setBountyRange([bountyRange[0], Number(e.target.value)])
                }
                className="w-20 bg-neutral-700 text-white rounded px-2 py-1"
              />
            </div>
            <h3 className="text-white font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? "bg-blue-500 text-white"
                      : "bg-neutral-700 text-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
