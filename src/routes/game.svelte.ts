import { onMount } from 'svelte'

export function createGame() {
  let cash = $state(0)
  let cashPerClick = $state(0.25)
  let cashPerSec = $state(0.25)
  let multiplier = $state(1.15)
  let time = $state(1000)

  let autoClickL1 = $state(false)
  let autoClickL2 = $state(false)
  let autoClickL3 = $state(false)
  let autoPurchaserIntervalTime = $state(1000)

  let timerId: ReturnType<typeof setInterval> | null = null
  let autoPurchaserId: ReturnType<typeof setInterval> | null = null
  let isLoaded = $state(false)

  const fmt = (n: number) => Number(n.toFixed(2))

  function startTimer(): void {
    if (timerId !== null) {
      clearInterval(timerId)
    }
    timerId = setInterval(() => {
      cash += cashPerSec
    }, time)
  }

  function handleMainClick(): void {
    cash += cashPerClick
  }

  function resetCashAfterUpgrade(): void {
    cash *= 0.2
  }

  function handleCashPerClick(m: number): void {
    cashPerClick *= m
    multiplier *= 1.15
    resetCashAfterUpgrade()
  }

  function handleCashPerSec(m: number): void {
    cashPerSec *= m
    multiplier *= 1.15
    resetCashAfterUpgrade()
    startTimer()
  }

  function increaseMultiplier(amount: number): void {
    multiplier += amount
    resetCashAfterUpgrade()
  }

  function speedUpTimer(): void {
    time *= 0.8
    resetCashAfterUpgrade()
  }

  function unlockAutoClickL1(): void {
    autoClickL1 = true
    resetCashAfterUpgrade()
    startAutoPurchaser()
  }

  function unlockAutoClickL2(): void {
    autoClickL2 = true
    resetCashAfterUpgrade()
    startAutoPurchaser()
  }

  function unlockAutoClickL3(): void {
    autoClickL3 = true
    resetCashAfterUpgrade()
    startAutoPurchaser()
  }

  function speedUpAutoPurchasers(): void {
    autoPurchaserIntervalTime *= 0.9
    resetCashAfterUpgrade()
    startAutoPurchaser()
  }

  function canAfford(cost: number): boolean {
    return cash > cost
  }

  function startAutoPurchaser(): void {
    if (autoPurchaserId !== null) {
      clearInterval(autoPurchaserId)
    }
    autoPurchaserId = setInterval(() => {
      const l1Cost = 200
      const l2Cost = 350
      const l3Cost = 500

      if (autoClickL3 && canAfford(l3Cost)) {
        increaseMultiplier(0.05)
      } else if (autoClickL2 && canAfford(l2Cost)) {
        handleCashPerSec(multiplier)
      } else if (autoClickL1 && canAfford(l1Cost)) {
        handleCashPerClick(multiplier)
      }
    }, autoPurchaserIntervalTime)
  }

  // Lifecycle & Effects
  $effect(() => {
    if (timerId !== null) {
      startTimer()
    }
  })

  $effect(() => {
    if (autoClickL1 || autoClickL2 || autoClickL3) {
      startAutoPurchaser()
    }
  })

  onMount(() => {
    const saved = localStorage.getItem('button_masher_save')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        cash = parsed.cash ?? 0
        cashPerClick = parsed.cashPerClick ?? 0.25
        cashPerSec = parsed.cashPerSec ?? 0.25
        multiplier = parsed.multiplier ?? 1.15
        time = parsed.time ?? 1000
        autoClickL1 = parsed.autoClickL1 ?? false
        autoClickL2 = parsed.autoClickL2 ?? false
        autoClickL3 = parsed.autoClickL3 ?? false
        autoPurchaserIntervalTime = parsed.autoPurchaserIntervalTime ?? 1000
        if (parsed.isTimerRunning) {
          startTimer()
        }
      } catch (e) {
        console.error('Failed to parse save game:', e)
      }
    }
    isLoaded = true
  })

  $effect(() => {
    if (!isLoaded) return
    const saveData = {
      cash,
      cashPerClick,
      cashPerSec,
      multiplier,
      time,
      autoClickL1,
      autoClickL2,
      autoClickL3,
      autoPurchaserIntervalTime,
      isTimerRunning: timerId !== null,
    }
    localStorage.setItem('button_masher_save', JSON.stringify(saveData))
  })

  const upgrades = $derived([
    {
      level: 1,
      title: 'Level 1',
      description: 'Increase money/click',
      cost: 15,
      action: () => handleCashPerClick(multiplier),
    },
    {
      level: 2,
      title: 'Level 2',
      description: 'Increase money/sec',
      cost: 30,
      action: () => handleCashPerSec(multiplier),
    },
    {
      level: 3,
      title: 'Level 3',
      description: 'Increase multiplier by 5%',
      cost: 50,
      action: () => increaseMultiplier(0.05),
    },
    {
      level: 4,
      title: 'Level 4',
      description: 'Increase multiplier by 15%',
      cost: 100,
      action: () => increaseMultiplier(0.15),
    },
    {
      level: 5,
      title: 'Level 5',
      description: 'Speed up auto income',
      cost: 150,
      action: () => speedUpTimer(),
    },
    {
      level: 6,
      title: 'Level 6',
      description: 'Auto-click Level 1 every 1s',
      cost: 200,
      purchased: autoClickL1,
      action: () => unlockAutoClickL1(),
    },
    {
      level: 7,
      title: 'Level 7',
      description: 'Auto-click Level 2 every 1s',
      cost: 350,
      purchased: autoClickL2,
      action: () => unlockAutoClickL2(),
    },
    {
      level: 8,
      title: 'Level 8',
      description: 'Auto-click Level 3 every 1s',
      cost: 500,
      purchased: autoClickL3,
      action: () => unlockAutoClickL3(),
    },
    {
      level: 9,
      title: 'Level 9',
      description: 'Make auto-purchasers 10% faster',
      cost: 750,
      action: () => speedUpAutoPurchasers(),
    },
  ])

  return {
    get cash() {
      return cash
    },
    get cashPerClick() {
      return cashPerClick
    },
    get cashPerSec() {
      return cashPerSec
    },
    get multiplier() {
      return multiplier
    },
    get time() {
      return time
    },
    get upgrades() {
      return upgrades
    },
    fmt,
    handleMainClick,
  }
}
