window.onload = main;

function main(){
    let name = document.getElementById("name")
    let surname = document.getElementById("surname")
    let email = document.getElementById("email")
    let phone_number = document.getElementById("phone_number")
    
    name.onchange = function(){
        if(name.length < 2){
            name.setCustomValidity("Names have at least two letters!")
        }
        
    }
}
