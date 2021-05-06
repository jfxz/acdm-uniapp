​		本模块为货物进出港模块。
​		主目录下有两个文件夹enterport和leaveport分别存放进港和出港的页面和组件。

​		其中主目录下的文件为进出港公用的组件，enterport/leaveport目录下的components内的组件为进港、出港专用组件。

​		主目录文件：

​			cargo-mixin.js被所有页面混入，包含了公用的方法和变量。

​			card-mixin.js被大部分列表卡片混入，包含了公用的方法和变量。

​			每个页面基本由三个部分组成：nav-bar.vue（导航栏），list-content.vue(列表), bottom-bar.vue(底部栏)。

​			list-content通过插槽来插入不同样式的卡片。

​			bottom-bar通过插槽来实现底部栏左右和右边的不同按钮。

​	进出港目录：

​			为了实现从选择页面返回选择的数据，选择页面返回的时候会将选择的信息存在缓存中。这里在vuex中的cargo.js中定义一个backFlag。当backFlag为true时，onShow()会从缓存中取得被存储的信息，并销毁缓存，将缓存中的集装器加入已有的列表中。

