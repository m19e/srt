import type { NextPage } from "next"
import { useState, useEffect } from "react"
import type { ChangeEvent } from "react"
import { Dropzone } from "@/components/molecules/Dropzone"

type Subtitle = {
  id: string
  time: string
  sub: string
}

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
      <div className="flex overflow-auto flex-col items-center p-4 w-full sm:w-2/3 sm:max-w-xl">
        <Dropzone onDrop={setFile} />
        {data !== "" && (
          <div className="flex flex-col">
            {data.split("\n\n").map((block, i) => (
              <SubtitleItem key={block + i} block={block} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface ItemProps {
  block: string
}

const SubtitleItem = ({ block }: ItemProps) => {
  const [id, time, sub] = block.split("\n")
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [editSub, setEditSub] = useState(sub)

  return (
    <div className="flex flex-col">
      <div className="divider">No.{id}</div>
      <div
        className="flex overflow-hidden w-full text-sm bg-white rounded-lg border-2 border-gray-100 hover:border-purple-800 transition-colors cursor-pointer"
        onClick={() => setIsOpenEdit((p) => !p)}
      >
        <div className="flex flex-1 py-4 pl-4">
          <span className="text-black">{sub}</span>
        </div>

        <div className="flex justify-center items-center p-2 text-gray-600">
          {isOpenEdit ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
          )}
        </div>
      </div>
      {isOpenEdit && (
        <div className="flex py-1 w-full text-base-content">
          <div className="flex justify-center items-center p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
              style={{
                transform: "scale(-1,1)",
              }}
            >
              <path d="M21 4a1 1 0 0 1 .993.883L22 5v6.5a3.5 3.5 0 0 1-3.308 3.495L18.5 15H5.415l3.292 3.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083-5-5a1.011 1.011 0 0 1-.097-.112l-.071-.11-.054-.114-.035-.105-.025-.117-.007-.06L2 14l.003-.075.017-.126.03-.111.044-.111.052-.098.064-.092.083-.094 5-5a1 1 0 0 1 1.497 1.32l-.083.094L5.415 13H18.5a1.5 1.5 0 0 0 1.493-1.355L20 11.5V5a1 1 0 0 1 1-1Z" />
            </svg>
          </div>
          <div className="flex-1">
            <SubtitleEdit
              value={editSub}
              onChange={(e) => setEditSub(e.currentTarget.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface EditProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const SubtitleEdit = (props: EditProps) => {
  return (
    <input
      {...props}
      type="text"
      placeholder="Edit Subtitle"
      className="w-full text-black bg-white input"
      spellCheck={false}
    />
  )
}

export default Page
