import { is, check, uid as nextSagaId, wrapSagaDispatch } from './utils';
import proc from './proc';
import Scheduler from "./scheduler";

export function runSaga(iterator, _ref) {
  var subscribe = _ref.subscribe,
      dispatch = _ref.dispatch,
      getState = _ref.getState,
      sagaMonitor = _ref.sagaMonitor,
      logger = _ref.logger,
      onError = _ref.onError;


  check(iterator, is.iterator, "runSaga must be called on an iterator");

  var effectId = nextSagaId();
  if (sagaMonitor) {
    sagaMonitor.effectTriggered({ effectId: effectId, root: true, parentEffectId: 0, effect: { root: true, saga: iterator, args: [] } });
  }
  var task = proc(new Scheduler(), iterator, subscribe, wrapSagaDispatch(dispatch), getState, { sagaMonitor: sagaMonitor, logger: logger, onError: onError }, effectId, iterator.name);

  if (sagaMonitor) {
    sagaMonitor.effectResolved(effectId, task);
  }

  return task;
}