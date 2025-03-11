export const scaleFactor = 2.3;

export const dialogueData = {
  quiz1: {
    type: "quiz",
    question: "🧸 + 🧸 = ?",
    options: [
      { text: "🧸 🧸", correct: true },
      { text: "🧸", correct: false },
      { text: "🧸 🧸 🎁", correct: false },
      { text: "🎁 🎁", correct: false },
    ],
    correctMessage: "Correct! Nice job!",
    wrongMessage: "Wrong answer! Try again.",
  },
  quiz2: `That's my TV. I've been watching tech youtubers a lot recently like :
   <a href="https://www.youtube.com/@ThePrimeTimeagen" target="_blank">Theprimeagen</a>, <a href="https://www.youtube.com/@t3dotgg" target="_blank">Theo - t3.gg</a>,
  <a href="https://www.youtube.com/@PirateSoftware" target="_blank">PirateSoftware</a> (sometimes) and <a href="https://www.youtube.com/@MelkeyDev" target="_blank">Melkey</a>!`,
  bed: `This where I sleep. Great ideas comes when I'm lying on my bed. When an idea strikes, I often have to write it down or else I won't be able to sleep because my mental energy is consumed by it.`,
  resume: `This is my desk and on it is my resume. <a href="https://github.com/JSLegendDev/Resume/blob/main/JSLegend%20Resume-1.pdf" target="_blank">Check it out?</a>
  Contact me at jslegend@protonmail.com if you have any interesting job opportunities!`,
  projects: `Info about this portfolio : It's made with the Kaboom.js library which is a library for making games in JavaScript.
  Text is rendered with HTML/CSS. So the textbox you're currently reading is not rendered within canvas. Learn more about how to use
  Kaboom.js by watching some of my tutorials <a href="https://youtube.com/@jslegenddev" target="_blank">here</a>.`,
  library: `There are a lot of programming books on my shelves. There is even one in French (I also speak French btw).
  I probably only read one of them. Who else compulsively buys technical books without ever finishing them?`,
  exit: `If you want to exit JSLegendDev's portfolio, just close the tab.`,
};
