function getPagesCount(fullItemsCount, pageSize) {
    return Math.ceil(fullItemsCount/pageSize);
}

function getArrayOfPageIndexes(pagesCount) { 
    try {
        let pages = new Array(pagesCount).fill(1);
        pages = pages.map((value, index) => ({index: index + 1}));
        return pages;
    } catch (err) {
        return [];
    }
}

function getScippedItemsCount(pageNum, pageSize) {
    return (pageNum - 1) * pageSize;
}

function trimPageNum(pageNum, fullItemsCount, pageSize) {
    const pagesCount = getPagesCount(fullItemsCount, pageSize);
    if (pageNum > pagesCount) 
        pageNum = pagesCount;
    if (pageNum <= 0) 
        pageNum = 1;

    return pageNum;
}

module.exports = {getArrayOfPageIndexes, getPagesCount, getScippedItemsCount, trimPageNum};