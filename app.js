import { db } from "./firebase.js";
import { collection, addDoc, getDocs, serverTimestamp, orderBy, query } 
from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const postBtn = document.getElementById("postBtn");
const postInput = document.getElementById("postInput");
const postList = document.getElementById("postList");


// 게시물 작성
postBtn.addEventListener("click", async () => {
    const text = postInput.value.trim();
    if (text === "") return alert("내용을 입력하세요");

    try {
        await addDoc(collection(db, "posts"), {
            text: text,
            createdAt: serverTimestamp()
        });

        postInput.value = "";
        loadPosts(); // 새로고침 없이 즉시 반영
    } catch (err) {
        console.error(err);
    }
});


// 게시물 불러오기
async function loadPosts() {
    postList.innerHTML = "불러오는 중...";

    const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    postList.innerHTML = ""; // 초기화

    snapshot.forEach(doc => {
        const data = doc.data();

        // 작성 시간이 없으면 '방금 전'
        const time = data.createdAt ? 
                     data.createdAt.toDate().toLocaleString() : 
                     "방금 전";

        const div = document.createElement("div");
        div.classList.add("postItem");

        div.innerHTML = `
            <p class="postText">${data.text}</p>
            <span class="postTime">${time}</span>
            <hr>
        `;

        postList.appendChild(div);
    });
}

// 처음 사이트 들어오면 자동으로 불러오기
loadPosts();
