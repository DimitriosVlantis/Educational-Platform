window.addEventListener('load', function(){
    let name = document.getElementById('txt_name');
    let surname = document.getElementById('txt_surname');
    let email = document.getElementById('txt_email');
    let phone_number = document.getElementById('txt_phone_nub');
    let theme = document.getElementById('slt_theme');
    let question = document.getElementById('txt_question');
    let btn_submit = document.getElementById('btn_submit');

    name.addEventListener('change', function(){
        for(let j=0; j<name.value.length; j++){
            if( !(/[a-z]/i.test(name.value[j])) ){
                name.setCustomValidity("Names contain only letters!");
                break;
            }
        }
    })
    surname.addEventListener('change', function(){
        for(let j=0; j<surname.value.length; j++){
            if( !(/[a-z]/i.test(surname.value[j])) ){
                name.setCustomValidity("Surnames contain only letters!");
                break;
            }
        }
    })
    email.addEventListener('change', function(){
        let pattern = /([a-z]|[0-9])*@[a-z]*\.[a-z]*/i;
        if(!pattern.test(email.value)){
            email.setCustomValidity("Emails should be like 'JackSparrow@gmail.com'!");
        }
    })
    phone_number.addEventListener('change', function(){
        if(phone_number.value.length != 10){
            phone_number.setCustomValidity("Phone numbers have ten digits!");
        }
        if(!(/[0-9]*/.test(phone_number.value))){
            phone_number.setCustomValidity("Phone numbers contain only numbers!");
        }
    })
})
