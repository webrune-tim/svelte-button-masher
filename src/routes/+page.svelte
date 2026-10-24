<script lang="ts">
  let points = $state(0)
  let pointsPerClick = $state(0.25)
  let pointsPerSec = $state(0.25)
  let multiplier = $state(1.5)
  let intervalStarted = false

  let timerId: ReturnType<typeof setInterval> | null = null;

  function handleMainClick(): void {
    points += pointsPerClick
  }

  function runEverySecond(): void {
    points = points + pointsPerSec
  }

  function startTimer(): void {
    if (timerId !== null) return; // Guard against double-starting
    
    timerId = setInterval(runEverySecond, 1000);
  }

  function stopTimer(): void {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null; // Reset handle after clearing
    }
  }

  function handlePointsPerClick(_multiplier: number): void {
    pointsPerClick *= _multiplier
    multiplier *= 1.5
    points -= points * 0.75
  }

  function handlePointsPerSec(_multiplier: number): void {
    pointsPerSec *= _multiplier
    multiplier *= 1.5
    points -= points * 0.75

    startTimer()
  }
</script>

<p>Points: {Number(points.toFixed(2))}</p>
<p>Points Per Click: {Number(pointsPerClick.toFixed(2))}</p>
<p>Points Per Sec: {Number(pointsPerSec.toFixed(2))}</p>
<p>Multiplier: {Number(multiplier.toFixed(2))}</p>

<div class="buttons">
  <button onclick={handleMainClick}>Click Me</button>

  <button
    class:deactive={points <= 15}
    disabled={points <= 15}
    onclick={() => handlePointsPerClick(multiplier)}
    class="power"
  >L1</button>

  <button 
    class:deactive={points <= 30} 
    disabled={points <= 30}
    onclick={() => handlePointsPerSec(multiplier)} 
    class="power"
  >L2</button>

  <button 
    class:deactive={points <= 50} 
    disabled={points <= 50}
    class="power"
  >L3</button>
</div>

<style>
  .buttons {
    display: flex;
    flex-direction: column;
    width: fit-content;

    button {
      margin: 0.5rem;
      padding: 0.5rem;
      background: green;
      color: contrast-color(green);
      border: none;
      border-radius: 0.5rem;

      &.deactive {
        background: red;
        color: contrast-color(red);
      }
    }
  }
</style>