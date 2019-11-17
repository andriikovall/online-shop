# Корзина

__Только авторизированный пользователь может полуть доступ к корзине и при условии, что она присвоена именно ему__

- ```GET api/v1/carts/:id```

    Получить корзину по ```id```

    __Пример результата__

    ```json 
    {
    "_id": "5dac70af9071af3291596ae0",
    "puzzles": [
        {
            "count": 1,
            "_id": "5dac737c5857f733fa671069",
            "puzzle": {
                "name": "YuXin Little Magic 7x7 stickerless",
                ...
            }
        }, 
        {
            ...
        }
    ],
    "user": {
        "role": "manager",
        "avaUrl": "https://res.cloudinary.com/webprogbase/image/upload/v1572702761/photo_2019-07-20_15-56-09_xp07px.jpg",
        ...
    },
        "__v": 0
    }
    ```


- ```POST api/v1/carts/remove/:puzzleId```

    Удаление одной головоломки с корзины. Данные про корзину берутся с авторизированного пользователя, по этому не нужно поле ```id``` для корзины.  
    Возвращает обновленную корзину

- ```POST api/v1/carts/insert/:puzzleId```

    __Добавление одной головоломки в корзину__
    
    Возвращает обновленную корзину

Пример ответа ```insert``` и ```remove```

```json
{
    "cart": {
        "_id": "5dcd5d0a0dde6a3c2affcccd",
        "puzzles": [
            {
                "count": 2,
                "_id": "5dcd5eebffad213df90f29a2",
                "puzzle": "5daf6977261065355540e997"
            }
        ],
        "user": "5dc2fb8771e9c47a5117685a",
        "__v": 0
    }
}
```