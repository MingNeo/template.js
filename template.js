/*
* @Author: liumingren
* @Date:   2015-08-20 10:21:21
* @Last Modified by:   liumingren
* @Last Modified time: 2017-03-20 10:28:03
*/

'use strict';
/**
 * [简单模板方法，用来组装字符串 liumingren]
 * 仅替换，可用来替换变量生成字符串。未加入常见的each等操作，后续可使用流行的模板引擎
 * @param {string} 模板 表达式格式为{{key}},也可以直接进行简单运算 如 {{(key1 + key2) * key3}}
 *                 筛选器 {{key|to [A] B}} 当有比较字符串A时，比较key是否等于A，是则返回B，无A时，判断是否有key的数据,如{{title|to on}},有title值时返回on
 * @param {object|array} 替换的对象数据 格式为 (模板:值),多个放在数组里，多个可做each使用,{{INDEX}}为下标
 * @return {string} 替换后的htmlString
 */
function format(){
    var args = [].slice.call(arguments),str = String(args.shift() || ""), ar = [], first = args[0];
    args = $.isArray(first) ? first : typeof(first) == 'object' ? args : [args];
    var filter = {
            to : function (q,d,o) {
                return d.length > 1 ? o[q] === d[0] ? d[1] : void 0 : o[q] ? d[0] : void 0;
            }
        },
        opp = function (o,exp,par) {
            var reg = /[a-zA-Z]/g;
            var exn = exp.replace(/([^\s\(\)\+\*\/]+)/g,function(m){
                return reg.test(m) ? o[m] || "n" : m
            });
            return reg.test(exn) ? o[par] : new Function( "return " + exn )()
        };
    $.each(args, function(i, o){
        ar.push(str.replace(/\{\{([\d\w\.\-\@\_\(\)\*\+\/\|\s]+)\}\}/g, function(m, n){
            var op=/\*|\+|\//g,v;
            n.replace(/([^|]*)\|([^|]+)/g,function(p,q,r){
                var s = r.split(/\s+/g);
                if(filter[s[0]]){
                    v = filter[s[0]](q,s.slice(1),o);
                }
            });
            if(!v) v = n === 'INDEX' ? i : op.test(n) ? opp(o,n) : o[n];
            return v === undefined ? m : ($.isFunction(v) ? v.call(o, n) : v)
        }));
    });
    return ar.join('');
};
