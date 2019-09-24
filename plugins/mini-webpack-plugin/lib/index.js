function MiniWebpackPlugin () {

}

MiniWebpackPlugin.prototype.apply = function (compiler) {
    compiler.hooks.normalModuleFactory.tap('MiniWebpackPlugin', factory => {
        factory.hooks.parser.for('javascript/auto').tap('MiniWebpackPlugin', (parser, options) => {
            parser.hooks.program.tap('aa', (ast, comments) => {
                // console.log(ast)
                function digui(ast) {
                    if (Object.prototype.toString.call(ast) === '[object Object]') {
                        for (let key in ast) {
                            if (Object.prototype.toString.call(ast[key]) === '[object Object]') {
                                digui(ast[key]);
                            } else if (Object.prototype.toString.call(ast[key]) === '[object Array]') {
                                ast[key].forEach((item, key)=> {
                                    digui(item);
                                });
                            } else if (Object.prototype.toString.call(ast[key]) === '[object String]') {
                                if (ast[key] === 'wx') {
                                    console.log('修改成功')
                                    ast[key] = 'tt';
                                    console.log(key + ':' + ast[key])
                                }
                            }
                        }
                    } else if (Object.prototype.toString.call(ast) === '[object Array]') {
                        ast.forEach((item, key)=> {
                            digui(item);
                        });
                    }
                }
                digui(ast);
            })
        })
    })
}

module.exports = MiniWebpackPlugin;