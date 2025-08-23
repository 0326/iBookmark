import React, { useState, useMemo } from 'react';
import Modal from '../../components/Modal';
import { getFaviconURL, updateBookmark, removeBookmark, i18n } from '../../services'
import TextInput from '../../components/TextInput';

interface ContentProps {
    dataSource: chrome.bookmarks.BookmarkTreeNode;
    refresh: () => void;
}
interface BookmarkNode {
    id: string;
    title: string;
    url?: string;
    path: string;
    icon: string;
}
interface BookmarkNodes {
    id: string;
    title: string;
    list: BookmarkNode[];
}
/**
 * 将多层文件夹flat为一层，当前书签
 * @param data - The nested array of bookmark nodes to flatten.
 * @returns A flat array of bookmark nodes.
 */
const flatBookmarks = (data: chrome.bookmarks.BookmarkTreeNode) => {
    if (!data?.children?.length) return [];
    const result: BookmarkNodes[] = [];
    const recurse = (nodes: chrome.bookmarks.BookmarkTreeNode[], path: string, result: BookmarkNodes) => {
        for (const node of nodes) {
            if (node.children) {
                recurse(node.children, `${path}/${node.title}`, result);
            } else {
                result.list.push({
                    id: node.id,
                    title: node.title,
                    url: node.url,
                    icon: getFaviconURL(node.url || ''),
                    path,
                });
            }
        }
    };

    const directNodes: BookmarkNodes = {
        id: '-1',
        title: data.title,
        list: [],
    };
    data.children.forEach(item => {
        const path = `${data.title}/${item.title}`;
        if (item.children) {
            const folder: BookmarkNodes = {
                id: item.id,
                title: item.title,
                list: [],
            };
            recurse(item.children, path, folder);
            result.push(folder);
        } else {
            directNodes.list.push({
                id: item.id,
                title: item.title,
                url: item.url,
                icon: getFaviconURL(item.url || ''),
                path,
            });
        }
    });
    if (directNodes.list.length > 0) {
        result.push(directNodes);
    }
    console.log('flatBookmarks result', result);
    return result;
};

const Content: React.FC<ContentProps> = ({ dataSource, refresh }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedBookmark, setSelectedBookmark] = useState<BookmarkNode | null>(null);
    const list = useMemo(() => flatBookmarks(dataSource), [dataSource]);
    const onBookmarkClick = (bookmark: BookmarkNode) => {
        setSelectedBookmark(bookmark);
        setShowModal(true);
    }

    const handleModalOk = async () => {
        if (selectedBookmark?.title && selectedBookmark?.url) {
            await updateBookmark(selectedBookmark.id, { title: selectedBookmark.title, url: selectedBookmark.url });
            setShowModal(false);
            refresh();
        }
    };

    const handleModalDelete = async () => {
        if (selectedBookmark) {
            await removeBookmark(selectedBookmark.id);
            setShowModal(false);
            refresh();
        }
    };

    return (
        <>
        <Modal
            visible={showModal}
            title={i18n("editBookmark")}
            content={(
                <div>
                    <TextInput
                        name={i18n("name")}
                        placeholder={i18n("namePlaceholder")}
                        value={selectedBookmark?.title}
                        // @ts-ignore
                        onChange={(value) => setSelectedBookmark({ ...selectedBookmark, title: value })}
                    />
                    <TextInput
                        name={i18n("url")}
                        placeholder={i18n("urlPlaceholder")}
                        value={selectedBookmark?.url}
                        // @ts-ignore
                        onChange={(value) => setSelectedBookmark({ ...selectedBookmark, url: value })}
                    />
                </div>
            )}
            okText={i18n("confirm")}
            cancelText={i18n("cancel")}
            delText={i18n("delete")}
            onOk={handleModalOk}
            onDelete={handleModalDelete}
            onClose={() => setShowModal(false)}
        />
        {list?.map((item) => (
            <section className="w-full divide-y rounded divide-slate-200 ">
                <details className="p-4 group border-b-1 border-dashed border-emerald-200" open>
                    <summary className="relative cursor-pointer list-none pr-8 font-medium text-slate-700 transition-colors duration-300 focus-visible:outline-none group-hover:text-slate-900  [&::-webkit-details-marker]:hidden">
                        📚 Bookmark Group Name
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute right-0 w-4 h-4 transition duration-300 top-1 shrink-0 stroke-slate-700 group-open:rotate-45"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-labelledby="title-ac01 desc-ac01"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </summary>
                    {/* <div className="mt-4 text-slate-500 grid grid-cols-4 gap-3 md:grid-cols-5 lg:grid-cols-6"> */}
                    <div className="mt-4 text-slate-500 grid grid-cols-4 gap-3 md:grid-cols-5">
                        {item.list.map((bookmark) => (
                            <div key={bookmark.id} className="truncate flex items-center">
                                <img src={bookmark.icon} onClick={() => onBookmarkClick(bookmark)} alt="" className="inline-block w-4 h-4 mr-2 cursor-pointer" />
                                <a href={bookmark.url} target='_blank' className="hover:underline">
                                    Bookmark Name
                                </a>
                            </div>
                        ))}
                    </div>
                </details>
            </section>
        ))}
        </>
    );
};

export default Content;