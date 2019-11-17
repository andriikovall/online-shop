# Головоломки

-  ```POST``` ```api/v1/puzzles/```
    
    Для запроса тело является обязательным
    Поля тела (* поле обязательное)
    - ```manufacturers```

        Масив ```_id``` производителей.  
        Если его нет, то делается поиск по всем производителям.  
    - ```types```

        Все тоже самое, что у ```manufacturers```, только поиск по типам.  
    - ```priceFrom``` и ```priceTo```

        Диапазон цен для поиска.  
        Можно передавать только один из параметров.  
    - ```limit``` ```offset```

        Параметры, которые используються для пагинации.  
        Дефолтные значения

        ```limit``` - 10

        ```offset``` - 0
    
    - ```name```

        Выборка елементов по подстроке с игнорированием регистра
    
    __Пример ответа__
    ```json
    {
        "count": 153, 
        "puzzles": [
            ...
        ]
    }
    ```
    __Пример ошибки__
    ```json
    {
        "error": {
            "message": "Limit and offset should be provided in request body"
        }
    }
    ```
    ```count``` - все головоломки по данному поиску.  
    ```puzzles``` - полученные головоломки. Количество равно значению ```limit``` в запросе ранее.

- ```GET api/v1/puzzles/all```

    __Возвращение всех головоломок__
    
    *Скорее всего скоро будет убрано*

    __Пример результата__
    ```json
    [
        {
        "name": "MoYu GuoGuan 3x3 YueXiao Pro black",
        "isAvailable": true,
        "isWCA": true,
        "description_md": "У владельца сайта точно такой же кубик и он просто прекрасен!!!",
        "_id": "5db8818fa41c622ca687bb61",
        "photoUrl": "https://res.cloudinary.com/webprogbase/image/upload/v1572372879/lymkomvrxf8agm6eeto0.jpg",
        "typeId": {
            "name": "3-3",
            "_id": "5dab4df10bfb184afe4d51fe",
            "__v": 0
        },
        "price": 500,
        "manufacturerId": {
            "name": "MoYu",
            "_id": "5dab34b65d4d1d3ea98ae5ea",
            "__v": 0
        },
        "lastModified": "2019-10-29T18:14:39.442Z",
        "__v": 0
        }, 
        {
            ...
        }
    ]
    ```

- ```GET api/v1/puzzles/:id```

    __Получение данных головоломки по ```id```__

    __Пример ответа__

    ```json
    {
        "name": "MoYu GuoGuan 3x3 YueXiao Pro black",
        "isAvailable": true,
        "isWCA": true,
        "description_md": "У владельца сайта точно такой же кубик и он просто прекрасен!!!",
        "_id": "5db8818fa41c622ca687bb61",
        "photoUrl": "https://res.cloudinary.com/webprogbase/image/upload/v1572372879/lymkomvrxf8agm6eeto0.jpg",
        "typeId": {
            "name": "3-3",
            "_id": "5dab4df10bfb184afe4d51fe",
            "__v": 0
        },
        "price": 500,
        "manufacturerId": {
            "name": "MoYu",
            "_id": "5dab34b65d4d1d3ea98ae5ea",
            "__v": 0
        },
        "lastModified": "2019-10-29T18:14:39.442Z",
        "__v": 0
    }
    ```

    При отсутствии головоломки вы получите ошибку __404__ и такой ответ

    ```javascript
    {
        status: 404, 
        message: `Puzzle with id ${puzzleId} not found`
    }
    ```

    При любой ошибке поиска головоломки по ```id``` вы получите данную ошибку

- ```DELETE api/v1/puzzles/:id```

    __Удаление головоломки по ```id```__

    __Требуються права менеджера либо администратора__ .  
    В ответе вы получите удаленную головоломку

- ```POST api/v1/puzzles/new/mp```

    Добавление новой головоломки. __Требуються права менеджера либо администратора__.  
    Тело запроса должно быть в формате ```multipart/form-data```

    Поля тела (* поле обязательное)
    
    - ```name```*
    - ```price``` 

        по-умолчанию 0
    - ```typeId```*
    - ```manufacturerId```*
    - ```isWCA```:
        
        по-умолчанию ```false```
    - ```file```

        Если поле пустое, то ставится дефолтный плейсхолдер
    - ```isAvailable```:  
    
        по-умолчанию ```false```
    - ```description_md```:  

        по-умолчанию пустая строка
    
    При успешном создании ответ 201 и созданная головоломка

- ```PATCH api/v1/puzzles/:id```

    __Требуються права менеджера либо администратора__

    Поля такие же как и в добавлении головоломки

- ```GET api/v1/puzzles/filters```

    __Получить список фильтров, то есть все типы и производители__

    __Пример ответа__
    ```json
    {
        "types": [
            {
                "index": 0,
                "value": "2-2",
                "_id": "5dab4df10bfb184afe4d51fd"
            }, 
            ...
        ],
        "manufacturers": [
            {
                "index": 0,
                "value": "GAN",
                "_id": "5dab34b65d4d1d3ea98ae5e9"
            },
            ...
        ]
    }
    ```
