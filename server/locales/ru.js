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
      task: {
        name: 'Наименование',
        executor: 'Исполнитель',
        creator: 'Создатель',
        status: 'Статус',
      },
    },
    appName: 'Backend Project level 4',
    flash: {
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
          success: 'Статус успешно изменен',
          error: 'Не удалось изменить статус',
        },
        delete: {
          success: 'Статус успешно удален',
          error: 'Не удалось удалить статус',
        },
      },
      tasks: {
        create: {
          success: 'Задача успешно создана',
          error: 'Не удалось сохранить задачу',
        },
        edit: {
          success: 'Задача успешно изменен',
          error: 'Не удалось изменить задачу',
        },
        delete: {
          success: 'Задача успешно удален',
          error: 'Не удалось удалить задачу',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        edit: {
          notAllowed: 'Вы не можете редактировать или удалять другого пользователя',
          error: 'Не удалось обновить',
        },
        delete: {
          error: 'Не удалось удалить',
          success: 'Пользователь успешно удален',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        tasks: 'Задачи',
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
          submit: 'Сохранить',

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
        },
        new: {
          submit: 'Сохранить',
          header: 'Создать задачу',
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
