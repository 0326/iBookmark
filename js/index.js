var Bookmarks = chrome.bookmarks
var Cookies = chrome.cookies
var History = chrome.history
var Tabs = chrome.tabs

var markDict = {}


window.Bookmarks = Bookmarks
// console.log(Bookmarks)
// console.log(Cookies)
// console.log(History)
// console.log(Tabs)

// 入口方法，获取用户所有书签,初始化列表
Bookmarks.getTree(function (tree) {
  recursiveTree(tree[0],'')

  console.log(tree)
  console.log(markDict)
  renderBookmarks($('#J_BookmarkCtr'),markDict)
  bindEvent()
})

// 遍历收藏夹，将叶子节点的父节点作为分类名归类
function recursiveTree(dad,dadName,self){
  if(dad && dad.children){
    if(dad.children.length){
      dad.children.forEach(function (son) {
        var title = dadName
        if(son.children){
          title = dadName ? dadName + '-' + son.title : son.title
        }
        recursiveTree(son,title)
      })
    } else {
      recursiveTree(null,dadName,dad)
    }

  } else if(markDict[dadName]){
    markDict[dadName].push(dad)
  } else {
    markDict[dadName] = dad ? [dad] : self
  }
}

// 渲染收藏夹列表
function renderBookmarks($ctr,dict) {
  var tpl = ''
  for(var key in dict){
    tpl += '<section><h2>' + key + '</h2><ul class="clearfix">'
    if(dict[key].length){
      dict[key].forEach(function(item) {
        tpl += '<li data-id="'+item.id+'" data-parentId="'+item.parentId+'" data-index="'+item.index
            + '" data-title="'+ item.title +'" data-url="'+item.url+'"'
            +'><i class="J_BookmarkEdit" style="background-image:url(chrome://favicon/'
            +item.url+')"></i><a target="_blank" href="'+item.url+'" alt="'+item.url+'">'
            +item.title+'</a></li>'
      })
      tpl += '<li class="J_BookmarkNew bookmark-new" data-parentId="'+ dict[key][0].parentId
          +'" >添加新网址</li></ul></section>'
    } else {
      // 该分类下无数据，那么在该分类下建立的页面的parentId就是该分类本身的id
      tpl += '<li class="J_BookmarkNew bookmark-new" data-parentId="'+ dict[key].id
          +'" >添加新网址</li></ul></section>'
    }

  }
  $ctr.html(tpl)
}

// 注册所有用户事件
function bindEvent() {
  var currentNewBookmarkParentId = 0
  $('.J_BookmarkNew').on('click',function (e) {
    var $target = $(e.target)
    currentNewBookmarkParentId = $target.attr('data-parentId')

    showAddBookmarkPop()
  })

  $('.J_BookmarkEdit').on('click', function (e) {
      var $father = $(e.target).parent()
      showAddBookmarkPop($father.attr('data-id'),$father.attr('data-title'),$father.attr('data-url'))
  })

  $('.J_SubmitAddBookmark').on('click',function (e) {
    var title = $('#J_AddBookmarkPop').find('input[name=title]').val()
    var url = $('#J_AddBookmarkPop').find('input[name=url]').val()
    if(!title.length){
      $('#J_AddBookmarkPop').find('.tips').text('请输入标题')
      return
    }
    if(!/(http|https):\/\/.+/g.test(url)){
      $('#J_AddBookmarkPop').find('.tips').text('请输入正确地url,以http://或者https://开头')
      return
    }

    Bookmarks.create({
        parentId: currentNewBookmarkParentId,
        title: title,
        url: url
    }, function(e){
        console.log(e)
        location.reload()
        // $('#J_AddBookmarkPop').removeClass('show')
    });
  })

  $('.J_DeleteAddBookmark').on('click',function (e) {
    Bookmarks.remove($('.J_DeleteAddBookmark').attr('data-id'), function(e){
        console.log(e)
        location.reload()
    });
  })

  $('.J_UpdateAddBookmark').on('click',function (e) {
    var title = $('#J_AddBookmarkPop').find('input[name=title]').val()
    var url = $('#J_AddBookmarkPop').find('input[name=url]').val()
    if(!title.length){
      $('#J_AddBookmarkPop').find('.tips').text('请输入标题')
      return
    }
    if(!/(http|https):\/\/.+/g.test(url)){
      $('#J_AddBookmarkPop').find('.tips').text('请输入正确地url,以http://或者https://开头')
      return
    }

    Bookmarks.update($('.J_UpdateAddBookmark').attr('data-id'),{
        title: title,
        url: url
    }, function(e){
        console.log(e)
        location.reload()
        // $('#J_AddBookmarkPop').removeClass('show')
    });
  })

  $('.J_CancelAddBookmark').on('click',function (e) {
    $('#J_AddBookmarkPop').removeClass('show')
  })
}

// 展示书签编辑框，根据参数来判断是更新还是新建或者删除
function showAddBookmarkPop(id,title,url) {
  $('#J_AddBookmarkPop').addClass('show')
  $('#J_AddBookmarkPop').find('input[type=button]').hide()

  if(id){
    $('.J_UpdateAddBookmark').attr('data-id',id).show()
    $('.J_DeleteAddBookmark').attr('data-id',id).show()
    $('#J_AddBookmarkPop').find('input[name=title]').val(title)
    $('#J_AddBookmarkPop').find('input[name=url]').val(url)
  } else {
    $('.J_SubmitAddBookmark').show()
    $('#J_AddBookmarkPop').find('input[name=title]').val('')
    $('#J_AddBookmarkPop').find('input[name=url]').val('')
  }
}
