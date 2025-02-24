import { useState, useEffect, SetStateAction } from "react";
import { login, logout, checkAuth } from "../utils/auth";
import { getCookie, setCookie, deleteCookie } from "../utils/cookie";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // 在頁面加載時檢查 cookies
  useEffect(() => {
    const savedUsername = getCookie("username");
    const savedPassword = getCookie("password");
    if (savedUsername || savedPassword) {
      setUsername(savedUsername ?? '');
      setPassword(savedPassword ?? '');
      setRememberMe(true);
    }
  }, []);

  const onInputUserName = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    // 如果勾選 Remember Me，儲存帳號密碼到 cookies
    if (rememberMe) {
      setCookie("username", value, 7); // 儲存 7 天
    }
    setUsername(value)
  }

  const onInputPassword = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    // 如果勾選 Remember Me，儲存帳號密碼到 cookies
    if (rememberMe) {
      setCookie("password", value, 7); // 儲存 7 天
      setPassword(value)
    }
  }

  const onClickRemeberMe = () => {
    setRememberMe(!rememberMe)
  }

  const handleLogin = async () => {
    try {
      await login(username, password);
      const authData = await checkAuth();
      setUser(authData);

    } catch (error) {
      alert("Login failed");
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    deleteCookie("username");
    deleteCookie("password");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
        {user ? (
          <>
            <h2 className="text-center text-xl mb-4">Welcome, User {user.userId}</h2>
            <button
              className="w-full py-2 bg-red-500 text-white rounded-md"
              onClick={handleLogout}
            >
              登出
            </button>
          </>
        ) : (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <input
                className="w-full border border-gray-300 rounded-[4px] px-4 py-2"
                type="text"
                placeholder="Username"
                value={username}
                onChange={onInputUserName}
              />
            </div>
            <div>
              <input
                className="w-full border border-gray-300 rounded-[4px] px-4 py-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={onInputPassword}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={onClickRemeberMe}
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="w-full py-2 bg-lime-400 text-white rounded-md"
              onClick={handleLogin}
            >
              登入
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
