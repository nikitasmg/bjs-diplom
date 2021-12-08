'use strict'
const userForm = new UserForm();

//Логинем пользователя
userForm.loginFormCallback = data => {
        ApiConnector.login(data, answer => {
            if (answer.success) {
                location.reload();
            } else {
                userForm.setLoginErrorMessage(answer.error);
            }
        })
    }
    //Регистрируем пользователя

userForm.registerFormCallback = data => {

    ApiConnector.register(data, answer => {
        if (answer.success) {
            location.reload();
        } else {
            console.error(userForm.setRegisterErrorMessage(answer.error));
        }
    })
}