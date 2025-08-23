/**
 * Fetches the user's bookmarks from the Chrome bookmarks API.
 */
export async function getBookmarks() {
    const data = await chrome.bookmarks.getTree()
    // console.log('getBookmarks data', data)
    return data[0].children;
}

export async function searchBookmarks(query: string) {
    const bookmarks = await chrome.bookmarks.search(query);
    return bookmarks;
}

export async function updateBookmark(id: string, changes: { title?: string; url?: string }) {
    const rs = await chrome.bookmarks.update(id, changes);
    return rs;
}

export async function removeBookmark(bookmarkId: string) {
    const rs = await chrome.bookmarks.remove(bookmarkId);
    return rs;
}

export function i18n(key: string) {
    const rs = chrome.i18n.getMessage(key);
    console.log('i18n', { key, rs });
    return rs;
}

export function getFaviconURL(u: string) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u || 'https://developer.chrome.com');
    url.searchParams.set("size", "32");
    // console.log('getFaviconURL', url.toString())
    return url.toString();
}

// export async function setFullWindow() {
//     const outerWin = await chrome.windows.getLastFocused();
//     const popWin = await chrome.windows.getCurrent();
//     console.log('setFullWindow', { outerWin, popWin });
//     // await chrome.windows.update(popWin.id!, { width: outerWin.width, height: outerWin.height });
//     // await chrome.windows.update(popWin.id!, { state: 'maximized' });
//     window.resizeTo(outerWin.width!, outerWin.height!);
// }