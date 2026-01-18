import {MODAL} from "../../../constants/names";
import {createStore} from "../../../../../../shared/model/src/state-manager/createStore";
import {createId} from "../../../../../../shared/lib/src/patterns/closure/createId";
import getActiveModals from "../../../lib/getActiveModals";

const getId = createId();

const {useStore: useModalStore} = createStore({
  name: MODAL,
  state: {
    modals: []
  },
  syncActions: {
    add({state, returned}, {type, animation, isCloseOnBackground = false, isQueue = true, props = {}} = {}) {
      const id = getId();

      state.modals = [...state.modals, {type, id, isCloseOnBackground, animation, isQueue, props}];

      returned.value = {id};
    },
    close({state}, {id}) {
      const necessaryFunction = {
        all() {
          state.modals = [];
        },
        active() {
          const activeModals = getActiveModals(state.modals);
          state.modals = state.modals.filter(modalData => !activeModals.includes(modalData));
        },
        default() {
          state.modals = state.modals.filter(({id: modalId}) => modalId !== id);
        }
      };

      (necessaryFunction[id] ?? necessaryFunction.default)();
    }
  }
});

export default useModalStore;


