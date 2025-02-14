import type React from "react"
import { useState, useRef, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { Tag } from "../types"


export const MultiSelectCombobox: React.FC<any> = ({
    options,
    placeholder = "Select options...",
    onChange,
    selectedOptionsTags
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState<Tag[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (selectedOptionsTags && selectedOptionsTags.length > 0) setSelectedOptions(selectedOptionsTags)
    }, [selectedOptionsTags])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const toggleOption = (option: any) => {
        const updatedSelection = selectedOptions.some((item) => item.name === option.name)
            ? selectedOptions.filter((item) => item.name !== option.name)
            : [...selectedOptions, option]
        setSelectedOptions(updatedSelection)
        onChange(updatedSelection)
    }

    const filteredOptions = options.filter((option: any) => option.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div ref={wrapperRef} className="relative w-full max-w-xs">
            <div
                className={twMerge(
                    "flex flex-wrap items-center border border-gray-300 rounded-md p-2 cursor-pointer",
                    isOpen && "ring-2 ring-blue-500",
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOptions.length > 0 ? (
                    selectedOptions.map((option) => (
                        <span
                            key={option._id}
                            className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
                        >
                            {option.name}
                        </span>
                    ))
                ) : (
                    <span className="text-gray-400">{placeholder}</span>
                )}
            </div>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <input
                        type="text"
                        className="w-full p-2 border-b border-gray-300"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className="max-h-60 overflow-auto">
                        {filteredOptions.map((option: any) => (
                            <li
                                key={option._id}
                                className={twMerge(
                                    "p-2 hover:bg-gray-100 cursor-pointer",
                                    selectedOptions.some((item) => item.name === option.name) && "bg-blue-50",
                                )}
                                onClick={() => toggleOption(option)}
                            >
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedOptions.some((item) => item.name === option.name)}
                                        onChange={() => { }}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span>{option.name}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}