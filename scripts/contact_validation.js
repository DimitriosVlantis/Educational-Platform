window.addEventListener('load', function(){
    let name = document.getElementById('txt_name');
    name.addEventListener('change', function(){
        console.log("The name is:" + name.value);
    })
})
