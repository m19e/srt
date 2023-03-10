import path from "path"
import type { NextPage } from "next"
import Head from "next/head"
import { useState, useEffect } from "react"
import type { ChangeEvent } from "react"
import { Dropzone } from "@/components/molecules/Dropzone"

type Subtitle = {
  id: string
  time: string
  sub: string
}

const createSubtitleMapFromSrt = (text: string) => {
  return new Map<string, Subtitle>(
    text.split("\n\n").map((block) => {
      const [id, time, sub] = block.split("\n")
      return [id, { id, time, sub }]
    })
  )
}

const createSrtFromSubtitles = (subs: Subtitle[]) =>
  subs.map((s) => [s.id, s.time, s.sub].join("\n")).join("\n\n")

const useSubtitleMap = () => {
  const [file, setFile] = useState<File | null>(null)
  const [subtitleMap, setSubtitleMap] = useState(new Map<string, Subtitle>([]))

  const subtitles = Array.from(subtitleMap.values())

  useEffect(() => {
    const f = async () => {
      if (file) {
        const text = await file.text()
        setSubtitleMap(createSubtitleMapFromSrt(text))
      }
    }
    f()
  }, [file])

  const updateSubtitle = (newSub: Subtitle) => {
    const target = subtitleMap.get(newSub.id)
    if (target) {
      setSubtitleMap(new Map(subtitleMap.set(newSub.id, newSub)))
    }
  }

  return { subtitles, setFile, updateSubtitle }
}

const downloadURI = (uri: string, name: string) => {
  const link = document.createElement("a")
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const Page: NextPage = () => {
  const [generateFileName, setGenerateFileName] = useState("")
  const { subtitles, setFile, updateSubtitle } = useSubtitleMap()
  const emptySubs = !subtitles.length

  const handleDrop = (file: File) => {
    setGenerateFileName(path.parse(file.name).name + "_edit")
    setFile(file)
  }

  const handleDownload = () => {
    const data = new Blob([createSrtFromSubtitles(subtitles)], {
      type: "text/plain",
    })
    const uri = URL.createObjectURL(data)
    const fileName = `${generateFileName}.srt`
    downloadURI(uri, fileName)
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-base-100">
      <Head>
        <link
          rel="icon alternate"
          type="image/svg+xml"
          href="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f411.svg"
        />
        <title>SRT | Simple .srt editor</title>
      </Head>
      <div className="flex flex-col items-center p-4 w-full sm:w-2/3 sm:max-w-xl">
        <div className="flex w-full">
          <h1 className="text-3xl font-black select-none font-latego">
            SRT
            <span className="px-2 text-xl font-medium">simple .srt editor</span>
          </h1>
        </div>
        <div className="py-4 w-full">
          <Dropzone onDrop={handleDrop} />
        </div>
        {!emptySubs && (
          <>
            <div className="flex flex-col gap-2 w-full sm:flex-row font-latego">
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  placeholder="Generate file name"
                  className="flex-1 text-black bg-white input"
                  spellCheck={false}
                  value={generateFileName}
                  onChange={(e) => setGenerateFileName(e.currentTarget.value)}
                />
                <div className="flex items-center">
                  <span className="text-xl select-none">.srt</span>
                </div>
              </div>
              <button
                className="text-base bg-gradient-to-tr from-purple-600 to-purple-900 rounded-lg btn"
                onClick={handleDownload}
              >
                <span className="font-sans font-semibold text-white capitalize">
                  generate
                </span>
              </button>
            </div>
            {subtitles.map((sub) => (
              <SubtitleItem
                key={sub.id}
                subtitle={sub}
                onUpdate={updateSubtitle}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

interface ItemProps {
  subtitle: Subtitle
  onUpdate: (sub: Subtitle) => void
}

const SubtitleItem = ({ subtitle, onUpdate }: ItemProps) => {
  const { id, sub } = subtitle
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [editSub, setEditSub] = useState(sub)

  const handleToggle = () => {
    if (isOpenEdit && sub !== editSub.trim()) {
      onUpdate({
        ...subtitle,
        sub: editSub.trim(),
      })
    }
    setIsOpenEdit((p) => !p)
  }

  return (
    <div className="flex flex-col w-full font-latego">
      <div className="font-sans select-none divider">No.{id}</div>
      <div
        className="flex overflow-hidden w-full text-sm bg-white rounded-lg border-2 border-gray-100 hover:border-purple-800 transition-colors cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex-1 py-4 pl-4">
          <span className="text-black select-none">{sub}</span>
        </div>

        <div className="flex justify-center items-center p-2 text-gray-600">
          {isOpenEdit ? (
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
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
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
      className="w-full text-sm text-black bg-white input"
      spellCheck={false}
    />
  )
}

export default Page
