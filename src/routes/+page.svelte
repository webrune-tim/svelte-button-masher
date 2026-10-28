<script lang="ts">
  import { createGame } from './game.svelte';

  const game = createGame();

  // Floating click feedback items
  let floatingTexts = $state<{ id: number; text: string; x: number; y: number }[]>([]);
  let nextId = 0;

  function handleMainClick(e: MouseEvent) {
    game.handleMainClick();

    // Spawn floating cash text at click coordinates
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = nextId++;
    floatingTexts = [...floatingTexts, { id, text: `+${game.fmt(game.cashPerClick)}`, x, y }];

    setTimeout(() => {
      floatingTexts = floatingTexts.filter(item => item.id !== id);
    }, 800);
  }
</script>

<div class="game-container">
  <div class="stats">
    <div class="stat-main">
      <span class="label">Total Cash</span>
      <h2 class="cash-display">${game.fmt(game.cash)}</h2>
    </div>
    <div class="stat-grid">
      <div class="stat-item">
        <span class="label">Per Click</span>
        <span class="value">{game.fmt(game.cashPerClick)}</span>
      </div>
      <div class="stat-item">
        <span class="label">Per Sec</span>
        <span class="value">{game.fmt(game.cashPerSec)}</span>
      </div>
      <div class="stat-item">
        <span class="label">Multiplier</span>
        <span class="value">{game.fmt(game.multiplier)}x</span>
      </div>
      <div class="stat-item">
        <span class="label">Tick Rate</span>
        <span class="value">{game.fmt(game.time)}ms</span>
      </div>
    </div>
  </div>

  <div class="main-action">
    <button class="click-btn" onclick={handleMainClick}>
      <span>CLICK ME!</span>
      {#each floatingTexts as ft (ft.id)}
        <span class="floating-text" style="left: {ft.x}px; top: {ft.y}px;">{ft.text}</span>
      {/each}
    </button>
  </div>

  <div class="buttons">
    {#each game.upgrades as item (item.level)}
      {@const progress = Math.min(100, (game.cash / item.cost) * 100)}
      {@const affordable = game.cash > item.cost && !item.purchased}
      <div class="btn-area" class:affordable>
        <div class="info">
          <p class="title">{item.title}</p>
          <p class="desc">{item.description}</p>
        </div>
        <button
          class="power"
          disabled={game.cash <= item.cost || item.purchased}
          onclick={item.action}
        >
          {item.purchased ? 'OWNED' : `${item.cost} CASH`}
        </button>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: {item.purchased ? 100 : progress}%"></div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .game-container {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 440px;
    margin: 2rem auto;
    padding: var(--gap);
    background: var(--bg-trans);
    border: 1px solid rgb(from var(--text) r g b / 0.1);
    border-radius: 16px;
    box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    backdrop-filter: blur(8px);
  }

  .stats {
    background: var(--bg-trans);
    padding: 1.25rem;
    border-radius: 12px;
    margin-bottom: var(--gap);
    border: 1px solid rgb(from var(--text) r g b / 0.05);

    .stat-main {
      text-align: center;
      margin-bottom: 1rem;
      
      .label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        opacity: 0.7;
      }

      .cash-display {
        font-size: 2.25rem;
        font-weight: 800;
        color: var(--accent);
        font-variant-numeric: tabular-nums;
      }
    }

    .stat-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;

      .stat-item {
        background: rgb(from var(--text) r g b / 0.04);
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
        display: flex;
        flex-direction: column;

        .label {
          font-size: 0.7rem;
          opacity: 0.6;
        }

        .value {
          font-weight: 600;
          font-size: 0.9rem;
        }
      }
    }
  }

  .main-action {
    display: flex;
    justify-content: center;
    margin-bottom: var(--gap);

    .click-btn {
      position: relative;
      overflow: hidden;
      width: 100%;
      padding: 1.25rem;
      font-size: 1.35rem;
      font-weight: 900;
      letter-spacing: 0.05em;
      color: var(--white);
      background: linear-gradient(135deg, var(--accent), hsl(from var(--accent) h s calc(l - 15%)));
      border: none;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgb(from var(--accent) r g b / 0.4);
      transition: transform 0.1s ease, filter 0.2s ease;

      &:hover {
        filter: brightness(1.1);
      }

      &:active {
        transform: scale(0.97);
      }

      .floating-text {
        position: absolute;
        pointer-events: none;
        font-size: 1rem;
        font-weight: 800;
        color: #4ade80;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transform: translate(-50%, -50%);
        animation: floatUp 0.8s ease-out forwards;
      }
    }
  }

  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translate(-50%, 0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -40px) scale(1.2);
    }
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-area {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-trans);
    border: 1px solid rgb(from var(--text) r g b / 0.08);
    border-radius: 10px;
    padding: 0.85rem 1rem;
    transition: border-color 0.2s ease;

    &.affordable {
      border-color: rgb(from var(--accent) r g b / 0.4);
    }

    .info {
      z-index: 1;
      .title {
        font-weight: 700;
        font-size: 0.9rem;
      }

      .desc {
        font-size: 0.75rem;
        opacity: 0.7;
      }
    }

    button.power {
      z-index: 1;
      padding: 0.5rem 1rem;
      background: #16a34a;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.8rem;
      letter-spacing: 0.02em;
      transition: background 0.2s, transform 0.1s;
      min-width: 95px;
      text-align: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);

      &:hover:not(:disabled) {
        background: #15803d;
        transform: translateY(-1px);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        background: rgb(from var(--text) r g b / 0.15);
        color: rgb(from var(--text) r g b / 0.4);
        cursor: not-allowed;
        box-shadow: none;
      }
    }

    .progress-bar-container {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: transparent;

      .progress-bar {
        height: 100%;
        background: var(--accent);
        transition: width 0.3s ease;
        opacity: 0.7;
      }
    }
  }
</style>