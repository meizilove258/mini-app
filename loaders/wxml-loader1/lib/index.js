const loaderUtils = require('loader-utils');
const fs = require('fs');

module.exports = function (content) {
    let callback = this.async();
    let options = loaderUtils.getOptions(this);
    var sax = require("sax"),
        strict = true, // set to false for html-mode
        parser = sax.parser(strict);
    var contentXml = '';
    var contentArray = [];
    parser.onerror = function (e) {
        // an error happened.
    };
    parser.ontext = function (t) {
        // got some text.  t is the string of text.
        // contentXml += t;
        contentArray.push(t);
    };
    parser.onopentag = function (node) {
        // opened a tag.  node has "name" and "attributes"
        // console.log(node)
        // contentXml += '<' + node.name;
        contentArray.push('<' + node.name);
        for (var key in node.attributes) {
            if (key === 'wx:if') {
                // contentXml += ' a:if'+'="' + node.attributes[key] + '"';
                contentArray.push(' a:if'+'="' + node.attributes[key] + '"');
            } else {
                // contentXml += ' ' + key +'="' + node.attributes[key] + '"';
                contentArray.push(' ' + key +'="' + node.attributes[key] + '"');
            }
        }
        // contentXml += '>';
        contentArray.push('>');
    };
    parser.onclosetag = function (tag) {
        // contentXml += '</' + tag + '>';
        contentArray.push('</' + tag + '>');
    }
    parser.onend = function () {
        // parser stream is done, and ready to have more stuff written to it.
        // console.log(contentXml);
        // console.log(contentArray.join(''));
        
        callback(null, contentArray.join(''));
    };

    parser.write(content).close();
}