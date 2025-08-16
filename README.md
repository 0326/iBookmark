<img width="400" src="https://lh3.googleusercontent.com/_oj_6Y4K4cjpguig23UpstgNdLh6qUvWfcS3LBE73U6p6f8FRr_QuqTIEWmGzq5MpRevAwzF=s1280-h800-e365-rw"></img>

# iBookmark
Chrome extension for manage bookmarks 一款简单好用的 Chrome 书签管理插件，项目工程非常简单，可供学习参考。

下载地址：https://chrome.google.com/webstore/detail/ibookmark/fnfchnalfnjbjbfeccpophocngdgapad

Wiki文档: https://github.com/0326/iBookmark/wiki

## 快速上手
先clone项目启动watch：
```shell
git clone git@github.com:0326/iBookmark.git
cd iBookmark
# install devDependencies
npm i 
# start watch
gulp   
```
然后chrome://extensions/ => 加载已解压 扩展程序 => 加载iBookmark文件夹：

注意插件ID信息，浏览器访问：
chrome-extension://{{插件ID}}/popup/popup.html

编码完成后把项目打包成zip即可上传应用市场。



## 已完成功能
- 所有书签分组展示
- 在当前分组新增书签
- 修改已有书签信息
- 删除书签
- 搜索书签功能
- 统计书签使用频率，新增常用书签一栏
- 支持 manifest.json V3

## 待完成功能
- 新增书签类别
- 修改书签类别名称
- 删除某个书签分类
- 支持书签拖拽，以及移动到其他分类
- 支持历史记录
- 支持插件配置功能，可配置主题，配置是否隐藏某些分类下的书签

## 协议
MIT.

## 更新日志
0.0.4版本： 支持 manifest V3 协议
0.0.2版本： 新增配置功能，是否在每个分类下展示添加网址链接按钮