import { useState, useRef, useEffect, useCallback } from "react"
import Content from './Content'
import Search from './Search'
import { getBookmarks, i18n } from '../../services'

export default function TabsSmBasic() {
  const [currentTab, setCurrentTab] = useState(0)
  const [bookmarks, setBookmarks] = useState<chrome.bookmarks.BookmarkTreeNode[]>([])

  const wrapperRef = useRef<any>(null)

  const refresh = useCallback(async () => {
    const bookmarks = await getBookmarks();
    setBookmarks(bookmarks!);
  }, [])

  useEffect(() => {
    refresh();
  }, [])

  return (
    <>
      <section className="max-w-full" aria-multiselectable="false">
        <ul
          className="fixed bg-white w-full z-1 flex items-center border-b border-slate-200"
          role="tablist"
          ref={wrapperRef}
        >
          {bookmarks.map((tab, index) => (
            <li className="" role="presentation" key={tab.id}>
              <button
                className={`-mb-px inline-flex h-8 w-full items-center justify-center gap-2 whitespace-nowrap rounded-t border-b-2 px-4 text-xs font-medium tracking-wide transition duration-300 hover:bg-emerald-50 hover:stroke-emerald-600 focus:bg-emerald-50 focus-visible:outline-none disabled:cursor-not-allowed ${
                  currentTab === index
                    ? "border-emerald-500 stroke-emerald-500 text-emerald-500 hover:border-emerald-600  hover:text-emerald-600 focus:border-emerald-700 focus:stroke-emerald-700 focus:text-emerald-700 disabled:border-slate-500"
                    : "justify-self-center border-transparent stroke-slate-700 text-slate-700 hover:border-emerald-500 hover:text-emerald-500 focus:border-emerald-600 focus:stroke-emerald-600 focus:text-emerald-600 disabled:text-slate-500"
                }`}
                id="tab-label-1c"
                role="tab"
                aria-setsize={bookmarks.length}
                aria-posinset={index + 1}
                tabIndex={currentTab === index ? 0 : -1}
                onClick={() => setCurrentTab(index)}
              >
                <span>Bookmark Category</span>
              </button>
            </li>
          ))}
          <Search placeholder={i18n("searchPlaceholder")} />
        </ul>
        <div className="pt-8 pb-4 text-sm">
          <Content dataSource={bookmarks[currentTab]} refresh={refresh} />
        </div>
      </section>
    </>
  )
}
