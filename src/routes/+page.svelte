<script lang="ts">
  let cash = $state(0)
  let cashPerClick = $state(0.25)
  let cashPerSec = $state(0.25)
  let multiplier = $state(1.15)
  let time = $state(1000)

  let timerId: ReturnType<typeof setInterval> | null = null;

  function handleMainClick(): void {
    cash += cashPerClick
  }

  function runEverySecond(): void {
    cash = cash + cashPerSec
  }

  function startTimer(): void {
    if (timerId !== null) return; // Guard against double-starting
    
    timerId = setInterval(runEverySecond, time);
  }

  function stopTimer(): void {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null; // Reset handle after clearing
    }
  }

  function handleCashPerClick(_multiplier: number): void {
    cashPerClick *= _multiplier
    multiplier *= 1.15
    cash -= cash * 0.75
  }

  function handleCashPerSec(_multiplier: number): void {
    cashPerSec *= _multiplier
    multiplier *= 1.15
    cash -= cash * 0.75

    startTimer()
  }

  function increaseMultiplier (amount: number): void {
    multiplier += amount
  }

  function speedUpTimer(): void {
    time *= 0.8
  }
</script>

<p>Cash: {Number(cash.toFixed(2))}</p>
<p>Cash Per Click: {Number(cashPerClick.toFixed(2))}</p>
<p>Cash Per Sec: {Number(cashPerSec.toFixed(2))}</p>
<p>Multiplier: {Number(multiplier.toFixed(2))}</p>

<div class="buttons">
  <div class="btn-area">
    <button onclick={handleMainClick}>Click Me</button>
  </div>

  <div class="btn-area">
    <div>
      <p>Level 1</p>
      <p>Increase money/click</p>
    </div>
    
    <button
      class:deactive={cash <= 15}
      disabled={cash <= 15}
      onclick={() => handleCashPerClick(multiplier)}
      class="power"
    >15 cash</button>
  </div>

  <div class="btn-area">
    <div>
      <p>Level 2</p>
      <p>Increase money/sec</p>
    </div>
    
    <button 
      class:deactive={cash <= 30} 
      disabled={cash <= 30}
      onclick={() => handleCashPerSec(multiplier)} 
      class="power"
    >30 cash</button>
  </div>

  <div class="btn-area">
    <div>
      <p>Level 3</p>
      <p>Increase multiplier by 5%</p>
    </div>
    
    <button 
      class:deactive={cash <= 50} 
      disabled={cash <= 50}
      onclick={() => increaseMultiplier(0.05)}
      class="power"
    >50 cash</button>
  </div>

  <div class="btn-area">
    <div>
      <p>Level 4</p>
      <p>Increase multiplier by 15%</p>
    </div>
    
    <button 
      class:deactive={cash <= 100} 
      disabled={cash <= 100}
      onclick={() => increaseMultiplier(0.15)}
      class="power"
    >100 cash</button>
  </div>

  <div class="btn-area">
    <div>
      <p>Level 5</p>
      <p>Speed up auto income</p>
    </div>
    
    <button 
      class:deactive={cash <= 150} 
      disabled={cash <= 150}
      onclick={speedUpTimer}
      class="power"
    >150 cash</button>
  </div>
</div>

<style>
  .buttons {
    display: flex;
    gap: 1rem;
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

  .btn-area {
    display: flex;
    gap: 1rem;
  }
</style>