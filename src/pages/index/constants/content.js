import {SPLITTER} from "@shared";

export default {
  notFound: {
    error: "404",
    button: {
      text: "На главную",
      isDisposable: true
    }
  },
  error: {
    seconds: 5,
    message: `ОШИБКА! Reload ${SPLITTER}с.`
  },
  loading: {
    background: {
      src: "app/loading.png"
    }
  }
};
