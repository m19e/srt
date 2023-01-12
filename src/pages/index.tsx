import type { NextPage } from "next"
import { useState, useEffect } from "react"
import { Dropzone } from "@/components/molecules/Dropzone"

const Page: NextPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState("")

  useEffect(() => {
    const f = async () => {
      const text = await file?.text()
      setData(text ?? "")
    }
    f()
  }, [file])

  return (
    <div className="flex flex-col items-center w-full min-h-screen font-sans bg-base-100">
      <div className="flex overflow-auto flex-col gap-3 items-center p-4 w-full sm:w-2/3 sm:max-w-lg">
        <Dropzone onDrop={setFile} />
        {file && (
          <div className="flex overflow-hidden w-full text-sm bg-white rounded-lg">
            <div className="p-4 bg-gray-200 border-r-2 border-gray-300">
              <span className="text-gray-600">FileName</span>
            </div>
            <span className="p-4 text-black">{file.name}</span>
          </div>
        )}
        {data !== "" && (
          <div className="flex flex-col gap-4">
            {data.split("\n\n").map((block, i) => (
              <div key={block + i}>
                <span className="whitespace-pre-wrap break-words">{block}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
