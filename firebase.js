<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
    import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

    // --- 1. 請在此處替換為你自己的 Firebase 配置 ---
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "XXXX",
        appId: "XXXX"
    };

    // 初始化 Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // --- 2. 獲取原本 HTML 的 DOM 元素 ---
    // (這裡保留你原本代碼中定義的 allDOMElements, 變數, 以及所有 UI 邏輯)
    // ... 這裡省略你原本龐大的 users 資料表，因為現在改用 Firebase 驗證 ...

    document.addEventListener('DOMContentLoaded', () => {
        const allDOMElements = {
            loginContainer: document.getElementById('login-container'),
            appContainer: document.getElementById('app-container'),
            usernameInput: document.getElementById('username-input'),
            passwordInput: document.getElementById('password-input'),
            loginBtn: document.getElementById('login-btn'),
            loginError: document.getElementById('login-error'),
            logoutBtn: document.getElementById('logout-btn'),
            displayUsername: document.getElementById('display-username'),
            timerDisplay: document.getElementById('timer'),
            // ... 其餘你原本定義的所有 DOM 元素 ...
        };

        // --- 3. Firebase 認證監聽 ---
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // 使用者已登入
                showApp(user.email.split('@')[0]); // 顯示帳號名稱
                loadFirebaseData(user.uid);       // 從 Firebase 抓取成績
            } else {
                // 使用者未登入
                showLogin();
            }
        });

        // --- 4. 修改登入邏輯 ---
        async function handleLogin() {
            const email = allDOMElements.usernameInput.value;
            const password = allDOMElements.passwordInput.value;
            
            // 為了符合 Firebase，如果使用者只輸入帳號，幫他加上 dummy domain
            const fullEmail = email.includes('@') ? email : `${email}@timer.com`;

            try {
                allDOMElements.loginError.textContent = '登入中...';
                await signInWithEmailAndPassword(auth, fullEmail, password);
            } catch (error) {
                allDOMElements.loginError.textContent = '登入失敗：' + error.message;
            }
        }

        async function handleLogout() {
            await signOut(auth);
        }

        // --- 5. Firebase 資料讀取/儲存 ---
        async function saveToFirebase() {
            const user = auth.currentUser;
            if (user) {
                await setDoc(doc(db, "users", user.uid), {
                    times: times, // 儲存你原本的 times 陣列
                    settings: settings
                });
            }
        }

        // 監聽登入按鈕
        allDOMElements.loginBtn.onclick = handleLogin;
        allDOMElements.logoutBtn.onclick = handleLogout;

        // --- 保留你原本所有的計時器邏輯 (start, stop, tick, generateScramble...) ---
        // 只要在每次成績更新 (例如 stop() 函式最後) 呼叫 saveToFirebase() 即可。
    });
</script>