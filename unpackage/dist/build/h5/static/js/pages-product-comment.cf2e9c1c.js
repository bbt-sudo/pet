(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-product-comment"],{"48c6":function(t,a,i){"use strict";i.r(a);var e=i("4efd"),s=i("785a3");for(var o in s)["default"].indexOf(o)<0&&function(t){i.d(a,t,(function(){return s[t]}))}(o);i("b3d5");var n=i("f0c5"),r=Object(n["a"])(s["default"],e["b"],e["c"],!1,null,"7cb1736b",null,!1,e["a"],void 0);a["default"]=r.exports},"4efd":function(t,a,i){"use strict";i.d(a,"b",(function(){return e})),i.d(a,"c",(function(){return s})),i.d(a,"a",(function(){}));var e=function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("v-uni-view",{staticClass:"content",staticStyle:{"border-top":"1px solid #eee"}},[i("v-uni-view",{staticClass:"goods-list"},t._l(t.goodsComment,(function(a){return i("v-uni-view",{staticClass:"eva-box"},[i("v-uni-view",{staticClass:"eva_box_top"},[i("v-uni-image",{directives:[{name:"show",rawName:"v-show",value:"avatar"in a.userInfo,expression:"'avatar' in item.userInfo"}],staticClass:"portrait",attrs:{src:a.userInfo.avatar,mode:"aspectFill"}}),i("v-uni-image",{directives:[{name:"show",rawName:"v-show",value:!("avatar"in a.userInfo),expression:"!('avatar' in item.userInfo)"}],staticClass:"portrait",attrs:{src:"https://pic4.zhimg.com/v2-194b7fd15f75191874379a76bc380e53_r.jpg",mode:"aspectFill"}}),i("v-uni-view",{staticClass:"userInfo"},[i("v-uni-text",{staticClass:"name"},[t._v(t._s(a.userInfo.nickname))]),i("v-uni-text",{staticClass:"time"},[t._v(t._s(t._f("aa")(a.add_time,a.add_time)))])],1)],1),i("v-uni-view",{staticClass:"right"},[i("v-uni-view",{staticClass:"con"},[t._v(t._s(a.content))]),i("v-uni-view",{staticClass:"img_wrap"},[i("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:""!==a.images,expression:"item.images!==''"}],staticClass:"img"},[i("v-uni-image",{attrs:{src:a.images}})],1)],1),i("v-uni-view",{staticClass:"bot"},[i("v-uni-text",{staticClass:"attr"},[t._v("购买类型：大包")])],1)],1)],1)})),1)],1)},s=[]},6301:function(t,a,i){var e=i("24fb");a=e(!1),a.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* uni.scss */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */\r\n/*项目相关*/\r\n/* 默认主题色 */\r\n/* 自定义主题色 */\r\n/* 页面左右间距 */\r\n/* 文字尺寸 */\r\n/*文字颜色*/\r\n/* 边框颜色 */\r\n/* 图片加载中颜色 */\r\n/* 行为相关颜色 */\r\n/* 颜色变量 */uni-page-body[data-v-7cb1736b], .content[data-v-7cb1736b]{background:#fff}body.?%PAGE?%[data-v-7cb1736b]{background:#fff}\r\n/* 商品列表 */.goods-list[data-v-7cb1736b]{padding:%?20?% %?30?%}.goods-list .eva-box[data-v-7cb1736b]{display:flex;padding:%?20?% 0;flex-wrap:wrap;border-bottom:1px solid #eee}.goods-list .eva-box .eva_box_top[data-v-7cb1736b]{display:flex;width:100%}.goods-list .eva-box .portrait[data-v-7cb1736b]{flex-shrink:0;width:%?80?%;height:%?80?%;border-radius:100px}.goods-list .eva-box .userInfo[data-v-7cb1736b]{display:flex;height:%?80?%;flex-direction:column;margin-left:%?20?%;justify-content:space-between}.goods-list .eva-box .star[data-v-7cb1736b]{flex:1;text-align:right}.goods-list .eva-box .star uni-text[data-v-7cb1736b]{color:#aaa}.goods-list .eva-box .star uni-text.act[data-v-7cb1736b]{color:#e33b2d}.goods-list .eva-box .right[data-v-7cb1736b]{display:flex;flex-direction:column;font-size:#666;color:#666;padding-left:%?100?%}.goods-list .eva-box .right .con[data-v-7cb1736b]{font-size:#666;color:#666;padding:%?20?% 0}.goods-list .eva-box .right .img_wrap[data-v-7cb1736b]{display:flex;flex-wrap:wrap}.goods-list .eva-box .right .img[data-v-7cb1736b]{width:%?180?%;height:%?180?%;margin-right:%?30?%;margin-bottom:%?30?%}.goods-list .eva-box .right .img uni-image[data-v-7cb1736b]{width:%?180?%;height:%?180?%}.goods-list .eva-box .right .bot[data-v-7cb1736b]{display:flex;justify-content:space-between;font-size:#666;color:#666}',""]),t.exports=a},"785a3":function(t,a,i){"use strict";i.r(a);var e=i("d9cb"),s=i.n(e);for(var o in e)["default"].indexOf(o)<0&&function(t){i.d(a,t,(function(){return e[t]}))}(o);a["default"]=s.a},"91e0":function(t,a,i){var e=i("6301");e.__esModule&&(e=e.default),"string"===typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);var s=i("4f06").default;s("0417ee42",e,!0,{sourceMap:!1,shadowMode:!1})},b3d5:function(t,a,i){"use strict";var e=i("91e0"),s=i.n(e);s.a},d9cb:function(t,a,i){"use strict";i("7a82"),Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var e=i("614c"),s=i("6c3f"),o={data:function(){return{goods_id:"",skip:0,limit:10,goodsComment:[]}},methods:{getGoodsComment:function(){var t=this,a=this.goods_id,i=this.limit,s=this.skip;(0,e.get_goods_comment)({goods_id:a,limit:i,skip:s}).then((function(a){console.log(a),t.goodsComment=a.data}))}},filters:{aa:function(t){return(0,s.timeFormat)(t)}},onLoad:function(t){this.goods_id=t.goods_id,this.getGoodsComment()}};a.default=o}}]);