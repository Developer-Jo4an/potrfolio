import {SPLITTER} from "@shared";

export default {
  notFound: {
    error: "404",
    button: {
      text: "На главную",
      isDisposable: true,
    },
  },
  error: {
    seconds: {
      prod: 5,
      dev: 99999,
    },
    message: `ОШИБКА! Reload ${SPLITTER}с.`,
  },
  loading: {
    background: {
      src: "app/loading.png",
      width: 1600,
      height: 900,
      quality: 50,
    },
  },
};
