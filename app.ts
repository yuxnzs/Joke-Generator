const main: HTMLElement | null = document.querySelector(".main");
const p: HTMLElement | null = document.querySelector("#content");
const tempMsg: HTMLElement | null = document.querySelector(".temp-msg");
const loader: HTMLElement | null = document.querySelector(".loader");

// get joke when page loads
document.addEventListener("DOMContentLoaded", getJoke);

// 點擊笑話時，將笑話複製到剪貼簿
let canCopy: boolean = true;
// p? 表示 p 可能是 null，如果是 null 就不會執行 addEventListener
p?.addEventListener("click", () => {
  if (canCopy) {
    navigator.clipboard.writeText(p.innerText).then(() => {
      if (!tempMsg) return;
      tempMsg.innerText = "Copied to clipboard";
      tempMsg.style.display = "block";
      setTimeout(() => {
        tempMsg.style.display = "none";
      }, 2000);
      canCopy = false;
      setTimeout(() => {
        canCopy = true;
      }, 3000);
    });
  }
});

// 每隔 3 秒才能再點擊
let canGetJoke: boolean = true;
main?.addEventListener("click", (e) => {
  // 如果點擊的不是 main（點擊 p 標籤，如使用者選取笑話）
  // 就不做任何事
  if (e.target !== e.currentTarget) {
    return;
  }
  if (canGetJoke) {
    getJoke();
    canGetJoke = false;
    main.style.cursor = "not-allowed";
    // 3 秒後才能再點擊
    setTimeout(() => {
      canGetJoke = true;
      main.style.cursor = "pointer";
    }, 3000);
  }
});

async function getJoke(): Promise<void> {
  try {
    // 下面有多個 p，所以使用 !p 而不是一段一段檢查
    if (!p) return;
    p.innerText = "Loading...";

    // 將原本隱藏的 loader 顯示出來
    if (!loader) return;
    loader.style.display = "block";

    const response: Response = await fetch(
      "https://v2.jokeapi.dev/joke/Programming?type=single"
    );
    if (!response.ok) {
      throw new Error("Cannot fetch the joke, please try again later.");
    }
    const data = await response.json();
    p.innerText = data.joke;
  } catch (e) {
    if (!p) return;
    p.innerText = "Cannot fetch the joke, please try again later.";
  } finally {
    // 無論成功或失敗，最後都隱藏 loader
    if (!loader) return;
    loader.style.display = "none";
  }
}
