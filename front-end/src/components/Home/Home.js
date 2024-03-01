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
        const token = await auth.getSession();
        const accessToken = token.access.token;

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/snowfall`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setSnowfallData(response.data.snowfallData);
      } catch (error) {
        console.error("Failed to fetch snowfall data", error);
        if (error.response && error.response.status === 401) {
          auth.logout();
          navigate("/login");
        }
      }
    };

    fetchSnowfallData();
  }, [auth, navigate]);

  // 计算最大降雪量以设置进度条的相对长度
  const maxSnowfall = Math.max(...snowfallData.map(data => data.totalSnowfall), 0);

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
        // React组件的部分更新
        <ul>
          {snowfallData.map(({ skiResort, totalSnowfall }) => (
            <li key={skiResort}>
              <div className={styles["snowfall-info"]}>
                {skiResort}: <span className={styles["snowfall-data"]}>{totalSnowfall} mm</span>
              </div>
              <div className={styles["progress-bar-container"]}>
                <div
                  className={styles["progress-bar"]}
                  style={{ width: `${(totalSnowfall / maxSnowfall) * 100}%` }}
                ></div>
              </div>
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
