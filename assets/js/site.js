domready(function () {
	var preTags = document.getElementsByTagName('pre');
	for (var i = 0; i < preTags.length; i++)
	{
	    preTags[i].className = "prettyprint";
	}
	prettyPrint();
})