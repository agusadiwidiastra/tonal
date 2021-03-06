
/*
 Precise scheduling for audio events is
 based on the method described in this article by Chris Wilson:
   http://www.html5rocks.com/en/tutorials/audio/scheduling/
*/

module.exports = function (ctx) {

  var lookahead = 25.0 // ms
  var scheduleAheadTime = 0.1 // s

  var tempo // ticks per minute

  var tickInterval // seconds per tick

  var data = []

  var currentTick = 0
  var nextTickTime = 0

  var tick = function (t, d, i) {}
  var each = function (t, i) {}

  var iterations = 0
  var limit = 0

  var timer
  var running = false

  function loop () {}

  function nextTick () {
    nextTickTime += tickInterval

    // cycle through ticks
    if (++currentTick >= data.length) {
      currentTick = 0
      iterations += 1
    }

  }

  function scheduleTick (tickNum, time) {
    tick.call(loop, time, data[tickNum], tickNum)
  }

  function scheduleIteration (iterationNum, time) {
    each.call(loop, time, iterationNum)
  }

  function scheduler () {
    while (nextTickTime < ctx.currentTime + scheduleAheadTime) {
      scheduleTick(currentTick, nextTickTime)
      if (currentTick === 0) {
        scheduleIteration(iterations, nextTickTime)
      }
      nextTick()
      if (limit && iterations >= limit) {
        loop.reset()
        return
      }
    }
    timer = window.setTimeout(scheduler, lookahead)
  }

  loop.tempo = function (bpm) {
    if (!arguments.length) return tempo
    tempo = bpm
    tickInterval = 60 / tempo
    return loop
  }
  loop.tickInterval = function (s) {
    if (!arguments.length) return tickInterval
    tickInterval = s
    tempo = 60 / tickInterval
    return loop
  }
  loop.data = function (a) {
    if (!arguments.length) return data
    data = a
    return loop
  }
  loop.lookahead = function (ms) {
    if (!arguments.length) return lookahead
    lookahead = ms
    return loop
  }
  loop.scheduleAheadTime = function (s) {
    if (!arguments.length) return scheduleAheadTime
    scheduleAheadTime = s
    return loop
  }
  loop.limit = function (n) {
    if (!arguments.length) return limit
    limit = n
    return loop
  }
  loop.tick = function (f) {
    if (!arguments.length) return tick
    tick = f
    return loop
  }
  loop.each = function (f) {
    if (!arguments.length) return each
    each = f
    return loop
  }
  loop.start = function (t) {
    running = true
    nextTickTime = t || ctx.currentTime
    scheduler()
    return loop
  }
  loop.stop = function () {
    window.clearTimeout(timer)
    running = false
    return loop
  }
  loop.reset = function () {
    currentTick = 0
    iterations = 0
    return loop
  }
  loop.running = function () {
    return running
  }

  return loop
}
