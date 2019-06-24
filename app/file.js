function test(){
    const Http = new XMLHttpRequest();
    Http.open("GET", "json");
    Http.send();

    Http.onreadystatechange = function()  {
        if (this.readyState==4 && this.status==200){
            alert(this.responseText)
        }
    }
}