
export default class Scheduler {
  
  constructor() {

    this._queue = []
    /**
     Variable to hold a counting semaphore
     - Incrementing adds a lock and puts the scheduler in a `suspended` state (if it's not
     already suspended)
     - Decrementing releases a lock. Zero locks puts the scheduler in a `released` state. This
     triggers flushing the queued tasks.
     **/
    this._semaphore = 0
  }
  
  /**
   Executes a task 'atomically'. Tasks scheduled during this execution will be queued
   and flushed after this task has finished (assuming the scheduler endup in a released
   state).
   **/
  exec(task) {
    try {
        this.suspend()
        task()
    } finally {
        this.flush()
    }
  }

  /**
   Executes or queues a task depending on the state of the scheduler (`suspended` or `released`)
   **/
  asap(task) {
    if(!this._semaphore) {
        this.exec(task)
    } else {
        this._queue.push(task)
    }
  }

  /**
   Puts the scheduler in a `suspended` state. Scheduled tasks will be queued until the
   scheduler is released.
   **/
  suspend() {
    this._semaphore++
  }

  /**
   Releases the current lock. Executes all queued tasks if the scheduler is in the released state.
   **/
  flush() {
    this._semaphore--
    if(!this._semaphore && this._queue.length) {
        this.exec(this._queue.shift())
    }
  }
}
