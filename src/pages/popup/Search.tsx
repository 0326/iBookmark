import { useCallback, useRef, useState } from "react"
import * as api from '../../services'

interface SearchProps {
    className?: string;
}

interface SearchItemProps {
    item: chrome.bookmarks.BookmarkTreeNode;
}

const SearchItem = ({ item }: SearchItemProps) => {
  return (
    <a href={item.url} target="_blank" className="flex items-center gap-2 px-4 py-2 truncate">
        <div className="flex w-4 h-4 items-center self-center text-emerald-500">
            <img src={api.getFaviconURL(item.url || '')} alt="" className="w-4 h-4" />
        </div>
        <div className="flex flex-col gap-0 items-start justify-center">
            <h4 className="text-xs text-slate-700 ">{item.title}</h4>
        </div>
    </a>
  )
}

export default function Search(props: SearchProps) {
  const composeRef = useRef<boolean>(false)
  const [inputVal, setInputVal] = useState<string>('')
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<chrome.bookmarks.BookmarkTreeNode[]>([])

  const onSearch = useCallback(async (q: string) => {
    setInputVal(q)
    const res = await api.searchBookmarks(q)
    console.log("Searching for:", res)
    setSearchResults(res)
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (composeRef.current) return
    onSearch(e.currentTarget.value)
  }
  const onCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    composeRef.current = false
    onSearch(e.currentTarget.value)
  }
  const onCompositionStart = () => {
    composeRef.current = true
  }

  return (
    <>
      <div className="absolute w-64 top-0 right-4">
          <input
            id="id-s01"
            type="search"
            name="id-s01"
            placeholder="Search bookmarks"
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 100)}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            autoComplete="off"
            className={`${isFocused ? 'pr-0' : 'pr-12'} peer relative h-8 w-full border-b border-slate-200 px-4 text-xs text-slate-500 outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
        />
        {!isFocused && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-4 top-[8px] h-4 w-4 cursor-pointer stroke-slate-400 peer-disabled:cursor-not-allowed"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden="true"
            aria-label="Search icon"
            role="graphics-symbol"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        )}
      </div>
        {isFocused && (
          <ul className="bg-white h-100 overflow-y-auto z-2 shadow-md absolute w-64 top-8 right-4 divide-y divide-slate-100">
            {searchResults.length > 0 ? searchResults.map(item => (
              <SearchItem key={item.id} item={item} />
            )) : (
              <li className="px-4 py-3 h-100 flex items-center justify-center text-slate-500">{inputVal ? "No results found" : "Start typing to search..."}</li>
            )}
          </ul>
        )}
    </>
  )
}
