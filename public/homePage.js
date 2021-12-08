'use strict'
//Выход из личного кабинета
const logoutButton = new LogoutButton();

logoutButton.action = () => {
    ApiConnector.logout(el => {
        if (el.success) {
            location.reload();
        }
    })
};

//Запрос о текущем пользователе
ApiConnector.current(user => {
    if (user.data) {
        ProfileWidget.showProfile(user.data);
    }
});


const ratesBoard = new RatesBoard();
// Запрос текущей информации о валюте
function getCurrentStocks() {
    ApiConnector.getStocks(stocks => {
        if (stocks.data) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(stocks.data);
        }
    });
};
//Синхронный вызов
getCurrentStocks();
//Асинхронный вызов функции о цене
setInterval(getCurrentStocks, 6000);


// Операции с деньгами


//Пополнение баланса
const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = data => ApiConnector.addMoney(data, answer => {
    if (answer.success) {
        ProfileWidget.showProfile(answer.data);
    }
    moneyManager.setMessage(answer.success, answer.success ? `Пополнение на сумму ${data.amount} ${data.currency} успешно произведено!` : answer.error);
});

//Конвертация валюты

moneyManager.conversionMoneyCallback = data => ApiConnector.convertMoney(data, (answer) => {
    if (answer.success) {
        ProfileWidget.showProfile(answer.data);
    }
    moneyManager.setMessage(answer.success, answer.success ? (`Конвертация из ${data.fromAmount}  ${data.fromCurrency}  в ${data.targetCurrency} успешно произведено!`) : answer.error);

});

//Перевод валюты 

moneyManager.sendMoneyCallback = data => ApiConnector.transferMoney(data, answer => {
    if (answer.success) {
        ProfileWidget.showProfile(answer.data);
    }
    moneyManager.setMessage(answer.success, answer.success ? `Перевод ${data.amount} ${data.currency} пользователю с id ${data.to} успешно произведено!` : answer.error);
})


//Работа с избранным 

const favoritesWidget = new FavoritesWidget();

//Запрос на начальный список избранного

ApiConnector.getFavorites(answer => {
    if (answer.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(answer.data);
        moneyManager.updateUsersList(answer.data);
    }
});

//Добавление нового пользователя 

favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, answer => {
        if (answer.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(answer.data);
            moneyManager.updateUsersList(answer.data);
        }
        favoritesWidget.setMessage(answer.success, answer.success ? `Ползователь ${data.name} добавлен в адрессную книгу!` : answer.error);
    })
};

//Удаление из избранного 

favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, answer => {
        if (answer.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(answer.data);
            moneyManager.updateUsersList(answer.data);
        }
        favoritesWidget.setMessage(answer.success, answer.success ? `Ползователь успешно удален из адрессной книги!` : answer.error);
    })
}