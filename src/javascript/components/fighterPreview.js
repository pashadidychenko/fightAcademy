import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  if(fighter) {
  const fighterImage = createFighterImage(fighter);
  const fighterInfo = createFighterInfo(fighter)
  fighterElement.append(fighterImage, fighterInfo);
};

  
  return fighterElement;
  // todo: show fighter info (image, name, health, etc.)
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}

export function createFighterInfo(fighter) {
  const {name, attack, defense, health } = fighter;
  const fighterElement = createElement({
    tagName: 'div',
    className: 'fighter-preview___info',
  });

  fighterElement.innerText = `Name: ${name}, Attack: ${attack}, Defense: ${defense}, Health: ${health}`;

  return fighterElement;
}
