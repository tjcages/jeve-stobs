import { useState, useEffect } from "react";
import styles from "../styles/subtitles.module.scss";

const queues = [
  {
    timing: 0,
  },
  {
    text: "[crowd cheering]",
    timing: 0.5,
  },
  {
    text: "Introducing ...",
    timing: 2,
  },
  {
    text: "JEVE STOBS",
    timing: 3.5,
  },
  {
    text: "Jeve: This is a day ...",
    timing: 6,
  },
  {
    text: "... a product comes along",
    timing: 9,
  },
  {
    text: "thats",
    timing: 12,
  },
  {
    text: "not so smart",
    timing: 13,
  },
  {
    text: "not so easy to use",
    timing: 15,
  },
  {
    text: "and we are calling it",
    timing: 17,
  },
  {
    text: "the Phone",
    timing: 19,
  },
  {
    text: "[crowd cheering]",
    timing: 21,
  },
  {
    text: "Jeve: So ...",
    timing: 23,
  },
  {
    text: "a giant screen",
    timing: 25,
  },
  {
    text: "with a revolutionary",
    timing: 27,
  },
  {
    text: "screen",
    timing: 29,
  },
  {
    text: "and on this screen",
    timing: 31,
  },
  {
    text: "are things",
    timing: 33,
  },
  {
    text: "so many things ...",
    timing: 35,
  },
  {
    text: "[crowd cheering]",
    timing: 37,
  },
];

export default function _() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const el = document.getElementById("text");
    const fx = new TextScramble(el);

    const cycle = () => {
      queues.forEach((queue, i) => {
        setTimeout(() => {
          if (queue.text) {
            setHide(false);
            fx.setText(queue.text);
          } else {
            setHide(true);
          }
        }, queue.timing * 1000);
      });
    };

    cycle();
  }, []);

  return (
    <div className={styles.main} style={{ opacity: hide ? 0 : 1 }}>
      <div className={styles.content}>
        <h5 id="text" />
      </div>
    </div>
  );
}

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }

  hideText() {
    this.el.innerText = "";
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class=${styles.dud}>${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}
