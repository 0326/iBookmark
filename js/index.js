var Bookmarks = chrome.bookmarks
var Cookies = chrome.cookies
var History = chrome.history
var Tabs = chrome.tabs

window.Bookmarks = Bookmarks
// console.log(Bookmarks)
// console.log(Cookies)
// console.log(History)
// console.log(Tabs)

// 获取用户所有书签
Bookmarks.getTree(function (tree) {
  var markDict = {}
  recursiveTree(tree[0],'')

  console.log(tree)
  console.log(markDict)
  renderBookmarks($('#J_BookmarkCtr'),markDict)

  // 遍历收藏夹，将叶子节点的父节点作为分类名归类
  function recursiveTree(dad,dadName){
    if(dad.children){
      dad.children.forEach(function (son) {
        var title = dadName
        if(son.children){
          title = dadName ? dadName + '-' + son.title : son.title
        }
        recursiveTree(son,title)
      })
    } else if(markDict[dadName]){
      markDict[dadName].push(dad)
    } else {
      markDict[dadName] = [dad]
    }
  }

  // 渲染收藏夹列表
  function renderBookmarks($ctr,dict) {
    var tpl = ''
    for(var key in dict){
      tpl += '<section><h2>' + key + '</h2><ul class="clearfix">'
      dict[key].forEach(function(item) {
        tpl += '<li data-id="'+item.id+'" data-parentId="'+item.parentId+'" data-index='+item.index
            +'""><i class="J_BookmarkEdit"></i><a target="_blank" href="'+item.url+'" alt="'+item.url+'">'+item.title+'</a></li>'
      })
      tpl += '<li class="J_BookmarkNew bookmark-new">添加新网址</li></ul></section>'
    }
    $ctr.html(tpl)
  }
})
