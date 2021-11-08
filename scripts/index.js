const menu_button_toggle = document.getElementById('menu-toggle'),
    button_wrapper = document.querySelector('.button-wrapper'),
    navigation = document.querySelector('.primary-navigation'),
    menu_state = { open: 'open', close: 'close' };
let button_class = menu_state.open;

button_wrapper.addEventListener('click', () => {
    if (menu_button_toggle.classList.contains(menu_state.open)) {
        menu_button_toggle.classList.remove(button_class);
        button_wrapper.classList.remove(button_class);
        navigation.classList.remove(button_class);
        button_class = menu_state.close;
    } else if (menu_button_toggle.classList.contains(menu_state.close)) {
        menu_button_toggle.classList.remove(button_class);
        button_wrapper.classList.remove(button_class);
        navigation.classList.remove(button_class);
        button_class = menu_state.open;
    }

    void menu_button_toggle.offsetWidth; // delays class modifications and makes them in batch mode for performance boost
    menu_button_toggle.classList.add(button_class);
    button_wrapper.classList.add(button_class);
    navigation.classList.add(button_class);
});