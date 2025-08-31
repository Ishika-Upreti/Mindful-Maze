import React, { useState, useEffect } from "react";

// motivational / health messages
const messages = [
  "💧 Stay hydrated, drink some water!",
  "🌿 Take a deep breath and relax.",
  "😊 Smile! It boosts your mood.",
  "🚶 Get up and stretch your legs.",
  "☀️ Look outside and enjoy the sunlight.",
  "🍎 Eat something healthy today.",
  "🧘 Take 2 minutes to meditate.",
  "📖 Read a page of a good book.",
  "🎶 Listen to your favorite song.",
  "❤️ Call or text a loved one.",
  "😴 Don’t forget to rest properly.",
  "💡 Learn one new thing today.",
  "🎯 Focus on one thing at a time.",
  "💪 Your health is your wealth.",
  "🤝 Be kind to yourself today.",
  "🌻 Step outside and breathe fresh air.",
  "📵 Take a short digital detox.",
  "🍫 Treat yourself, but in balance!",
  "📝 Write down something you’re grateful for.",
  "🌟 Believe in yourself, you got this!"
];

// quizzes (large pool)
const quizPool = [
  { q: "💧 How much water should an average adult drink daily?", o: ["1-2 glasses", "5-6 glasses", "7-8 glasses", "12+ glasses"], a: "7-8 glasses" },
  { q: "😴 How many hours of sleep is recommended for adults?", o: ["3-4 hours", "5-6 hours", "7-9 hours", "10-12 hours"], a: "7-9 hours" },
  { q: "🍎 Which vitamin is most abundant in oranges?", o: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], a: "Vitamin C" },
  { q: "🧘 What activity helps reduce stress the most?", o: ["Scrolling social media", "Meditation", "Eating sweets", "Watching TV"], a: "Meditation" },
  { q: "🚶 How many steps per day are generally recommended for health?", o: ["2,000", "5,000", "10,000", "20,000"], a: "10,000" },
  { q: "🥦 Which is a rich source of iron?", o: ["Spinach", "Milk", "Rice", "Sugar"], a: "Spinach" },
  { q: "☀️ Which vitamin do we mostly get from sunlight?", o: ["Vitamin B", "Vitamin C", "Vitamin D", "Vitamin K"], a: "Vitamin D" },
  { q: "🫀 Which organ pumps blood throughout the body?", o: ["Lungs", "Brain", "Heart", "Kidneys"], a: "Heart" },
  { q: "⚡ Which nutrient is the main source of energy?", o: ["Proteins", "Carbohydrates", "Fats", "Vitamins"], a: "Carbohydrates" },
  { q: "🧂 Eating too much salt mainly increases risk of?", o: ["Diabetes", "High blood pressure", "Cancer", "Asthma"], a: "High blood pressure" },
  { q: "🍫 Which mineral is found in dark chocolate?", o: ["Calcium", "Magnesium", "Zinc", "Iron"], a: "Magnesium" },
  { q: "🦷 Which vitamin helps keep your teeth and bones strong?", o: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"], a: "Vitamin D" },
];

// Function to generate maze with solvable path
const generateMaze = (size) => {
  let maze, hasPath;

  // BFS to check if path exists
  const pathExists = (grid, size) => {
    const visited = Array.from({ length: size }, () => Array(size).fill(false));
    const queue = [[0, 0]];
    const directions = [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    while (queue.length) {
      const [x, y] = queue.shift();
      if (x === size - 1 && y === size - 1) return true;
      for (let [dx, dy] of directions) {
        const nx = x + dx, ny = y + dy;
        if (
          nx >= 0 && ny >= 0 &&
          nx < size && ny < size &&
          !visited[ny][nx] &&
          grid[ny][nx] === 0
        ) {
          visited[ny][nx] = true;
          queue.push([nx, ny]);
        }
      }
    }
    return false;
  };

  do {
    maze = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => (Math.random() < 0.25 ? 1 : 0))
    );
    maze[0][0] = 0;
    maze[size - 1][size - 1] = 0;
    hasPath = pathExists(maze, size);
  } while (!hasPath);

  return maze;
};

export default function App() {
  const [size, setSize] = useState(5);
  const [maze, setMaze] = useState(generateMaze(5));
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState("");
  const [quizList, setQuizList] = useState([...quizPool]); // copy pool
  const [quiz, setQuiz] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleKeyDown = (e) => {
    if (message || quiz) return;
    let { x, y } = player;
    if (e.key === "ArrowUp" && y > 0 && maze[y - 1][x] === 0) y--;
    if (e.key === "ArrowDown" && y < size - 1 && maze[y + 1][x] === 0) y++;
    if (e.key === "ArrowLeft" && x > 0 && maze[y][x - 1] === 0) x--;
    if (e.key === "ArrowRight" && x < size - 1 && maze[y][x + 1] === 0) x++;

    setPlayer({ x, y });

    if (x === size - 1 && y === size - 1) {
      if (level < 10) {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setMessage(`🎉 Congratulations! Level ${level} complete! 🎉\n${randomMsg}`);
      } else {
        setMessage("🏆 You finished all 10 levels! Amazing work! 🏆");
      }
    }
  };

  const startQuiz = () => {
    if (quizList.length === 0) return; // no more quizzes
    const idx = Math.floor(Math.random() * quizList.length);
    const randomQuiz = quizList[idx];
    const updatedList = [...quizList];
    updatedList.splice(idx, 1);
    setQuizList(updatedList);
    setQuiz(randomQuiz);
    setMessage("");
    setFeedback("");
  };

  const handleAnswer = (option) => {
    if (option === quiz.a) {
      setFeedback("✅ Correct! Great job!");
    } else {
      setFeedback("❌ Oops! Try again.");
    }
  };

  const nextLevel = () => {
    const newSize = size + 1;
    setSize(newSize);
    setMaze(generateMaze(newSize));
    setPlayer({ x: 0, y: 0 });
    setLevel(level + 1);
    setQuiz(null);
    setFeedback("");
  };

  const retryLevel = () => {
    setMaze(generateMaze(size));
    setPlayer({ x: 0, y: 0 });
    setQuiz(null);
    setFeedback("");
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="game" tabIndex={0}>
      <h1> Mindful Maze </h1>
      <h2>Level {level}</h2>

      <div className="grid">
        {maze.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, colIndex) => {
              const isPlayer = player.x === colIndex && player.y === rowIndex;
              const isGoal = rowIndex === size - 1 && colIndex === size - 1;
              return (
                <div
                  key={colIndex}
                  className={`cell 
                    ${isPlayer ? "player" : ""} 
                    ${isGoal ? "goal" : ""} 
                    ${cell === 1 ? "wall" : ""}`}
                >
                  {isPlayer ? "🧍🏼‍♀️" : isGoal ? "👏🏻" : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Motivational message box */}
      {message && (
        <div className="message-box">
          <p>{message}</p>
          {level < 10 && <button onClick={startQuiz}>Take Quiz 📝</button>}
        </div>
      )}

      {/* Quiz box */}
      {quiz && (
        <div className="quiz-box">
          <h3>{quiz.q}</h3>
          {quiz.o.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(opt)}>
              {opt}
            </button>
          ))}
          {feedback && <p>{feedback}</p>}
          {feedback === "✅ Correct! Great job!" && (
            <button onClick={nextLevel}>Next Level ➡️</button>
          )}
          {feedback === "❌ Oops! Try again." && (
            <button onClick={retryLevel}>Retry Level 🔄</button>
          )}
        </div>
      )}

      {!message && !quiz && <p>Use arrow keys to move! Reach the goal!</p>}
    </div>
  );
}
