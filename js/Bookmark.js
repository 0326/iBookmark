
export default class Bookmark {
  constructor () {
    let self = this
    self.bookmarkDict = {}

    self.registerHotBookmark() 
    self.registerSearchBar()
    chrome.bookmarks.getRecent(8,function(list){
      self.renderBookmarks($('#J_BookmarkRecent'), {'最新添加':list})  
    })
    
    chrome.bookmarks.getTree(function (tree) {
      self.recursiveTree(tree[0],'')
      self.renderBookmarks($('#J_BookmarkCtr'),self.bookmarkDict,true)
      self.bindEvent()
    })
    
  }
  
  
  registerSearchBar(){
    let that = this
    let inputPause = false
    let $searchBar = $('#J_SearchBookmark')
    let $searchResultList = $('#J_BookmarkSearchList')
    $searchBar.on('input', function(params) {
      if(inputPause){
        return
      }
      
      inputPause = true
      
      setTimeout(function (params) {
        let val = $searchBar.val()
        if(val){
          renderSearchBookmark(val)
        } else {
          $searchResultList.hide()
        }
        inputPause = false
      },1000)      
    })  
    
    $('#J_SearchClose').on('click', function(){
      $searchResultList.hide()
    })
    
    function renderSearchBookmark(val){
      chrome.bookmarks.search(val, function(list){
        console.log(list)
        that.renderBookmarks($searchResultList,{'搜索结果':list})
        $searchResultList.show()    
      })
    }
  }
  
  // 实现最热书签排行榜
  registerHotBookmark(){
    let that = this
    let CStorage = chrome.storage.local
    $('.bookmark-ctr').on('click','li', function(e){
    //  e.preventDefault()
    if(e.target.href){
      let bkid = e.currentTarget.dataset.id.toString()
      CStorage.get(bkid,function(obj){
        let num = obj[bkid]
        let saveObj = {}
        
        saveObj[bkid] = 1
        if(num){
          saveObj[bkid] = num+1
        }
        CStorage.set(saveObj)
      })
    }
    })
    
    CStorage.get(null, function(obj){
      let objArr = []   
      let idList = []  
      
      // obj=>arr
      for(let i in obj){
        if(/^\d+$/.test(i)) {
          objArr.push({
            id:i,
            num:obj[i]
          })
        }
      }
      
      // 过滤出点击num最大的前8个数据
      objArr.sort(function(a,b){
        return b.num - a.num
      })
      .slice(0,8)
      .forEach(function(item){
        idList.push(item.id)
      })
      
      chrome.bookmarks.get(idList,function(list){
        that.renderBookmarks($('#J_BookmarkHot'),{'最常使用':list})
      })
    })
  }
  
  // 遍历收藏夹，将叶子节点的父节点作为分类名归类
  recursiveTree(dad,dadName,self){
    let that = this
    if(dad && dad.children){
      if(dad.children.length){
        dad.children.forEach(function (son) {
          let title = dadName
          if(son.children){
            title = dadName ? dadName + '-' + son.title : son.title
          }
          that.recursiveTree(son,title)
        })
      } else {
        that.recursiveTree(null,dadName,dad)
      }

    } else if(that.bookmarkDict[dadName]){
      that.bookmarkDict[dadName].push(dad)
    } else if(dadName){
      that.bookmarkDict[dadName] = dad ? [dad] : self
    }
  }

  // 渲染收藏夹列表
  renderBookmarks($ctr,dict,hasNew) {
    let tpl = ''
    for(let key in dict){
      tpl += '<section><h2>' + key + '</h2><ul class="clearfix">'
      if(dict[key].length){
        dict[key].forEach(function(item) {
          tpl += '<li data-id="'+item.id+'" data-parentId="'+item.parentId+'" data-index="'+item.index
              + '" data-title="'+ item.title +'" data-url="'+item.url+'"'
              +'><i class="J_BookmarkEdit" style="background-image:url(chrome://favicon/'
              +item.url+')"></i><a target="_blank" class="bm-item" href="'+item.url+'" alt="'+item.url+'">'
              +item.title+'</a></li>'
        })
        
        if(hasNew){
         tpl += '<li class="J_BookmarkNew bookmark-new" data-parentId="'+ dict[key][0].parentId
            +'" >添加新网址</li></ul></section>' 
        } else {
          tpl += '</ul></section>'
        }
        
      } else if(hasNew){
        // 该分类下无数据，那么在该分类下建立的页面的parentId就是该分类本身的id
        tpl += '<li class="J_BookmarkNew bookmark-new" data-parentId="'+ dict[key].id
            +'" >添加新网址</li></ul></section>'
      } else {
        tpl += '</ul></section>'
      }
      
    }
    $ctr.html(tpl)
  }

  // 注册所有用户事件
  bindEvent() {
    let self = this
    let currentNewBookmarkParentId = 0
    $('.J_BookmarkNew').on('click',function (e) {
      let $target = $(e.target)
      currentNewBookmarkParentId = $target.attr('data-parentId')

      self.showAddBookmarkPop()
    })

    $('.J_BookmarkEdit').on('click', function (e) {
        let $father = $(e.target).parent()
        self.showAddBookmarkPop($father.attr('data-id'),$father.attr('data-title'),$father.attr('data-url'))
    })

    $('.J_SubmitAddBookmark').on('click',function (e) {
      let title = $('#J_AddBookmarkPop').find('input[name=title]').val()
      let url = $('#J_AddBookmarkPop').find('input[name=url]').val()
      if(!title.length){
        $('#J_AddBookmarkPop').find('.tips').text('请输入标题')
        return
      }
      if(!/(http|https):\/\/.+/g.test(url)){
        $('#J_AddBookmarkPop').find('.tips').text('请输入正确地url,以http://或者https://开头')
        return
      }

      chrome.bookmarks.create({
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
      chrome.bookmarks.remove($('.J_DeleteAddBookmark').attr('data-id'), function(e){
          console.log(e)
          location.reload()
      });
    })

    $('.J_UpdateAddBookmark').on('click',function (e) {
      let title = $('#J_AddBookmarkPop').find('input[name=title]').val()
      let url = $('#J_AddBookmarkPop').find('input[name=url]').val()
      if(!title.length){
        $('#J_AddBookmarkPop').find('.tips').text('请输入标题')
        return
      }
      if(!/(http|https):\/\/.+/g.test(url)){
        $('#J_AddBookmarkPop').find('.tips').text('请输入正确地url,以http://或者https://开头')
        return
      }

      chrome.bookmarks.update($('.J_UpdateAddBookmark').attr('data-id'),{
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
  showAddBookmarkPop(id,title,url) {
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
  
  
}
