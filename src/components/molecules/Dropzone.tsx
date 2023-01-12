import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

export interface Props {
  onDrop: (file: File) => void
}

export const Dropzone = ({ onDrop }: Props) => {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return
      onDrop(acceptedFiles[0])
    },
    [onDrop]
  )
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: handleDrop,
    accept: {
      subtitle: [".srt"],
    },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center p-2 w-full h-40 bg-white rounded-lg border-2 border-gray-100 hover:border-purple-800 transition-colors card"
    >
      <div className="flex flex-col justify-center items-center w-full h-full text-sm sm:text-base text-base-content rounded-box">
        <input {...getInputProps()} />
        <div className="flex flex-col gap-2 items-center my-2 text-violet-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          <p className="font-semibold">
            {acceptedFiles.length
              ? acceptedFiles[0].name
              : "Select a file or drag it here"}
          </p>
          <div className="py-2 px-4 bg-gradient-to-tr from-purple-600 to-purple-900 rounded-lg">
            <span className="font-semibold text-white">Select File</span>
          </div>
        </div>
      </div>
    </div>
  )
}
