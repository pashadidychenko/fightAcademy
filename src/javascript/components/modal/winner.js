import { showModal } from './modal';
import { createFighterImage } from '../fighterPreview';
import App from '../../app';

export function showWinnerModal(fighter) {
  const title = `${fighter.name} - The WINNER`;
  const bodyElement = createFighterImage(fighter);
  const root = document.getElementById('root');
  function startNewGame() {
    root.innerHTML = '';
    new App();
  }

  showModal({ title, bodyElement, onClose: () => startNewGame() });
  // call showModal function
}
