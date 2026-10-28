<script lang="ts">
  import { createGame } from './game.svelte';

  const game = createGame();
</script>

<div class="game-container">
  <div class="stats">
    <p><strong>Cash:</strong> ${game.fmt(game.cash)}</p>
    <p><strong>Cash Per Click:</strong> {game.fmt(game.cashPerClick)}</p>
    <p><strong>Cash Per Sec:</strong> {game.fmt(game.cashPerSec)}</p>
    <p><strong>Multiplier:</strong> {game.fmt(game.multiplier)}x</p>
    <p><strong>Tick Interval:</strong> {game.fmt(game.time)} ms</p>
  </div>

  <div class="main-action">
    <button class="click-btn" onclick={game.handleMainClick}>Click Me!</button>
  </div>

  <div class="buttons">
    {#each game.upgrades as item (item.level)}
      <div class="btn-area">
        <div>
          <p class="title">{item.title}</p>
          <p class="desc">{item.description}</p>
        </div>
        <button
          class="power"
          disabled={game.cash <= item.cost || item.purchased}
          onclick={item.action}
        >
          {item.purchased ? 'Owned' : `${item.cost} cash`}
        </button>
      </div>
    {/each}
  </div>
</div>

<style>
  .game-container {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 420px;
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
      min-width: 90px;
      text-align: center;

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