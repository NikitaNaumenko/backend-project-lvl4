module.exports = {
  translation: {
    entities: {
      user: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Дата создания',
        password: 'Пароль',
        firstName: 'Имя',
        lastName: 'Фамилия',
      },
      status: {
        name: 'Наименование',
      },
      label: {
        name: 'Наименование',
      },
      task: {
        name: 'Наименование',
        executor: 'Исполнитель',
        creator: 'Создатель',
        status: 'Статус',
        labels: 'Метки',
      },
    },
    appName: 'Backend Project level 4',
    flash: {
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        edit: {
          success: 'Пользователь успешно изменён',
          notAllowed: 'Вы не можете редактировать или удалять другого пользователя',
          error: 'Не удалось изменить пользователя',
        },
        delete: {
          success: 'Пользователь успешно удалён',
          notAllowed: 'Вы не можете редактировать или удалять другого пользователя',
          error: 'Не удалось удалить пользователя',
        },
      },
      sessions: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      statuses: {
        create: {
          success: 'Статус успешно создан',
          error: 'Не удалось сохранить статус',
        },
        edit: {
          success: 'Статус успешно изменён',
          error: 'Не удалось изменить статус',
        },
        delete: {
          success: 'Статус успешно удалён',
          error: 'Не удалось удалить статус',
        },
      },
      labels: {
        create: {
          success: 'Метка успешно создана',
          error: 'Не удалось сохранить метку',
        },
        edit: {
          success: 'Метка успешно изменена',
          error: 'Не удалось изменить метку',
        },
        delete: {
          success: 'Метка успешно удалена',
          error: 'Не удалось удалить метку',
        },
      },
      tasks: {
        create: {
          success: 'Задача успешно создана',
          error: 'Не удалось сохранить задачу',
        },
        edit: {
          success: 'Задача успешно изменён',
          error: 'Не удалось изменить задачу',
        },
        delete: {
          success: 'Задача успешно удалена',
          error: 'Не удалось удалить задачу',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        tasks: 'Задачи',
        labels: 'Метки',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      sessions: {
        new: {
          email: 'Email',
          password: 'Пароль',
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Дата создания',
        fullName: 'Полное имя',
        password: 'Пароль',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        index: {
          edit: 'Изменить',
          delete: 'Удалить',
        },
        edit: {
          header: 'Редактирование',
          submit: 'Изменить',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        index: {
          new: 'Создать статус',
          edit: 'Изменить',
          delete: 'Удалить',
        },
        new: {
          header: 'Создать статус',
          submit: 'Сохранить',
        },
        edit: {
          header: 'Редактировать статус',
          submit: 'Сохранить',
        },
      },
      tasks: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        status: 'Статус',
        creator: 'Создатель',
        executor: 'Исполнитель',
        index: {
          new: 'Создать таск',
          delete: 'Удалить',
          edit: 'Изменить',
          show: 'Показать',
          filter: {
            status: 'Статус',
            executor: 'Исполнитель',
            label: 'Метка',
            isCreator: 'Только мои задачи',
          },
        },
        new: {
          submit: 'Создать',
          header: 'Создать задачу',
        },
      },
      labels: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        index: {
          new: 'Создать метку',
          edit: 'Изменить',
          delete: 'Удалить',
        },
        new: {
          header: 'Создать метку',
          submit: 'Сохранить',
        },
        edit: {
          header: 'Редактировать метку',
          submit: 'Сохранить',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
