function getElementsByClassName(className, parent) {
    var oParent = parent ? document.getElementById("parent") : document;
    var oLis = oParent.getElementsByTagName("*");
    return [].filter.call(oLis, function(e) {
        return e.classList.contains(className);
    });
} 	