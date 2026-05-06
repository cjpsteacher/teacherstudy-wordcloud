import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  projectId: "teacherstudy-5252e",
  appId: "1:803643070911:web:c963b217f94d5b62c9a90a",
  storageBucket: "teacherstudy-5252e.firebasestorage.app",
  apiKey: "AIzaSyBPoUgzCE9_LIdJbBOauq98GvJ8rnNJiMI",
  authDomain: "teacherstudy-5252e.firebaseapp.com",
  messagingSenderId: "803643070911"
};

const palette = ["#0f766e", "#d65a31", "#2563eb", "#b7791f", "#7c3aed", "#be123c", "#15803d"];
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const wordsRef = collection(db, "wordcloud_words");

const form = document.querySelector("#wordForm");
const input = document.querySelector("#wordInput");
const statusEl = document.querySelector("#status");
const totalCountEl = document.querySelector("#totalCount");
const uniqueCountEl = document.querySelector("#uniqueCount");
const emptyState = document.querySelector("#emptyState");
const svg = d3.select("#cloud");

let currentWords = [];

function cleanWord(value) {
  return value.replace(/\s+/g, " ").trim().slice(0, 24);
}

function aggregateWords(docs) {
  const counts = new Map();
  docs.forEach((doc) => {
    const text = cleanWord(doc.data().text || "");
    if (!text) return;
    counts.set(text, (counts.get(text) || 0) + 1);
  });

  return [...counts.entries()]
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text, "zh-Hant"))
    .slice(0, 80);
}

function drawCloud(words) {
  const stage = document.querySelector(".cloud-stage");
  const rect = stage.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width));
  const height = Math.max(360, Math.floor(rect.height));

  svg.attr("viewBox", `0 0 ${width} ${height}`);
  svg.selectAll("*").remove();
  emptyState.hidden = words.length > 0;

  if (!words.length) return;

  const maxCount = Math.max(...words.map((word) => word.count));
  const minSize = width < 520 ? 18 : 20;
  const maxSize = width < 520 ? 54 : 78;
  const size = d3.scaleSqrt().domain([1, maxCount]).range([minSize, maxSize]);

  d3.layout.cloud()
    .size([width, height])
    .words(words.map((word, index) => ({
      text: word.text,
      size: size(word.count),
      count: word.count,
      color: palette[index % palette.length]
    })))
    .padding(7)
    .rotate(() => (Math.random() > 0.82 ? 90 : 0))
    .font('"Noto Sans TC", "Microsoft JhengHei", sans-serif')
    .fontWeight((word) => word.count > 1 ? 900 : 700)
    .fontSize((word) => word.size)
    .on("end", (layoutWords) => {
      svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("text")
        .data(layoutWords)
        .join("text")
        .style("font-family", '"Noto Sans TC", "Microsoft JhengHei", sans-serif')
        .style("font-weight", (word) => word.count > 1 ? 900 : 700)
        .style("font-size", (word) => `${word.size}px`)
        .style("fill", (word) => word.color)
        .style("cursor", "default")
        .attr("text-anchor", "middle")
        .attr("transform", (word) => `translate(${word.x},${word.y}) rotate(${word.rotate})`)
        .text((word) => word.text)
        .append("title")
        .text((word) => `${word.text}: ${word.count}`);
    })
    .start();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = cleanWord(input.value);

  if (!text) {
    statusEl.textContent = "請先輸入一個詞。";
    input.focus();
    return;
  }

  const button = form.querySelector("button");
  button.disabled = true;
  statusEl.textContent = "送出中...";

  try {
    await addDoc(wordsRef, {
      text,
      createdAt: serverTimestamp()
    });
    input.value = "";
    statusEl.textContent = "已加入文字雲。";
  } catch (error) {
    console.error(error);
    statusEl.textContent = "寫入失敗，請確認 Firestore 規則與網路連線。";
  } finally {
    button.disabled = false;
    input.focus();
  }
});

const cloudQuery = query(wordsRef, orderBy("createdAt", "desc"), limit(300));
onSnapshot(cloudQuery, (snapshot) => {
  currentWords = aggregateWords(snapshot.docs);
  totalCountEl.textContent = String(snapshot.docs.length);
  uniqueCountEl.textContent = String(currentWords.length);
  statusEl.textContent = snapshot.docs.length ? "資料庫同步中。" : "已連接，等待第一個詞。";
  drawCloud(currentWords);
}, (error) => {
  console.error(error);
  statusEl.textContent = "讀取失敗，請確認 Firebase 設定。";
});

window.addEventListener("resize", () => {
  window.clearTimeout(window.cloudResizeTimer);
  window.cloudResizeTimer = window.setTimeout(() => drawCloud(currentWords), 150);
});
