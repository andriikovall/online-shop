function addParam(key, value) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(key, value); 
    window.location.search = urlParams;
}

function deleteClicked() {
    const reply = confirm('Вы уверены?');
    return  reply; 
} 