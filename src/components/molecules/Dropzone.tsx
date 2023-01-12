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
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: {
      subtitle: [".srt"],
    },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center p-2 w-full max-w-sm h-40 card bg-base-200 rounded-box"
    >
      <div className="flex flex-col justify-center items-center w-full h-full text-sm font-black border-2 border-dashed sm:text-base border-base-300 text-base-content rounded-box">
        <input {...getInputProps()} />
        <div className="pb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </div>

        <p>字幕ファイルをドロップ</p>
        <p className="text-sm text-base-content text-opacity-60">または</p>
        <p>クリックして選択</p>
      </div>
    </div>
  )
}
