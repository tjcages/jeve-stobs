import gsap from "gsap";
import SplitType from "split-type";

import { Animation } from "./anim";
import { anim } from "./config";

/*
 * Titles
 */

export class Text extends Animation {
  constructor(element) {
    super(element);
    this.element = element;
    this.animated = splitLines(this.element);
  }

  animIn(delay) {
    console.log(delay);
    if (this.animation) this.animation.kill();

    this.animation = gsap.to(this.animated, {
      y: "0%",
      duration: anim.in.duration,
      ease: anim.in.ease,
      delay: anim.in.delay + delay,
      stagger: {
        each: anim.in.stagger,
        from: anim.in.from,
      },
    });
  }

  animOut() {
    if (this.animation) this.animation.kill();

    return new Promise((resolve) => {
      this.animation = gsap.to(this.animated, {
        y: "210%",
        duration: anim.out.duration * 0.5,
        ease: anim.out.ease,
        delay: anim.out.delay,
        stagger: {
          each: anim.out.stagger * 0.2,
          from: anim.out.from,
        },
        onComplete: resolve,
      });
    });
  }

  setIn() {
    if (this.animation) this.animation.kill();

    gsap.set(this.animated, {
      y: "0%",
      duration: 0,
    });
  }

  setOut() {
    if (this.animation) this.animation.kill();

    gsap.set(this.animated, {
      y: "210%",
      duration: 0,
    });
  }

  /* -- Lifecycle */
  animOutAndClear() {
    this.stop();
    this.animOut();
  }
}

/*
 * Splits
 */

export class Char extends Text {
  constructor(element) {
    super(element);
    this.element = element;
    this.animated = splitChars(this.element);
  }
}

export class Word extends Text {
  constructor(element) {
    super(element);
    this.element = element;
    this.animated = splitWords(this.element);
  }
}

export class Line extends Text {
  constructor(element) {
    super(element);
    this.element = element;
    this.animated = splitLines(this.element);
  }
}

export function animateIn(type, target, delay = 0) {
  const id = `[animate=${target}]`;
  const elements = [...document.querySelectorAll(id)];
  elements.map((item) => {
    switch (type) {
      case "char":
        const char = new Char(item);
        char.setOut();
        char.animIn(delay);
        return char;
      case "word":
        const word = new Word(item);
        word.setOut();
        word.animIn(delay);
        return word;
      case "line":
        const line = new Line(item);
        line.setOut();
        line.animIn(delay);
        return line;
      default:
        const wordDefault = new Word(item);
        wordDefault.setOut();
        wordDefault.animIn(delay);
        return wordDefault;
    }
  });
}

export function animateOut(type, target) {
  const id = `[animate=${target}]`;
  const elements = [...document.querySelectorAll(id)];
  elements.map((item) => {
    switch (type) {
      case "char":
        const char = new Char(item);
        char.setIn();
        char.animOut();
        return char;
      case "word":
        const word = new Word(item);
        word.setIn();
        word.animOut();
        return word;
      case "line":
        const line = new Line(item);
        line.setIn();
        line.animOut();
        return line;
      default:
        const wordDefault = new Word(item);
        wordDefault.setIn();
        wordDefault.animOut();
        return wordDefault;
    }
  });
}

/*
 * Utils
 */

const splitChars = (el) => {
  return new SplitType(el, { types: "chars" }).chars;
};

const splitWords = (el) => {
  return new SplitType(el, { types: "words" }).words;
};

const splitLines = (el) => {
  return new SplitType(el, { types: "lines" }).lines;
};
