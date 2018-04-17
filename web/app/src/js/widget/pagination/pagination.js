/**
 * @module port/wediget/pagination/ 分页
 */
define(function(require) {
    'use strict';
    var jsrender = require('plugin/jsrender/jsrender'); // jsrender模板库
    var paginationTemplate = "<nav aria-label='Page navigation'>" +
                                  "<ul class='pagination pull-left'>"+
                                    "<li class='previous'>" +
                                      "<a href='javascript:void(0);' aria-label='Previous'>" +
                                        "<span aria-hidden='true'>&laquo;</span>" +
                                      "</a>" +
                                    "</li>" +
                                   " <li><a href='javascript:void(0);'>1</a></li>" +
                                   // " <li><a href='javascript:void(0);'>2</a></li>" +
                                   " <li class='ellipsis'><a href='javascript:void(0);'>...</a></li>" +
                                   " <li><a href='javascript:void(0);'>'curPage-1'</a></li>" +
                                    "<li class='curPage'><a href='javascript:void(0);'>'curPage'</a></li>" +
                                    "<li><a href='javascript:void(0);'>'curPage+1'</a></li>" +
                                    "<li class='ellipsis'><a href='javascript:void(0);'>...</a></li>" +
                                    // "<li><a href='javascript:void(0);'>'totalPage-1'</a></li>" +
                                    "<li><a href='javascript:void(0);'>'totalPage'</a></li>" +
                                    "<li class='next'>" +
                                      "<a href='javascript:void(0);' aria-label='Next'>" +
                                        "<span aria-hidden='true'>&raquo;</span>" +
                                     " </a>" +
                                    "</li>" +
                                  "</ul>" +
                                  "<div class='pull-left mgleft'>" +
                                    "到第 <input type='text' class='inputPage form-control inline-block'/> 页" +
                                    "<button type='button' class='btn btn-default mgleft goto'>跳转</button>"
                                  "</div>" +
                                "</nav>" ;
    var Pagination = function (cfg) {
        if( !(this instanceof Pagination) ){
            return new Pagination().init(cfg);
        }
    };
    
    Pagination.prototype = $.extend({
        
        /*
        * 初始化
        * @param {plain object}  {
            wraper: {string || object}    // 外容器节点或节点选择器字符串
           
           },       
        */
        init:function( cfg ){ 
            if( !cfg.wraper || !cfg.wraper.length ){
                console.log('无节点');
                return false;
            }
            this.wraper = cfg.wraper || $(cfg.wraper); 
            this.page = cfg.page;
            // this.page = cfg.info.page;
            this.that = cfg.that;
            // this.info = cfg.info;
            this.callback = cfg.callback;
            this.renderPagination(); 
            this.bindEvent();
            return this;
        },
        bindEvent: function(){
            var self = this;
            this.wraper.off()
            // 分页
            .on('click', 'li', function(ev){
                var obj = $('nav');
                if($(this).hasClass('ellipsis') || $(this).hasClass('previous') && self.page.curPage == 1 || $(this).hasClass('next') && self.page.curPage >= self.page.totalPage)   return;
                if($(this).hasClass('previous')){
                    self.page.curPage -= 1;
                    self.pagination_com(obj, self.page.curPage, self.page.totalPage);
                }
                else if($(this).hasClass('next')){
                    self.page.curPage += 1;
                    self.pagination_com(obj, self.page.curPage, self.page.totalPage);
                }
                else{
                    self.page.curPage = parseInt(ev.target.innerText);
                    self.pagination_com(obj, self.page.curPage, self.page.totalPage);
                }
                // self.callback(self.info);
                self.that.page.curPage = self.page.curPage;
                self.callback(self.that);
            })
            // 分页跳转
            .on('click', '.goto', function(ev){
                var num = parseInt($('.inputPage').val());
                if(!num || typeof(num) != 'number' || num > self.page.totalPage || num < 1){
                    return;
                }
                self.page.curPage = num;
                self.renderPagination();
                $('li.curPage').trigger('click');
            })
        },
        refreshPagedata: function(page){
            this.page = page;
        },
        renderPagination: function(){
            this.wraper.html(paginationTemplate);
            this.pagination(this.page, this.wraper);
        },
        pagination: function(page, obj) {
            var self = this;
            var list = obj.find('li');
            var curPage = page.curPage;
            this.pagination_com(obj, curPage, this.page.totalPage);

        },
        pagination_com: function(obj, curPage, totalPage){
            var list = obj.find('li');
            list.not(':first, :last, .curPage').hide();
            obj.find('.pagination li.curPage')
                .addClass('active').find('a').html(curPage);
            if(totalPage - curPage > 1){
                list.eq(-2).show()
                    .find('a').html(totalPage);
            }
            if(totalPage - curPage > 2){
                list.eq(-3).show()
                    
            }
            if(totalPage > curPage){
                list.eq(-4).show()
                    .find('a').html(curPage + 1);
            }
            if(curPage > 1){
                list.eq(3).show()
                    .find('a').html(curPage - 1);
            }
            if(curPage > 3){
                list.eq(2).show();
            }
            if(curPage > 2){
                list.eq(1).show();
            }
        },
        /*
         * 初始化
         * @param {string || object}    // 外容器节点或节点选择器字符串
         */
       
    })
    
    return Pagination;
    
})