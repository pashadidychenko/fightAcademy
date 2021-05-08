import { controls } from '../../constants/controls';

const {
  PlayerOneAttack,
  PlayerOneBlock,
  PlayerTwoAttack,
  PlayerTwoBlock,
  PlayerOneCriticalHitCombination,
  PlayerTwoCriticalHitCombination,
} = controls;

export async function fight(firstFighter, secondFighter) {
  const firstIndicator = document.getElementById('left-fighter-indicator');
  const secondIndicator = document.getElementById('right-fighter-indicator');

  let firstFighterHealth = firstFighter.health;
  let secondFighterHealth = secondFighter.health;

  let pressed = new Set();

  function getFighterHealth() {
    firstIndicator.style.width = (firstFighterHealth / firstFighter.health) * 100 + '%';
    secondIndicator.style.width = (secondFighterHealth / secondFighter.health) * 100 + '%';

    if (firstFighterHealth >= 0 && secondFighterHealth <= 0) {
      secondIndicator.style.width = '0%';
      return firstFighter;
    }
    if (firstFighterHealth <= 0 && secondFighterHealth >= 0) {
      firstIndicator.style.width = '0%';
      return secondFighter;
    }
    return false;
  }

  function handleKeyUnPress(e) {
    e.preventDefault();
    pressed.delete(e.code);
  }

  return new Promise((resolve) => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUnPress);
    function handleKeyPress(e) {
      e.preventDefault();
      pressed.add(e.code);
      let power = fightControls(pressed, firstFighter, secondFighter);
      secondFighterHealth = secondFighterHealth - getDamage(power[0].firstFighterHit, power[0].secondFighterBlock);
      firstFighterHealth = firstFighterHealth - getDamage(power[1].secondFighterHit, power[1].firstFighterBlock);
      getFighterHealth();
      if (getFighterHealth()) {
        document.removeEventListener('keydown', handleKeyPress);
        document.removeEventListener('keyup', handleKeyUnPress);
        resolve(getFighterHealth());
      }
    }
    // resolve the promise with the winner when fight is over
  });
}

export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
  if (damage <= 0) return 0;
  return damage;
  // return damage
}

export function getHitPower(fighter) {
  return fighter * (Math.random() * 2);
  // return hit power
}

export function getBlockPower(fighter) {
  return fighter * (Math.random() * 2);
  // return block power
}

let firstFighterHiPower = true;
let secondFighterHiPower = true;

function fightControls(keys, firstFighter, secondFighter) {
  const controllArr = [...keys];
  let firstFighterHit = 0;
  let firstFighterBlock = 0;
  let secondFighterHit = 0;
  let secondFighterBlock = 0;

  if (
    (firstFighterHiPower &&
      controllArr.includes(PlayerOneCriticalHitCombination[0]) &&
      controllArr.includes(PlayerOneCriticalHitCombination[1]) &&
      controllArr.includes(PlayerOneCriticalHitCombination[2])) ||
    (secondFighterHiPower &&
      controllArr.includes(PlayerTwoCriticalHitCombination[0]) &&
      controllArr.includes(PlayerTwoCriticalHitCombination[1]) &&
      controllArr.includes(PlayerTwoCriticalHitCombination[2]))
  ) {
    if (
      controllArr.includes(PlayerOneCriticalHitCombination[0]) &&
      controllArr.includes(PlayerOneCriticalHitCombination[1]) &&
      controllArr.includes(PlayerOneCriticalHitCombination[2]) &&
      controllArr.includes(PlayerTwoCriticalHitCombination[0]) &&
      controllArr.includes(PlayerTwoCriticalHitCombination[1]) &&
      controllArr.includes(PlayerTwoCriticalHitCombination[2])
    ) {
      firstFighterHiPower = false;
      secondFighterHiPower = false;
      firstFighterHit = getHitPower(firstFighter.attack * 2);
      secondFighterHit = getHitPower(secondFighter.attack * 2);
      setTimeout(() => {
        firstFighterHiPower = true;
        secondFighterHiPower = true;
      }, 10000);
      return [
        { firstFighterHit, secondFighterBlock },
        { secondFighterHit, firstFighterBlock },
      ];
    }
    if (
      controllArr.includes(PlayerOneCriticalHitCombination[0]) &&
      controllArr.includes(PlayerOneCriticalHitCombination[1]) &&
      controllArr.includes(PlayerOneCriticalHitCombination[2])
    ) {
      if (controllArr.includes(PlayerTwoAttack)) {
        secondFighterHit = getHitPower(secondFighter.attack);
      }
      firstFighterHiPower = false;
      firstFighterHit = getHitPower(firstFighter.attack * 2);
      setTimeout(() => {
        firstFighterHiPower = true;
      }, 10000);
      return [
        { firstFighterHit, secondFighterBlock },
        { secondFighterHit, firstFighterBlock },
      ];
    }
    if (
      controllArr.includes(PlayerTwoCriticalHitCombination[0]) &&
      controllArr.includes(PlayerTwoCriticalHitCombination[1]) &&
      controllArr.includes(PlayerTwoCriticalHitCombination[2])
    ) {
      if (controllArr.includes(PlayerOneAttack)) {
        firstFighterHit = getHitPower(firstFighter.attack);
      }
      secondFighterHiPower = false;
      secondFighterHit = getHitPower(secondFighter.attack * 2);
      setTimeout(() => {
        secondFighterHiPower = true;
      }, 10000);
      return [
        { firstFighterHit, secondFighterBlock },
        { secondFighterHit, firstFighterBlock },
      ];
    }
    return [
      { firstFighterHit, secondFighterBlock },
      { secondFighterHit, firstFighterBlock },
    ];
  }

  if (controllArr.includes(PlayerOneBlock) || controllArr.includes(PlayerTwoBlock)) {
    if (controllArr.includes(PlayerOneBlock) && controllArr.includes(PlayerTwoBlock)) {
      return [
        { firstFighterHit, secondFighterBlock },
        { secondFighterHit, firstFighterBlock },
      ];
    }
    if (controllArr.includes(PlayerOneBlock)) {
      firstFighterBlock = getBlockPower(firstFighter.defense);
    }
    if (controllArr.includes(PlayerTwoBlock)) {
      secondFighterBlock = getBlockPower(secondFighter.defense);
    }
    if (controllArr.includes(PlayerOneBlock) && controllArr.includes(PlayerTwoAttack)) {
      secondFighterHit = getHitPower(secondFighter.attack);
    }
    if (controllArr.includes(PlayerTwoBlock) && controllArr.includes(PlayerOneAttack)) {
      firstFighterHit = getHitPower(firstFighter.attack);
    }
    return [
      { firstFighterHit, secondFighterBlock },
      { secondFighterHit, firstFighterBlock },
    ];
  }

  if (controllArr.includes(PlayerOneAttack) || controllArr.includes(PlayerTwoAttack)) {
    if (controllArr.includes(PlayerOneAttack)) {
      firstFighterHit = getHitPower(firstFighter.attack);
    }
    if (controllArr.includes(PlayerTwoAttack)) {
      secondFighterHit = getHitPower(secondFighter.attack);
    }
    return [
      { firstFighterHit, secondFighterBlock },
      { secondFighterHit, firstFighterBlock },
    ];
  }

  return [
    { firstFighterHit, secondFighterBlock },
    { secondFighterHit, firstFighterBlock },
  ];
}
