var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scheduler = function () {
  function Scheduler() {
    _classCallCheck(this, Scheduler);

    this._queue = [];
    /**
     Variable to hold a counting semaphore
     - Incrementing adds a lock and puts the scheduler in a `suspended` state (if it's not
     already suspended)
     - Decrementing releases a lock. Zero locks puts the scheduler in a `released` state. This
     triggers flushing the queued tasks.
     **/
    this._semaphore = 0;
  }

  /**
   Executes a task 'atomically'. Tasks scheduled during this execution will be queued
   and flushed after this task has finished (assuming the scheduler endup in a released
   state).
   **/


  _createClass(Scheduler, [{
    key: "exec",
    value: function exec(task) {
      try {
        this.suspend();
        task();
      } finally {
        this.flush();
      }
    }

    /**
     Executes or queues a task depending on the state of the scheduler (`suspended` or `released`)
     **/

  }, {
    key: "asap",
    value: function asap(task) {
      if (!this._semaphore) {
        this.exec(task);
      } else {
        this._queue.push(task);
      }
    }

    /**
     Puts the scheduler in a `suspended` state. Scheduled tasks will be queued until the
     scheduler is released.
     **/

  }, {
    key: "suspend",
    value: function suspend() {
      this._semaphore++;
    }

    /**
     Releases the current lock. Executes all queued tasks if the scheduler is in the released state.
     **/

  }, {
    key: "flush",
    value: function flush() {
      this._semaphore--;
      if (!this._semaphore && this._queue.length) {
        this.exec(this._queue.shift());
      }
    }
  }]);

  return Scheduler;
}();

export default Scheduler;