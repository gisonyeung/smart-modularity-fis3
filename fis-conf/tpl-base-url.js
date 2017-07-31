/*
 * 将模板里的资源路径转换为相对路径
 * created by gisonyang on 2017/07/31
 */

module.exports = function(baseurl) {
	return function(content, file) {

		var path = file.toString().replace(fis.project.getProjectPath() + '/', '')
		var layerDiff = getCharOccourTime(path.replace(baseurl, ''), '/') - 1;

		content = content
			.replace(/(\"|\')\.\.\//g, '"' + '../'.repeat(layerDiff + 1))
			.replace(/(\"|\')\.\//g, '"' + '../'.repeat(layerDiff));

		return content;
	}
};


function getCharOccourTime(str, char) {
	return Math.max(str.split(char).length - 1, 0);
}