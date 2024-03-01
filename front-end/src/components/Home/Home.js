import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { useAuth } from "../../utils/auth";

function Home() {
  const [snowfallData, setSnowfallData] = useState([]);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSnowfallData = async () => {
      try {
        const token = await auth.getSession(); // 获取认证会话信息
        const accessToken = token.access.token; // 假设access token存储在access.token中

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/snowfall`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 添加Authorization头
          },
        });

        setSnowfallData(response.data.snowfallData);
      } catch (error) {
        console.error("Failed to fetch snowfall data", error);
        // 如果请求因认证失败而出错，可以重定向到登录页面
        if (error.response && error.response.status === 401) {
          auth.logout(); // 清除认证状态
          navigate("/login"); // 重定向到登录页
        }
      }
    };

    fetchSnowfallData();
  }, [auth, navigate]); // 添加auth和navigate作为useEffect的依赖项

  return (
    <div className={styles["snowfall-container"]}>
      <h1>Snowfall Data</h1>
      <button
        className={styles.logout}
        onClick={() => {
          auth.logout();
          navigate("/");
        }}
      >
        Logout
      </button>
      {snowfallData.length > 0 ? (
        <ul>
          {snowfallData.map(({ skiResort, totalSnowfall }) => (
            <li key={skiResort}>
              {skiResort}: {totalSnowfall} mm
            </li>
          ))}
        </ul>
      ) : (
        <p>No snowfall data available.</p>
      )}
    </div>
  );
}

export default Home;
