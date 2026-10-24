<script lang="ts">
  import { onMount } from 'svelte';

  let cash = $state(0);
  let cashPerClick = $state(0.25);
  let cashPerSec = $state(0.25);
  let multiplier = $state(1.15);
  let time = $state(1000);

  let timerId: ReturnType<typeof setInterval> | null = null;
  let isLoaded = $state(false);

  const fmt = (n: number) => Number(n.toFixed(2));

  function startTimer(): void {
    if (timerId !== null) {
      clearInterval(timerId);
    }
    timerId = setInterval(() => {
      cash += cashPerSec;
    }, time);
  }

  function stopTimer(): void {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function handleMainClick(): void {
    cash += cashPerClick;
  }

  // Resets total cash to 20% of the current total (retains 20%, removes 80%)
  function resetCashAfterUpgrade(): void {
    cash *= 0.20;
  }

  function handleCashPerClick(m: number): void {
    cashPerClick *= m;
    multiplier *= 1.15;
    resetCashAfterUpgrade();
  }

  function handleCashPerSec(m: number): void {
    cashPerSec *= m;
    multiplier *= 1.15;
    resetCashAfterUpgrade();
    startTimer();
  }

  function increaseMultiplier(amount: number): void {
    multiplier += amount;
    resetCashAfterUpgrade();
  }

  function speedUpTimer(): void {
    time *= 0.8;
    resetCashAfterUpgrade();
  }

  // Restarts the interval automatically when `time` changes while timer is active
  $effect(() => {
    if (timerId !== null) {
      startTimer();
    }
  });

  // Load saved state on component mount
  onMount(() => {
    const saved = localStorage.getItem('button_masher_save');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        cash = parsed.cash ?? 0;
        cashPerClick = parsed.cashPerClick ?? 0.25;
        cashPerSec = parsed.cashPerSec ?? 0.25;
        multiplier = parsed.multiplier ?? 1.15;
        time = parsed.time ?? 1000;
        if (parsed.isTimerRunning) {
          startTimer();
        }
      } catch (e) {
        console.error('Failed to parse save game:', e);
      }
    }
    isLoaded = true;
  });

  // Auto-save state to localStorage on state updates
  $effect(() => {
    if (!isLoaded) return;
    const saveData = {
      cash,
      cashPerClick,
      cashPerSec,
      multiplier,
      time,
      isTimerRunning: timerId !== null
    };
    localStorage.setItem('button_masher_save', JSON.stringify(saveData));
  });

  interface Upgrade {
    level: number;
    title: string;
    description: string;
    cost: number;
    action: () => void;
  }

  const upgrades: Upgrade[] = $derived([
    {
      level: 1,
      title: 'Level 1',
      description: 'Increase money/click',
      cost: 15,
      action: () => handleCashPerClick(multiplier)
    },
    {
      level: 2,
      title: 'Level 2',
      description: 'Increase money/sec',
      cost: 30,
      action: () => handleCashPerSec(multiplier)
    },
    {
      level: 3,
      title: 'Level 3',
      description: 'Increase multiplier by 5%',
      cost: 50,
      action: () => increaseMultiplier(0.05)
    },
    {
      level: 4,
      title: 'Level 4',
      description: 'Increase multiplier by 15%',
      cost: 100,
      action: () => increaseMultiplier(0.15)
    },
    {
      level: 5,
      title: 'Level 5',
      description: 'Speed up auto income',
      cost: 150,
      action: () => speedUpTimer()
    }
  ]);
</script>

<div class="game-container">
  <div class="stats">
    <p><strong>Cash:</strong> ${fmt(cash)}</p>
    <p><strong>Cash Per Click:</strong> {fmt(cashPerClick)}</p>
    <p><strong>Cash Per Sec:</strong> {fmt(cashPerSec)}</p>
    <p><strong>Multiplier:</strong> {fmt(multiplier)}x</p>
    <p><strong>Tick Interval:</strong> {fmt(time)} ms</p>
  </div>

  <div class="main-action">
    <button class="click-btn" onclick={handleMainClick}>Click Me!</button>
  </div>

  <div class="buttons">
    {#each upgrades as item (item.level)}
      <div class="btn-area">
        <div>
          <p class="title">{item.title}</p>
          <p class="desc">{item.description}</p>
        </div>
        <button
          class="power"
          disabled={cash <= item.cost}
          onclick={item.action}
        >
          {item.cost} cash
        </button>
      </div>
    {/each}
  </div>
</div>

<style>
  .game-container {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 400px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #f9fafb;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  .stats {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border: 1px solid #e5e7eb;

    p {
      margin: 0.25rem 0;
      color: #374151;
    }
  }

  .main-action {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;

    .click-btn {
      width: 100%;
      padding: 1rem;
      font-size: 1.25rem;
      font-weight: bold;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #1d4ed8;
      }
    }
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid #e5e7eb;

    .title {
      font-weight: 600;
      margin: 0;
      color: #111827;
      font-size: 0.9rem;
    }

    .desc {
      margin: 0;
      font-size: 0.8rem;
      color: #6b7280;
    }

    button.power {
      padding: 0.5rem 1rem;
      background: #16a34a;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;

      &:hover:not(:disabled) {
        background: #15803d;
      }

      &:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        opacity: 0.7;
      }
    }
  }
</style>