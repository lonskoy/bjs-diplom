'use strict'

const clickButton = new LogoutButton() ;    //Действие по нажатию кнопки Выход
clickButton.action = () => ApiConnector.logout(response => location.reload());
 

ApiConnector.current(response => {         //Загрузка информации об авторизованном пользователе
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const rBord = new RatesBoard();   //Обновление доски с курсами валют
function showBoard() { 
    ApiConnector.getStocks(response => {
        if(response.success) {
            rBord.clearTable();
            rBord.fillTable(response.data);
        }
    });
}
showBoard();
setInterval(showBoard, 1000);

const money = new MoneyManager();         //Пополнение счета
addMoney.addMoneyCallback = (data) => ApiConnector.addMoney(data, (response) => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
    money.setMessage(response.success, response.success ? 'Пополнение выполнено успешно' : response.error);
});

money.conversionMoneyCallback = (data) => ApiConnector.convertMoney(data, (response) => {  // Конвертация валют
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
    money.setMessage(response.success, response.success ? 'Конвертация выполнена успешно' : response.error);
});

money.sendMoneyCallback = (data) => ApiConnector.transferMoney(data, (response) => {  // Перевод денег
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
    money.setMessage(response.success, response.success ? 'Перевод выполнен успешно' : response.error);
});

const favorit = new FavoritesWidget();  //Начальный список избранного
ApiConnector.getFavorites((response) => {
    if(response.success) {
        favorit.clearTable();
        favorit.fillTable(response.data);
        money.updateUsersList(response.data);
    }
});

favorit.addUserCallback = (data) => {  //Добавление нового пользователя в избранное
    ApiConnector.addUserToFavorites(data, (reponse) => {
        if(response.success) {
            favorit.clearTable();
            favorit.fillTable(response.data);
            money.updateUsersList(reponse.data);
        }
        favorit.setMessage(response.success, response.success ? 'Добавление пользователя выполнено успешно' : response.error);
    });
}

favorit.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (reponse) => {
        if(response.success) {
            favorit.clearTable();
            favorit.fillTable(response.data);
            money.updateUsersList(reponse.data);
        }
        favorit.setMessage(response.success, response.success ? 'Удаление пользователя выполнено успешно' : response.error);
    });
}


