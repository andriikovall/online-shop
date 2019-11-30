module.exports.escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
module.exports.getEscapedRegExp = (string) => new RegExp(this.escapeRegExp(string), 'i');