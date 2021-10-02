import { gsap } from "gsap";

const DOM = {
  enterCtrl: document.querySelector(".button"),
  enterText: document.querySelector(".button .button-text"),
  panel: document.querySelector(".panel"),
};

export class Animations {
  constructor(el) {
    this.DOM = { el: el };
    this.DOM.circleText = [...this.DOM.el.querySelectorAll(".text")];
    this.DOM.words = [...this.DOM.el.querySelectorAll(".word")].reverse();
    this.timelines = [];
    this.colors = ["#ffffff", "#DD0031", "#1273de", "#008D44"];
    this.originalColors = ["#48423c", "#272524"];
    this.words = this.DOM.words.length;
    this.wordsAnimation = 1;
    this.circleTextTotal = this.DOM.circleText.length;

    this.initialize();
  }

  initialize() {
    gsap.set(this.DOM.circleText, { transformOrigin: "50% 50%" });
    // gsap.set([this.DOM.circleText, DOM.enterCtrl, DOM.enterText, DOM.panel], {
    //   opacity: 0,
    // });
    gsap.set(DOM.enterCtrl, { pointerEvents: "none" });

    // rotate to make the highlights readable
    gsap.set(this.DOM.circleText[0], { rotate: 105 });
    gsap.set(this.DOM.circleText[1], { rotate: 85 });
  }

  addEvents() {
    this.enterClickEv = () => this.enter();
    gsap.to(DOM.enterText, {
      duration: 2,
      ease: "expo",
      opacity: 1,
    });
    DOM.enterCtrl.addEventListener("click", this.enterClickEv);
    gsap.set(DOM.enterCtrl, { pointerEvents: "auto" });
  }

  removeEvents() {
    DOM.enterCtrl.removeEventListener("click", this.enterClickEv);
  }

  start() {
    this.DOM.circleText.forEach((x, i) => {
      this.timelines.push(
        gsap.timeline().to(x, {
          duration: 30 - 2 * i * 3,
          ease: "linear",
          rotate: (i % 2 ? "-" : "+") + "=360",
          repeat: -1,
        })
      );
    });

    gsap.to([DOM.enterCtrl, this.DOM.circleText], {
      duration: 2,
      ease: "expo",
      startAt: { opacity: 0, scale: 1.5 },
      scale: 1,
      opacity: 1,
      stagger: {
        amount: -1.5,
      },
      onComplete: () => this.addEvents(),
    });

    this.DOM.words.forEach((x, i) => {
      gsap
        .timeline({
          repeat: -1,
          repeatDelay: this.wordsAnimation * (2 + this.words),
          delay: this.wordsAnimation * (2 + 2 * (i + 1)),
        })
        .to(x, {
          duration: this.wordsAnimation,
          fill: this.colors[i],
        })
        .to(x, {
          duration: this.wordsAnimation,
          fill: this.originalColors[i < 3 ? 0 : 1],
        })
        .restart(true);
    });
  }

  enter() {
    this.removeEvents();
    this.timelines.forEach((x) => x.kill());
    gsap.set(DOM.enterCtrl, { pointerEvents: "none" });

    gsap
      .timeline()
      .addLabel("enter", 0)
      .to(
        DOM.enterCtrl,
        {
          duration: 1.5,
          ease: "expo.inOut",
          scale: 0.4,
          opacity: 0,
        },
        0
      )
      .to(
        this.DOM.circleText,
        {
          duration: 1.5,
          ease: "expo.inOut",
          scale: (i) => 1.5 + (this.circleTextTotal - i) * 0.4,
          opacity: 0,
          stagger: {
            amount: 0.3,
          },
        },
        0
      )
      .to(
        DOM.panel,
        {
          duration: 1,
          ease: "power3.out",
          startAt: { opacity: 0, scale: 0.9 },
          scale: 1,
          opacity: 1,
        },
        "enter+=1"
      );
  }
}
