
const $ = Zepto

chrome.storage.sync.get('hasNewBookmarkBtn',(obj)=>{
  let $opt = $('#i_BookmarkNew')[0]
  obj.hasNewBookmarkBtn === false ? $opt.checked = false : '默认为true'
})

function registerEvent() {
  $('#i_BookmarkNew').on('change', (e) => {
    chrome.storage.sync.set({'hasNewBookmarkBtn': e.target.checked},() => {
      // chrome.storage.sync.get('hasNewBookmarkBtn',(obj)=>{
      //   console.log(obj)
      // })
    }) 
  })
}

registerEvent()