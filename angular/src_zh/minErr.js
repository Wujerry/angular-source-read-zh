'use strict';

/**
 * @描述
 *
 * 这个对象提供一个在angular中打印详细错误信息的工具。
 * 使用示例如下：
 *
 * var exampleMinErr = minErr('example');  // 调用minErr() , 返回一个Error对象
 * throw exampleMinErr('one', 'This {0} is {1}', foo, bar);  // 抛出错误
 *
 * 上面的代码在 example 命名空间下创建了一个minErr的实例。抛出的错误在
 * 命名空间 example.one 下，第二个参数错误信息中的{0}和{1}会被后面的参数依次替换，
 * 替换的参数数量没有限制。
 *
 * 如果参数少于模板中定义的数量，多余的标记不会被替换。
 *
 * 由于在build步骤中数据被静态传递，所有minErr的实例的创建和调用必须要遵循一定
 * 的限制。minErr实例在创建时必须要有命名空间(如: minErr('namespace'))。
 * 错误代码、命名空间和模板字符串必须是静态的，不能是变量或者一般的表达式。
 *
 * @param {string} module 命名空间
 * @param {function} ErrorConstructor 自定义错误构造对象
 * @returns {function(code:string, template:string, ...templateArgs): Error} minErr 实例
 */

function minErr(module, ErrorConstructor) {
  ErrorConstructor = ErrorConstructor || Error;
  return function() {
    var SKIP_INDEXES = 2;  //大写常量  好习惯

    var templateArgs = arguments,
        code = templateArgs[0],
        message = '[' + (module ? module + ':' : '') + code + '] ',
        template = templateArgs[1],
        paramPrefix, i;

    message += template.replace(/\{\d+\}/g, function(match) {
      //用 + 来转换match为String ,避免调用slice方法出错，slice方法的参数为负数，代表从字符串的尾巴倒着数
      var index = +match.slice(1, -1),
          shiftedIndex = index + SKIP_INDEXES;

      if (shiftedIndex < templateArgs.length) {
        //  toDebugString方法在stringify.js中，后面再看
        return toDebugString(templateArgs[shiftedIndex]);
      }

      return match;
    });

    message += '\nhttp://errors.angularjs.org/"NG_VERSION_FULL"/' +
        (module ? module + '/' : '') + code;

    //paramPrefix在循环初定义为 '?' , 之后变为'&' , 又学到了
    for (i = SKIP_INDEXES, paramPrefix = '?'; i < templateArgs.length; i++, paramPrefix = '&') {
      message += paramPrefix + 'p' + (i - SKIP_INDEXES) + '=' +
          encodeURIComponent(toDebugString(templateArgs[i]));
    }

    return new ErrorConstructor(message);
  };
}